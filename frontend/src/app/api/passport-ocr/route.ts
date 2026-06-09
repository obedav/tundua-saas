import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cookies } from 'next/headers';


export async function POST(request: NextRequest) {
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userResponse = await fetch(
      `${process.env['NEXT_PUBLIC_API_URL']}/api/v1/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    const user = userData.user || userData.data || userData;

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const apiKey = process.env['GOOGLE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      {
        text: `You are a passport data extraction system. Analyze this passport image and extract the following fields.

IMPORTANT INSTRUCTIONS:
- Read the MRZ (Machine Readable Zone) at the bottom of the passport - the 2 lines of characters with <<< separators
- Also read the printed text fields (Visual Inspection Zone) above the MRZ
- Cross-reference both zones for accuracy
- For dates, use YYYY-MM-DD format
- For gender, use "male" or "female"
- For nationality, use the full country name (e.g., "Nigeria" not "NGA")
- If a field cannot be determined, use an empty string ""
- Return ONLY valid JSON, no markdown, no code blocks

Return this exact JSON structure:
{
  "firstName": "",
  "lastName": "",
  "passportNumber": "",
  "nationality": "",
  "dateOfBirth": "",
  "gender": "",
  "expiryDate": "",
  "confidence": 0
}

Set confidence as a percentage (0-100) based on how clearly you can read the data.
- 90-100: All fields clearly readable
- 70-89: Most fields readable, some uncertain
- 50-69: Several fields unclear
- Below 50: Poor image quality`,
      },
    ]);

    const responseText = result.response.text().trim();

    
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonStr = jsonMatch[1].trim();
    }

    const passportData = JSON.parse(jsonStr);

    // Validate required structure
    const requiredFields = ['firstName', 'lastName', 'passportNumber', 'nationality', 'dateOfBirth', 'gender', 'expiryDate'];
    for (const field of requiredFields) {
      if (!(field in passportData)) {
        passportData[field] = '';
      }
    }

    passportData.mrzValid = passportData.confidence >= 70;

    return NextResponse.json({
      success: true,
      data: passportData,
    });
  } catch (error: any) {
    console.error('Passport OCR error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'OCR processing failed' },
      { status: 500 }
    );
  }
}
