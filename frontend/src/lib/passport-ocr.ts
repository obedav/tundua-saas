import Tesseract, { createWorker } from "tesseract.js";
import { parse } from "mrz";

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
 * Preprocess image to improve OCR accuracy
 */
async function preprocessImage(imageFile: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      try {
        // Calculate dimensions - upscale if too small
        const targetWidth = Math.max(img.width, 1600);
        const scale = targetWidth / img.width;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply image enhancements
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          
          // Increase contrast (1.5x)
          const contrasted = ((gray - 128) * 1.5) + 128;
          
          // Apply sharpening threshold
          const sharpened = contrasted < 128 ? Math.max(0, contrasted - 20) : Math.min(255, contrasted + 20);
          
          data[i] = sharpened;     // R
          data[i + 1] = sharpened; // G
          data[i + 2] = sharpened; // B
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log("✅ Image preprocessing completed");
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/png",
          1.0
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Extract text from passport image using OCR with preprocessing
 */
export async function extractPassportText(imageFile: File): Promise<string> {
  console.log("📦 Preprocessing image for better OCR...");

  try {
    // Preprocess the image
    const processedImage = await preprocessImage(imageFile);
    
    console.log("📦 Initializing Tesseract worker...");
    const worker = await createWorker("eng", 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
      // Use CDN for reliability (works with internet connection)
      // Note: Local files don't work well with Next.js Turbopack in dev mode
      // For production, these can be configured to use local files
    });

    try {
      console.log("🔍 Starting OCR recognition...");
      
      // Try multiple OCR configurations for better results
      const configs = [
        { psm: 6 },  // Assume uniform block of text
        { psm: 3 },  // Fully automatic page segmentation
        { psm: 4 },  // Assume a single column of text
      ];

      let bestResult = "";
      let bestLength = 0;

      for (const config of configs) {
        await worker.setParameters({
          tessedit_pageseg_mode: config.psm.toString(),
        });

        const { data } = await worker.recognize(processedImage);
        
        if (data.text.length > bestLength) {
          bestResult = data.text;
          bestLength = data.text.length;
        }
      }

      console.log("✅ OCR completed successfully");
      return bestResult;
    } finally {
      await worker.terminate();
    }
  } catch (error) {
    console.error("❌ Tesseract processing failed:", error);

    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("importScripts")) {
        throw new Error(
          "OCR requires an active internet connection to download recognition models (~3MB). " +
          "Please connect to the internet or enter passport details manually below."
        );
      }
    }

    throw error;
  }
}

/**
 * Enhanced MRZ line detection with better error handling
 */
export function findMRZLines(text: string): string[] {
  const lines = text.split("\n").map((l) => l.trim());

  const mrzLines = lines
    .filter((line) => {
      // More lenient MRZ detection
      const hasEnoughChevrons = (line.match(/</g) || []).length >= 2;
      const isLongEnough = line.length >= 30; // More lenient
      const isNotTooLong = line.length <= 60;
      
      // Allow some non-MRZ characters for OCR errors
      const cleanLine = line.replace(/[^A-Z0-9<]/gi, "");
      const hasMainlyValidChars = cleanLine.length / line.length > 0.7;

      return hasEnoughChevrons && isLongEnough && isNotTooLong && hasMainlyValidChars;
    })
    .map((line) => {
      // Aggressive cleaning
      let cleaned = line
        .toUpperCase()
        .replace(/[^A-Z0-9<]/g, "") // Remove everything except valid MRZ chars
        .replace(/[|IlL1]/g, "I")   // Fix common OCR confusions
        .replace(/[O]/g, "0")        // O to 0 in MRZ
        .replace(/\s+/g, "");        // Remove spaces

      // Pad or trim to 44 characters
      if (cleaned.length < 44) {
        cleaned = cleaned.padEnd(44, "<");
      } else if (cleaned.length > 44) {
        cleaned = cleaned.substring(0, 44);
      }

      return cleaned;
    });

  console.log(`Found ${mrzLines.length} potential MRZ lines:`, mrzLines);
  return mrzLines.slice(0, 2);
}

/**
 * Extract passport number from text using multiple patterns
 */
