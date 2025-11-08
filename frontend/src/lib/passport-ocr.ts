import Tesseract from 'tesseract.js';
import { parse } from 'mrz';

export interface PassportData {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  expiryDate: string;
  mrzValid: boolean;
  confidence: number;
}

/**
 * Extract text from passport image using OCR
 */
export async function extractPassportText(
  imageFile: File
): Promise<string> {
  const { data } = await Tesseract.recognize(imageFile, 'eng', {
    logger: (m) => console.log(m),
    // Optimize for speed - passports are high-quality documents
    tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    preserve_interword_spaces: '1',
  });

  return data.text;
}

/**
 * Find MRZ lines in extracted text
 * MRZ format: 2 lines, 44 characters each
 * Enhanced to handle OCR errors and partial extractions
 */
export function findMRZLines(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim());

  // Look for lines with typical MRZ characters (<, numbers, letters)
  const mrzLines = lines
    .filter(line => {
      // MRZ lines are typically 44 characters but allow 36+ for OCR errors
      // Must contain << or multiple < symbols (typical in MRZ)
      const hasMultipleFillersOrDoubleChevron = (line.match(/</g) || []).length >= 2;
      const isLongEnough = line.length >= 36;
      const isNotTooLong = line.length <= 50; // Filter out concatenated lines
      const hasMRZPattern = /^[A-Z0-9<]+$/.test(line); // Only uppercase, numbers, and <

      return isLongEnough && isNotTooLong && hasMultipleFillersOrDoubleChevron && hasMRZPattern;
    })
    .map(line => {
      // Clean up common OCR errors
      let cleaned = line
        .replace(/[|Il1]/g, 'I') // Fix common OCR confusions
        .replace(/[O0]/g, 'O')
        .replace(/\s+/g, '') // Remove all spaces
        .toUpperCase();

      // Pad to 44 characters if needed (standard MRZ length)
      if (cleaned.length < 44) {
        cleaned = cleaned.padEnd(44, '<');
      }

      return cleaned;
    });

  console.log(`Found ${mrzLines.length} potential MRZ lines:`, mrzLines);
  return mrzLines.slice(0, 2); // First 2 MRZ lines
}

/**
 * Parse and validate MRZ data
 */
export function parseMRZ(mrzLine1: string, mrzLine2: string): PassportData | null {
  try {
    // Combine MRZ lines
    const mrzText = `${mrzLine1}\n${mrzLine2}`;

    // Parse MRZ using mrz library
    const result = parse(mrzText);

    if (!result.valid) {
      console.error('MRZ validation failed:', result);
      return null;
    }

    // Extract data
    const { fields } = result;

    return {
      firstName: fields.firstName || '',
      lastName: fields.lastName || '',
      passportNumber: fields.documentNumber || '',
      nationality: fields.nationality || '',
      dateOfBirth: formatDate(fields.birthDate ?? undefined) || '',
      gender: fields.sex === 'M' ? 'male' : fields.sex === 'F' ? 'female' : 'other',
      expiryDate: formatDate((fields as any).expiryDate ?? undefined) || '',
      mrzValid: result.valid,
      confidence: calculateConfidence(result),
    };
  } catch (error) {
    console.error('MRZ parsing error:', error);
    return null;
  }
}