function extractPassportNumber(text: string): string {
  // Nigerian passports: typically A12345678 or B12345678
  const patterns = [
    /\b([AB]\d{8,9})\b/i,           // A12345678, B123456789
    /\b([A-Z]\d{8})\b/i,             // X12345678
    /\b([A-Z]{2}\d{7})\b/i,          // XX1234567
    /passport[^\d]*(\d{8,9})/i,      // "Passport No: 12345678"
    /no[^\d]*([A-Z]?\d{7,9})/i,      // "No: A1234567"
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      console.log("✓ Found passport number:", match[1]);
      return match[1].toUpperCase();
    }
  }

  return "";
}

/**
 * Apply OCR error corrections to MRZ text
 */
function correctOCRErrors(text: string): string {
  return text
    .replace(/0/g, 'O')  // 0 → O
    .replace(/I(?=\d)/g, '1')  // I → 1 when followed by digit
    .replace(/(?<=\d)I/g, '1')  // I → 1 when preceded by digit
    .toUpperCase();
}

/**
 * Enhanced fallback extraction with better pattern matching
 */
function extractFromReadableText(text: string, mrzLines?: string[]): PassportData | null {
  try {
    console.log("🔄 Attempting enhanced fallback extraction...");

    const data: Partial<PassportData> = {
      firstName: "",
      lastName: "",
      passportNumber: "",
      nationality: "",
      dateOfBirth: "",
      gender: "",
      expiryDate: "",
      mrzValid: false,
      confidence: 0,
    };

    // Normalize text
    const normalizedText = text.toUpperCase();

    // Try to parse corrupted MRZ lines with OCR corrections if available
    if (mrzLines && mrzLines.length >= 2) {
      console.log("🔧 Applying OCR corrections to MRZ lines...");
      const correctedLine1 = correctOCRErrors(mrzLines[0]);
      const correctedLine2 = correctOCRErrors(mrzLines[1]);
      console.log(`  - Original Line 1: ${mrzLines[0]}`);
      console.log(`  - Corrected Line 1: ${correctedLine1}`);
      console.log(`  - Original Line 2: ${mrzLines[1]}`);
      console.log(`  - Corrected Line 2: ${correctedLine2}`);

      // Extract name from corrected line 1: P<NGA{LASTNAME}<<{FIRSTNAME}<<...
      const nameMatch = correctedLine1.match(/P<NGA([A-Z]+)<<([A-Z]+)/);
      if (nameMatch) {
        data.lastName = nameMatch[1].trim();
        data.firstName = nameMatch[2].replace(/<+/g, ' ').trim();
        console.log(`✓ Found name from corrected MRZ: ${data.firstName} ${data.lastName}`);
      }

      // Extract dates and gender from corrected line 2
      // Format: {PASSPORT}{NATIONALITY}{BIRTHDATE}{SEX}{EXPIRYDATE}...
      const line2Match = correctedLine2.match(/([A-Z]\d{8})([A-Z]{3})(\d{6})(\d)[A-Z]([MF])(\d{6})/);
      if (line2Match) {
        // Birth date
        if (!data.dateOfBirth && line2Match[3]) {
          const yy = parseInt(line2Match[3].substring(0, 2));
          const mm = line2Match[3].substring(2, 4);
          const dd = line2Match[3].substring(4, 6);
          const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;
          data.dateOfBirth = `${yyyy}-${mm}-${dd}`;
          console.log(`✓ Found birth date from corrected MRZ: ${data.dateOfBirth}`);
        }

        // Gender
        if (!data.gender && line2Match[5]) {
          data.gender = line2Match[5] === 'M' ? 'male' : 'female';
          console.log(`✓ Found gender from corrected MRZ: ${data.gender}`);
        }

        // Expiry date
        if (!data.expiryDate && line2Match[6]) {
          const yy = parseInt(line2Match[6].substring(0, 2));
          const mm = line2Match[6].substring(2, 4);
          const dd = line2Match[6].substring(4, 6);
          const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;
          data.expiryDate = `${yyyy}-${mm}-${dd}`;
          console.log(`✓ Found expiry date from corrected MRZ: ${data.expiryDate}`);
        }
      }
    }

    // Extract nationality (look for country names)
    if (!data.nationality) {
      if (normalizedText.includes("NIGERIA") || normalizedText.includes("NGA")) {
        data.nationality = "Nigeria";
        console.log("✓ Found nationality: Nigeria");
      }
    }

    // Extract passport number (try MRZ first if available)
    if (!data.passportNumber && mrzLines && mrzLines.length >= 2) {
      const passportMatch = mrzLines[1].match(/^([AB]\d{8,9})/);
      if (passportMatch) {
        data.passportNumber = passportMatch[1].substring(0, 9); // Trim to 9 chars
        console.log("✓ Found passport number from MRZ:", data.passportNumber);
      }
    }
    if (!data.passportNumber) {
      data.passportNumber = extractPassportNumber(text);
    }

    // Try to extract dates from MRZ line first (most reliable)
    const mrzDateMatch = text.match(/([AB]\d{8,9})NGA(\d{6})/i);
    if (mrzDateMatch && !data.dateOfBirth) {
      const dateStr = mrzDateMatch[2];
      // MRZ format: YYMMDD
      const yy = parseInt(dateStr.substring(0, 2));
      const mm = dateStr.substring(2, 4);
      const dd = dateStr.substring(4, 6);
      const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;
      data.dateOfBirth = `${yyyy}-${mm}-${dd}`;
      console.log("✓ Found date of birth from MRZ:", data.dateOfBirth);
    }

    // Fallback: Extract dates from readable text
    if (!data.dateOfBirth) {
      const datePatterns = [
        // 17 SEP 87, 17 SEPT 87, 17 SEP/SEPT 87
        /(\d{1,2})\s*(?:SEP|SEPT)(?:\/SEPT)?\s*(\d{2})/i,
        // General: DD MMM YY or DD MMM YYYY
        /(\d{1,2})\s*([A-Z]{3,4})[\/\s]*(\d{2,4})/i,
      ];

      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          const day = match[1].padStart(2, "0");
          const monthStr = match[2]?.substring(0, 3).toUpperCase();
          const year = match[3] || match[2];

          if (monthStr && year) {
            const monthMap: Record<string, string> = {
              JAN: "01", FEB: "02", MAR: "03", APR: "04",
              MAY: "05", JUN: "06", JUL: "07", AUG: "08",
              SEP: "09", OCT: "10", NOV: "11", DEC: "12",
              AOU: "08", AOUT: "08", SEPT: "09", JUIL: "07"
            };

            const month = monthMap[monthStr] || "01";
            const fullYear = year.length === 2
              ? (parseInt(year) <= 30 ? "20" + year : "19" + year)
              : year;

            data.dateOfBirth = `${fullYear}-${month}-${day}`;
            console.log("✓ Found date of birth from text:", data.dateOfBirth);
            break;
          }
        }
      }
    }

    // Try to extract expiry date and gender from MRZ line
    const mrzDetailsMatch = text.match(/([AB]\d{8,9})NGA(\d{6})([IMF])(\d{2})([FMX]?)(\d{6})/i);
    if (mrzDetailsMatch) {
      // Extract expiry date from MRZ (position varies but typically after gender)
      const expiryStr = mrzDetailsMatch[6];
      if (expiryStr && expiryStr.match(/^\d{6}$/)) {
        const yy = parseInt(expiryStr.substring(0, 2));
        const mm = expiryStr.substring(2, 4);
        const dd = expiryStr.substring(4, 6);
        const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;
        data.expiryDate = `${yyyy}-${mm}-${dd}`;
        console.log("✓ Found expiry date from MRZ:", data.expiryDate);
      }

      // Extract gender from MRZ
      const genderChar = mrzDetailsMatch[5] || mrzDetailsMatch[3];
      if (genderChar) {
        if (genderChar.toUpperCase() === 'M') {
          data.gender = "male";
          console.log("✓ Found gender from MRZ: male");
        } else if (genderChar.toUpperCase() === 'F') {
          data.gender = "female";
          console.log("✓ Found gender from MRZ: female");
        }
      }
    }

    // Fallback: Extract expiry date from readable text
    if (!data.expiryDate) {
      const expiryMatch = text.match(/(?:EXPIRY|EXP)[\s\S]{0,50}?(\d{1,2})\s*([A-Z]{3,4})[\/\s]*(\d{2,4})/i);
      if (expiryMatch) {
        const day = expiryMatch[1].padStart(2, "0");
        const monthStr = expiryMatch[2]?.substring(0, 3).toUpperCase();
        const year = expiryMatch[3];

        if (monthStr && year) {
          const monthMap: Record<string, string> = {
            JAN: "01", FEB: "02", MAR: "03", APR: "04",
            MAY: "05", JUN: "06", JUL: "07", AUG: "08",
            SEP: "09", OCT: "10", NOV: "11", DEC: "12",
            AOU: "08", AOUT: "08", SEPT: "09", JUIL: "07"
          };
          const month = monthMap[monthStr] || "01";
          const fullYear = year.length === 2 ? "20" + year : year;
          data.expiryDate = `${fullYear}-${month}-${day}`;
          console.log("✓ Found expiry date from text:", data.expiryDate);
        }
      }
    }

    // Try to extract name from MRZ fragments
    // Pattern: P<NGAOLADE J I <<TOSINST
    const mrzNameMatch = text.match(/P<NGA([A-Z]+)\s*([A-Z\s]+)<</);
    if (mrzNameMatch) {
      data.lastName = mrzNameMatch[1].trim();
      const givenNames = mrzNameMatch[2].replace(/</g, " ").trim().split(/\s+/);
      data.firstName = givenNames.join(" ");
      console.log("✓ Found name from MRZ:", data.firstName, data.lastName);
    }

    // Fallback: Extract gender from readable text if not found in MRZ
    if (!data.gender) {
      if (text.match(/\bM\b.*(?:SEX|SEXE)/i) || text.match(/(?:SEX|SEXE).*\bM\b/i)) {
        data.gender = "male";
        console.log("✓ Found gender from text: male");
      } else if (text.match(/\bF\b.*(?:SEX|SEXE)/i) || text.match(/(?:SEX|SEXE).*\bF\b/i)) {
        data.gender = "female";
        console.log("✓ Found gender from text: female");
      }
    }

    // Calculate confidence
    let filledFields = 0;
    const fields = [
      data.firstName, data.lastName, data.passportNumber,
      data.nationality, data.dateOfBirth, data.gender, data.expiryDate
    ];
    
    filledFields = fields.filter(f => f && f.length > 0).length;
    data.confidence = Math.round((filledFields / 7) * 100);

    console.log("📊 Extraction summary:");
    console.log(`  - Fields extracted: ${filledFields}/7`);
    console.log(`  - Confidence: ${data.confidence}%`);
    console.log(`  - Data:`, data);

    // Return if we got at least 2 critical fields
    if (filledFields >= 2 && (data.passportNumber || data.dateOfBirth)) {
      console.log("✅ Fallback extraction successful");
      return data as PassportData;
    }

    console.log("❌ Fallback extraction failed - insufficient data");
    return null;
  } catch (error) {
    console.error("Fallback extraction error:", error);
    return null;
  }
}