/**
 * Format MRZ date (YYMMDD) to ISO date (YYYY-MM-DD)
 */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.length !== 6) return '';

  const yy = parseInt(dateStr.substring(0, 2));
  const mm = dateStr.substring(2, 4);
  const dd = dateStr.substring(4, 6);

  // Assume 20xx for years 00-30, 19xx for years 31-99
  const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(result: any): number {
  if (!result.valid) return 0;

  // Check how many fields were successfully extracted
  const { fields } = result;
  let filledFields = 0;
  let totalFields = 7;

  if (fields.firstName) filledFields++;
  if (fields.lastName) filledFields++;
  if (fields.documentNumber) filledFields++;
  if (fields.nationality) filledFields++;
  if (fields.birthDate) filledFields++;
  if (fields.sex) filledFields++;
  if (fields.expiryDate) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Fallback: Extract passport data from readable text (when MRZ fails)
 */
function extractFromReadableText(text: string): PassportData | null {
  try {
    console.log('🔄 Attempting fallback text extraction...');

    const lines = text.split('\n').map(l => l.trim());

    // Initialize data
    const data: Partial<PassportData> = {
      firstName: '',
      lastName: '',
      passportNumber: '',
      nationality: '',
      dateOfBirth: '',
      gender: '',
      expiryDate: '',
      mrzValid: false,
      confidence: 0,
    };

    // Extract fields using patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

      // Surname/Last name (usually labeled)
      if (line.match(/surname|nom/i) && nextLine && !data.lastName) {
        data.lastName = nextLine.replace(/[^A-Z\s]/gi, '').trim();
      }

      // Given names/First name
      if (line.match(/given\s*names|pr[eé]noms/i) && nextLine && !data.firstName) {
        data.firstName = nextLine.replace(/[^A-Z\s]/gi, '').trim();
      }

      // Nationality
      if (line.match(/nationality|nationalit[eé]/i) && nextLine && !data.nationality) {
        const nat = nextLine.replace(/[^A-Z\s]/gi, '').trim();
        const natLower = nat.toLowerCase();

        // Common nationality adjectives to country names
        const nationalityMap: Record<string, string> = {
          'nigerian': 'Nigeria', 'kenyan': 'Kenya', 'ghanaian': 'Ghana',
          'south african': 'South Africa', 'egyptian': 'Egypt', 'ethiopian': 'Ethiopia',
          'indian': 'India', 'pakistani': 'Pakistan', 'bangladeshi': 'Bangladesh',
          'chinese': 'China', 'japanese': 'Japan', 'korean': 'South Korea',
          'american': 'United States', 'canadian': 'Canada', 'mexican': 'Mexico',
          'british': 'United Kingdom', 'french': 'France', 'german': 'Germany',
          'italian': 'Italy', 'spanish': 'Spain', 'brazilian': 'Brazil',
        };

        // ISO 3-letter codes
        const isoMap: Record<string, string> = {
          'NGA': 'Nigeria', 'KEN': 'Kenya', 'GHA': 'Ghana', 'ZAF': 'South Africa',
          'IND': 'India', 'PAK': 'Pakistan', 'BGD': 'Bangladesh', 'CHN': 'China',
          'USA': 'United States', 'CAN': 'Canada', 'GBR': 'United Kingdom',
          'FRA': 'France', 'DEU': 'Germany', 'ITA': 'Italy', 'ESP': 'Spain',
        };

        // Check nationality map
        let found = false;
        for (const [key, value] of Object.entries(nationalityMap)) {
          if (natLower.includes(key)) {
            data.nationality = value;
            found = true;
            break;
          }
        }

        // Check ISO code if not found
        if (!found && isoMap[nat]) {
          data.nationality = isoMap[nat];
        } else if (!found) {
          // Capitalize as fallback
          data.nationality = nat.charAt(0).toUpperCase() + nat.slice(1).toLowerCase();
        }
      }

      // Date of Birth (various formats)
      if (line.match(/date\s*of\s*birth|date\s*de\s*naissance/i)) {
        const dateMatch = nextLine.match(/(\d{1,2})\s*[A-Z]{3}[A-Z]*[\s\/]*[A-Z]*\s*(\d{2,4})/i);
        if (dateMatch && !data.dateOfBirth) {
          const day = dateMatch[1].padStart(2, '0');
          const monthStr = nextLine.match(/[A-Z]{3}/i)?.[0]?.toUpperCase();
          const year = dateMatch[2];

          const monthMap: Record<string, string> = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
            'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
            'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12',
            'AOU': '08', 'AOUT': '08', 'SEPT': '09'
          };

          const month = monthStr ? monthMap[monthStr.substring(0, 3)] || '01' : '01';
          const fullYear = year.length === 2 ? (parseInt(year) <= 30 ? '20' + year : '19' + year) : year;

          data.dateOfBirth = `${fullYear}-${month}-${day}`;
        }
      }

      // Sex/Gender
      if (line.match(/sex|sexe/i) && nextLine && !data.gender) {
        const sex = nextLine.trim().toUpperCase();
        if (sex === 'M') data.gender = 'male';
        else if (sex === 'F') data.gender = 'female';
        else data.gender = 'other';
      }

      // Expiry Date
      if (line.match(/date\s*of\s*expiry|date\s*d.expiration/i)) {
        const dateMatch = nextLine.match(/(\d{1,2})\s*[A-Z]{3}[A-Z]*[\s\/]*[A-Z]*\s*(\d{2,4})/i);
        if (dateMatch && !data.expiryDate) {
          const day = dateMatch[1].padStart(2, '0');
          const monthStr = nextLine.match(/[A-Z]{3}/i)?.[0]?.toUpperCase();
          const year = dateMatch[2];

          const monthMap: Record<string, string> = {
            'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
            'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
            'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12',
            'AOU': '08', 'AOUT': '08', 'SEPT': '09'
          };

          const month = monthStr ? monthMap[monthStr.substring(0, 3)] || '01' : '01';
          const fullYear = year.length === 2 ? '20' + year : year;

          data.expiryDate = `${fullYear}-${month}-${day}`;
        }
      }

      // Passport number (usually alphanumeric, 6-9 characters)
      if (!data.passportNumber) {
        const passportMatch = line.match(/\b([A-Z]{1,2}\d{6,8})\b/);
        if (passportMatch) {
          data.passportNumber = passportMatch[1];
        }
      }
    }

    // Calculate confidence based on filled fields
    let filledFields = 0;
    if (data.firstName) filledFields++;
    if (data.lastName) filledFields++;
    if (data.passportNumber) filledFields++;
    if (data.nationality) filledFields++;
    if (data.dateOfBirth) filledFields++;
    if (data.gender) filledFields++;
    if (data.expiryDate) filledFields++;

    data.confidence = Math.round((filledFields / 7) * 100);

    // Only return if we got at least 4 fields
    if (filledFields >= 4) {
      console.log('✅ Fallback extraction successful:', data);
      return data as PassportData;
    }

    console.log('❌ Fallback extraction failed - not enough fields');
    return null;
  } catch (error) {
    console.error('Fallback extraction error:', error);
    return null;
  }
}