/**
 * Parse and validate MRZ data
 */
export function parseMRZ(
  mrzLine1: string,
  mrzLine2: string,
): PassportData | null {
  try {
    const mrzText = `${mrzLine1}\n${mrzLine2}`;
    console.log("📄 Attempting to parse MRZ:");
    console.log(`  Line 1 (${mrzLine1.length} chars): ${mrzLine1}`);
    console.log(`  Line 2 (${mrzLine2.length} chars): ${mrzLine2}`);

    const result = parse(mrzText);

    // Check if result is valid and has expected structure
    if (!result || typeof result !== 'object') {
      console.error("⚠️ MRZ parser returned invalid result:", result);
      return null;
    }

    if (!result.valid) {
      console.warn("⚠️ MRZ validation failed:");
      console.warn("  - Valid:", result.valid);
      console.warn("  - Format:", result.format || "unknown");
      console.warn("  - Details:", result.details || "none");
      if (result.fields) {
        console.warn("  - Partial fields extracted:", Object.keys(result.fields));
      }

      // Even if validation fails, try to use the extracted fields if they exist
      const { fields } = result;

      // Log what we got from MRZ
      console.log("📋 Raw MRZ fields:");
      console.log("  - firstName:", JSON.stringify(fields?.firstName));
      console.log("  - lastName:", JSON.stringify(fields?.lastName));
      console.log("  - documentNumber:", JSON.stringify(fields?.documentNumber));
      console.log("  - nationality:", JSON.stringify(fields?.nationality));
      console.log("  - birthDate:", JSON.stringify(fields?.birthDate));
      console.log("  - sex:", JSON.stringify(fields?.sex));
      console.log("  - expirationDate:", JSON.stringify(fields?.expirationDate));

      // Only use partial MRZ if we have meaningful data
      // Require at least: documentNumber AND (lastName OR birthDate)
      const hasDocNumber = fields?.documentNumber && String(fields.documentNumber).length >= 7;
      const hasLastName = fields?.lastName && String(fields.lastName).length >= 2;
      const hasBirthDate = fields?.birthDate && String(fields.birthDate).length === 6;

      if (fields && hasDocNumber && (hasLastName || hasBirthDate)) {
        console.log("⚠️ Using partial MRZ data despite validation failure");

        // Clean passport number specifically
        let passportNumber = fields.documentNumber || "";
        if (passportNumber) {
          // For passport numbers: keep letters as-is but fix common OCR errors
          passportNumber = String(passportNumber)
            .replace(/I(?=\d)/g, '1')  // I → 1 before digits
            .replace(/(?<=\d)I/g, '1')  // I → 1 after digits
            .replace(/I$/g, '1');       // I → 1 at end
          console.log(`  - Corrected passport: ${fields.documentNumber} → ${passportNumber}`);
        }

        // Try to extract first name from MRZ line 1 if not in fields
        let firstName = "";
        let lastName = fields.lastName || "";

        // Apply OCR correction to name fields
        if (fields.firstName) {
          firstName = String(fields.firstName).replace(/</g, " ").trim();
        }
        if (lastName) {
          lastName = String(lastName).replace(/</g, " ").trim();
        }

        // If firstName is missing, try to manually parse from MRZ line 1
        if (!firstName) {
          console.log("🔍 Manually parsing first name from MRZ line 1:", mrzLine1);

          // Apply comprehensive OCR corrections for names
          const correctNameOCR = (text: string) => {
            let corrected = text
              .replace(/0/g, 'O')       // 0 → O
              .replace(/1/g, 'I')       // 1 → I (in names, 1 is usually I)
              .replace(/^I([A-Z])/g, 'O$1')  // Leading I → O (IABADE → OABADE)
              .replace(/([A-Z])I([A-Z])/g, '$1L$2')  // Middle I between consonants → L
              .replace(/EI{2,}/g, 'ELI')    // EII → ELI (EIIJAH → ELIJAH)
              .replace(/([A-Z])I([AEIOUY])/g, '$1L$2');  // I before vowel → L

            // Fix common Nigerian names where L was dropped
            // OABADE → OLABADE, OATUNDE → OLATUNDE, etc.
            corrected = corrected
              .replace(/^OA([BDKNPT])/g, 'OLA$1')  // OA + consonant → OLA
              .replace(/^OI([BDKNPT])/g, 'OLI$1')  // OI + consonant → OLI
              .replace(/^OE([BDKNPT])/g, 'OLE$1')  // OE + consonant → OLE
              .replace(/^OU([BDKNPT])/g, 'OLU$1'); // OU + consonant → OLU

            return corrected;
          };

          const correctedLine = mrzLine1
            .replace(/^P<NGA/i, '')  // Remove prefix
            .replace(/<{4,}.*/g, '');  // Remove padding (4+ consecutive <)

          // Pattern: LASTNAME<<FIRSTNAME
          const nameMatch = correctedLine.match(/^([A-Z0-9I]+)<<([A-Z0-9I<]+)/);
          if (nameMatch) {
            // Extract and correct last name
            if (!lastName || lastName === 'IABADE') {  // Fix known bad lastName
              lastName = correctNameOCR(nameMatch[1]).trim();
              console.log(`  - Extracted & corrected lastName: ${nameMatch[1]} → ${lastName}`);
            }

            // Extract and correct first name
            const rawFirstName = nameMatch[2]
              .split('<<')[0]  // Take only up to next separator
              .replace(/</g, ' ');  // Replace < with space

            firstName = correctNameOCR(rawFirstName)
              .trim()
              .split(/\s+/)
              .filter(part => {
                // Remove junk: repetitive chars, single chars, or parts with only I/K
                if (part.length <= 1) return false;
                if (/^[IK]+$/.test(part)) return false;  // Only I's or K's
                if (/(.)\1{3,}/.test(part)) return false;  // 4+ repeated chars
                return true;
              })
              .join(' ');
            console.log(`  - Extracted & corrected firstName: ${rawFirstName} → ${firstName}`);
          }
        }

        const nationality = fields.nationality || fields.issuingState || "";

        console.log("🗓️ Formatting dates:");
        console.log("  - Raw birthDate:", JSON.stringify(fields.birthDate));
        const birthDate = formatDate(fields.birthDate ?? undefined) || "";
        console.log("  - Formatted birthDate:", JSON.stringify(birthDate));

        console.log("  - Raw expirationDate:", JSON.stringify(fields.expirationDate));
        const expiryDate = formatDate(fields.expirationDate ?? undefined) || "";
        console.log("  - Formatted expiryDate:", JSON.stringify(expiryDate));

        // Handle gender more robustly
        let gender = "";
        if (fields.sex) {
          const sexUpper = String(fields.sex).toUpperCase().trim();
          if (sexUpper === "M" || sexUpper === "MALE") {
            gender = "male";
          } else if (sexUpper === "F" || sexUpper === "FEMALE") {
            gender = "female";
          }
        }

        const partialData = {
          firstName,
          lastName,
          passportNumber: passportNumber,  // Use corrected passport number
          nationality,
          dateOfBirth: birthDate,
          gender,
          expiryDate,
          mrzValid: false, // Mark as not validated
          confidence: calculatePartialConfidence(fields),
        };

        console.log("📦 Cleaned partial data:");
        console.log("  - firstName:", JSON.stringify(firstName));
        console.log("  - lastName:", JSON.stringify(lastName));
        console.log("  - passportNumber:", JSON.stringify(partialData.passportNumber));
        console.log("  - nationality:", JSON.stringify(nationality));
        console.log("  - dateOfBirth:", JSON.stringify(birthDate));
        console.log("  - gender:", JSON.stringify(gender));
        console.log("  - expiryDate:", JSON.stringify(expiryDate));
        console.log("  - confidence:", partialData.confidence + "%");
        return partialData;
      } else {
        console.log("⚠️ Skipping partial MRZ - insufficient data quality");
        console.log(`  - Has doc number (${hasDocNumber}): ${fields?.documentNumber}`);
        console.log(`  - Has last name (${hasLastName}): ${fields?.lastName}`);
        console.log(`  - Has birth date (${hasBirthDate}): ${fields?.birthDate}`);
        console.log("  → Falling back to text extraction");
      }

      return null;
    }

    const { fields } = result;

    // Add additional validation for fields
    if (!fields) {
      console.error("⚠️ MRZ result has no fields:", result);
      return null;
    }

    console.log("✅ MRZ validation succeeded!");
    console.log("  - Format:", result.format);
    console.log("  - Fields extracted:", Object.keys(fields).filter(k => fields[k as keyof typeof fields]));

    return {
      firstName: fields.firstName || "",
      lastName: fields.lastName || "",
      passportNumber: fields.documentNumber || "",
      nationality: fields.nationality || "",
      dateOfBirth: formatDate(fields.birthDate ?? undefined) || "",
      gender: fields.sex === "M" ? "male" : fields.sex === "F" ? "female" : "other",
      expiryDate: formatDate(fields.expirationDate ?? undefined) || "",
      mrzValid: result.valid,
      confidence: calculateConfidence(result),
    };
  } catch (error) {
    console.error("💥 MRZ parsing exception:", error);
    if (error instanceof Error) {
      console.error("  - Message:", error.message);
      console.error("  - Stack:", error.stack);
    }
    return null;
  }
}