/**
 * Full OCR process: Extract → Find MRZ → Parse → Validate → Fallback if needed
 */
export async function processPassportImage(
  imageFile: File
): Promise<PassportData | null> {
  try {
    // Step 1: OCR - Extract text
    console.log('Step 1: Extracting text from passport image...');
    const extractedText = await extractPassportText(imageFile);
    console.log('Extracted text:', extractedText);

    // Step 2: Find MRZ lines
    console.log('Step 2: Searching for MRZ lines...');
    const mrzLines = findMRZLines(extractedText);

    // Step 3: Try MRZ parsing if we have 2 lines
    if (mrzLines.length >= 2) {
      console.log('MRZ Line 1:', mrzLines[0]);
      console.log('MRZ Line 2:', mrzLines[1]);

      console.log('Step 3: Parsing and validating MRZ...');
      const passportData = parseMRZ(mrzLines[0], mrzLines[1]);

      if (passportData) {
        console.log('✅ Passport data extracted successfully via MRZ:', passportData);
        return passportData;
      }

      console.warn('⚠️ MRZ parsing failed, trying fallback extraction...');
    } else {
      console.warn(`⚠️ Found ${mrzLines.length} MRZ lines (need 2), trying fallback extraction...`);
    }

    // Step 4: Fallback - Extract from readable text
    console.log('Step 4: Attempting fallback text extraction...');
    const fallbackData = extractFromReadableText(extractedText);

    if (fallbackData) {
      console.log('✅ Passport data extracted via fallback method:', fallbackData);
      return fallbackData;
    }

    console.error('❌ All extraction methods failed');
    return null;
  } catch (error) {
    console.error('Passport OCR processing error:', error);
    return null;
  }
}