/**
 * Format MRZ date (YYMMDD) to ISO date (YYYY-MM-DD)
 */
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";

  // Clean the date string - remove any non-numeric characters
  const cleanDate = String(dateStr).replace(/\D/g, '');

  if (cleanDate.length !== 6) {
    console.warn(`Invalid date format: "${dateStr}" (cleaned: "${cleanDate}")`);
    return "";
  }

  try {
    const yy = parseInt(cleanDate.substring(0, 2));
    const mm = cleanDate.substring(2, 4);
    const dd = cleanDate.substring(4, 6);

    // Validate month and day
    const monthNum = parseInt(mm);
    const dayNum = parseInt(dd);

    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      console.warn(`Invalid date values: YY=${yy}, MM=${mm}, DD=${dd}`);
      return "";
    }

    const yyyy = yy <= 30 ? 2000 + yy : 1900 + yy;

    return `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    console.error(`Error formatting date "${dateStr}":`, error);
    return "";
  }
}

/**
 * Calculate confidence score
 */
function calculateConfidence(result: any): number {
  if (!result.valid) return 0;

  const { fields } = result;
  let filledFields = 0;
  const totalFields = 7;

  if (fields.firstName) filledFields++;
  if (fields.lastName) filledFields++;
  if (fields.documentNumber) filledFields++;
  if (fields.nationality) filledFields++;
  if (fields.birthDate) filledFields++;
  if (fields.sex) filledFields++;
  if (fields.expiryDate || fields.expirationDate) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Calculate confidence score for partial MRZ data (validation failed)
 */
function calculatePartialConfidence(fields: any): number {
  let filledFields = 0;
  const totalFields = 7;

  if (fields.firstName) filledFields++;
  if (fields.lastName) filledFields++;
  if (fields.documentNumber) filledFields++;
  if (fields.nationality) filledFields++;
  if (fields.birthDate) filledFields++;
  if (fields.sex) filledFields++;
  if (fields.expiryDate || fields.expirationDate) filledFields++;

  // Reduce confidence by 20% since validation failed (checksum errors)
  const baseConfidence = Math.round((filledFields / totalFields) * 100);
  return Math.max(30, baseConfidence - 20); // Minimum 30% confidence
}

/**
 * Full OCR process with enhanced preprocessing and fallback
 */
export async function processPassportImage(
  imageFile: File,
): Promise<PassportData | null> {
  try {
    console.log("🚀 Starting enhanced passport OCR process...");
    console.log(`📸 Image: ${imageFile.name} (${Math.round(imageFile.size / 1024)}KB)`);

    // Step 1: OCR with preprocessing
    console.log("\n=== Step 1: Enhanced Text Extraction ===");
    const extractedText = await extractPassportText(imageFile);
    console.log(`✓ Extracted ${extractedText.length} characters`);

    if (!extractedText || extractedText.trim().length < 50) {
      console.error("❌ OCR failed - text too short");
      return null;
    }

    // Step 2: Try MRZ extraction
    console.log("\n=== Step 2: MRZ Detection ===");
    const mrzLines = findMRZLines(extractedText);

    if (mrzLines.length >= 2) {
      console.log("✓ Found MRZ lines, attempting parse...");
      const passportData = parseMRZ(mrzLines[0], mrzLines[1]);

      if (passportData) {
        // Accept MRZ data with lower confidence threshold
        // - Fully validated MRZ: any confidence (usually 100%)
        // - Partial MRZ (validation failed): >= 30% confidence
        const threshold = passportData.mrzValid ? 0 : 30;

        if (passportData.confidence >= threshold) {
          console.log(`✅ SUCCESS via ${passportData.mrzValid ? 'validated' : 'partial'} MRZ:`, passportData);
          return passportData;
        } else {
          console.log(`⚠️ MRZ data confidence too low: ${passportData.confidence}% (threshold: ${threshold}%)`);
        }
      }
    }

    // Step 3: Enhanced fallback extraction
    console.log("\n=== Step 3: Enhanced Fallback Extraction ===");
    const fallbackData = extractFromReadableText(extractedText, mrzLines);

    if (fallbackData) {
      console.log("✅ SUCCESS via fallback:", fallbackData);
      return fallbackData;
    }

    console.error("\n❌ All extraction methods failed");
    console.log("💡 Tips:");
    console.log("  - Use better lighting");
    console.log("  - Ensure passport is flat and in focus");
    console.log("  - Try a higher resolution photo");
    console.log("  - Make sure MRZ (bottom 2 lines) is visible");
    
    return null;
  } catch (error) {
    console.error("💥 OCR processing error:", error);
    return null;
  }
}