/**
 * Google Gemini AI Provider
 *
 * FREE TIER:
 * - 1,500 requests per day
 * - 60 requests per hour
 * - 4M tokens per day
 *
 * Get API key: https://makersuite.google.com/app/apikey
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini with API key
const getGeminiClient = () => {
  const apiKey = process.env['GOOGLE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY']

  if (!apiKey) {
    throw new Error('Google Gemini API key not configured')
  }

  return new GoogleGenerativeAI(apiKey)
}

interface GenerateOptions {
  prompt: string
  temperature?: number
  maxTokens?: number
  model?: 'models/gemini-2.5-flash' | 'models/gemini-2.5-pro' | 'models/gemini-flash-latest'
}

/**
 * Generate text using Google Gemini
 */
export async function generateWithGemini({
  prompt,
  temperature = 0.7,
  maxTokens = 4000,
  model = 'models/gemini-2.5-flash' // Free tier - fastest and most capable!
}: GenerateOptions): Promise<{
  text: string
  tokensUsed: number
  model: string
}> {
  try {
    const genAI = getGeminiClient()
    const geminiModel = genAI.getGenerativeModel({ model })

    // Log request details
    console.log('📝 Gemini Request:', {
      promptLength: prompt.length,
      promptWords: prompt.split(/\s+/).length,
      maxOutputTokens: maxTokens,
      estimatedInputTokens: Math.ceil(prompt.length / 4),
      model
    })

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    })

    const response = result.response

    // Debug: Log response metadata
    console.log('📊 Gemini Response Metadata:', {
      usageMetadata: response.usageMetadata,
      modelVersion: (response as any).modelVersion,
      candidatesCount: response.candidates?.length
    })

    // Debug: Log full candidate structure
    if (response?.candidates?.[0]) {
      console.log('Gemini Candidate Structure:', JSON.stringify(response.candidates[0], null, 2).substring(0, 500))
    }

    // Extract text from response
    let text = ''

    // Method 1: Use built-in text() method
    if (typeof response.text === 'function') {
      try {
        text = response.text()
      } catch (e: any) {
        console.error('Error calling response.text():', e.message)
      }
    }

    // Method 2: Manual extraction if text() failed
    if (!text && response.candidates?.[0]) {
      const candidate = response.candidates[0]

      // Try different possible structures
      if (candidate.content?.parts?.[0]?.text) {
        text = candidate.content.parts[0].text
      } else if ((candidate as any).text) {
        text = (candidate as any).text
      } else if (typeof candidate.content === 'string') {
        text = candidate.content as string
      }

      if (text) {
        console.log('✅ Manually extracted text from candidate')
      }
    }

    console.log('Gemini Final Result:', {
      finishReason: response.candidates?.[0]?.finishReason,
      textLength: text?.length,
      hasText: !!text,
      firstChars: text?.substring(0, 100)
    })

    // Estimate tokens (Gemini doesn't return exact count in free tier)
    const estimatedTokens = Math.ceil((prompt.length + text.length) / 4)

    return {
      text,
      tokensUsed: estimatedTokens,
      model
    }
  } catch (error: any) {
    if (error.message?.includes('quota')) {
      throw new Error('Daily quota exceeded. Free tier: 1,500 requests/day')
    }
    throw error
  }
}

/**
 * Generate SOP using Gemini
 */
export async function generateSOPWithGemini(data: {
  fullName: string
  academicBackground: string
  careerGoals: string
  whyThisProgram: string
  targetDegree: string
  targetUniversity: string
  tone: string
  wordCount: number
}): Promise<string> {
  const prompt = `You are an expert SOP writer. Generate a ${data.wordCount}-word Statement of Purpose.

**Student Information:**
Name: ${data.fullName}
Target: ${data.targetDegree} at ${data.targetUniversity}

**Academic Background:**
${data.academicBackground}

**Career Goals:**
${data.careerGoals}

**Why This Program:**
${data.whyThisProgram}

**Tone:** ${data.tone}

Generate a compelling, professional SOP that:
- Is exactly ${data.wordCount} words
- Has a strong opening hook
- Connects academic background to career goals
- Explains why this specific program
- Shows genuine passion and fit
- Uses ${data.tone} tone throughout

Output ONLY the SOP text, no additional commentary.`

  const result = await generateWithGemini({
    prompt,
    temperature: 0.8,
    maxTokens: Math.ceil(data.wordCount * 6), // 6x for Gemini 2.5 thinking tokens (700 words = 4200 tokens)
    model: 'models/gemini-2.5-flash' // Fast and free!
  })

  console.log('Gemini SOP Response:', {
    textLength: result.text.length,
    firstChars: result.text.substring(0, 100),
    tokensUsed: result.tokensUsed
  })

  if (!result.text || result.text.trim().length === 0) {
    throw new Error('Gemini returned empty SOP text')
  }

  return result.text
}

/**
 * Generate University Report using Gemini
 */
export async function generateUniversityReportWithGemini(data: {
  field: string
  degree: string
  gpa: number
  budget: number
  country?: string
  priorities?: string[]
}): Promise<any> {
  const prompt = `Generate a personalized university selection report with 10 recommendations.

**Student Profile:**
Field: ${data.field}
Degree Level: ${data.degree}
GPA: ${data.gpa}/4.0
Annual Tuition Budget: $${data.budget} USD (CRITICAL: This is the TUITION BUDGET ONLY, not including living expenses. Prioritize universities with tuition fees at or below this amount.)
${data.country ? `Preferred Country: ${data.country} (IMPORTANT: Recommend ONLY universities in ${data.country})` : 'Country: Any (recommend diverse countries)'}
Priorities: ${data.priorities?.join(', ') || 'N/A'}

**IMPORTANT BUDGET INSTRUCTION:**
- The annual budget of $${data.budget} USD is for TUITION FEES ONLY (living expenses are separate)
- PRIORITIZE universities where annual tuition fees are within or close to this budget
- If recommending universities above budget, clearly state the tuition gap and explain scholarship opportunities
- Sort recommendations by tuition cost (lowest tuition first)
- Mention estimated living expenses separately for context, but do NOT include them in budget calculations

For each university, provide:
1. Name and country
2. Ranking (if top 200)
3. Tuition range
4. CAS deposit (for UK universities) - amount required and if refundable
5. Estimated living costs (separate from tuition)
6. Admission probability (high/medium/low)
7. Why this is a good fit
8. Program strengths (3-5 points)

Output as JSON array with this structure:
{
  "summary": "Brief overview",
  "recommendations": [
    {
      "name": "University Name",
      "country": "Country",
      "ranking": "#50 QS World",
      "tuitionRange": "$30,000-35,000/year",
      "casDeposit": "$2,500 (refundable against first year tuition)" or "Not specified" or null,
      "livingCosts": "$12,000-15,000/year estimated",
      "admissionProbability": "high",
      "reasoning": "Why this fits",
      "strengths": ["Strength 1", "Strength 2"],
      "programFit": "Specific program details"
    }
  ],
  "admissionTips": ["Tip 1", "Tip 2"]
}

CRITICAL ACCURACY NOTES:
- ALL financial figures (tuition, deposits, living costs) are ESTIMATES ONLY
- Add "(estimated - verify with university)" after all financial figures
- CAS deposits vary widely: from £2,000 to 50% of annual tuition - be conservative
- Include note: "Contact university directly for current fees and deposit requirements"
- Living costs are approximate regional averages
- Scholarship information changes frequently - recommend checking university websites
- Focus on program fit and quality - financial data is for guidance only`

  const result = await generateWithGemini({
    prompt,
    temperature: 0.3, // Even lower temperature = less thinking, more output
    maxTokens: 20000, // Increased to account for Gemini 2.5 Flash's extended thinking
    model: 'models/gemini-2.5-flash'
  })

  // Parse JSON from response
  const jsonMatch = result.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to parse university recommendations - no JSON found in response')
  }

  try {
    return JSON.parse(jsonMatch[0])
  } catch (parseError: any) {
    // If JSON is incomplete, try to extract what we can
    console.error('JSON parse error:', parseError.message)
    console.log('Incomplete JSON:', jsonMatch[0].substring(0, 500))
    throw new Error('Failed to parse university recommendations - incomplete JSON response. Please try again.')
  }
}

/**
 * Optimize Resume using Gemini
 */
export async function optimizeResumeWithGemini(data: {
  currentResume: string
  targetField: string
  targetLevel: string
}): Promise<any> {
  const prompt = `Analyze and optimize this resume for ${data.targetField} (${data.targetLevel}).

**Current Resume:**
${data.currentResume}

Provide:
1. Optimized version with stronger action verbs, quantified achievements, ATS keywords
2. Overall quality score (0-100)
3. Improvement categories with specific suggestions
4. Missing elements

Output as JSON:
{
  "optimizedResume": "Full optimized text",
  "overallScore": 85,
  "improvements": [
    {
      "category": "Action Verbs",
      "suggestions": ["Change 'did' to 'executed'"]
    }
  ],
  "missingElements": ["Technical skills section"]
}`

  const result = await generateWithGemini({
    prompt,
    temperature: 0.5, // Lower temperature = less thinking, more output
    maxTokens: 12000, // Increased for complex JSON output with thinking tokens
    model: 'models/gemini-2.5-flash'
  })

  const jsonMatch = result.text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0])
  }

  throw new Error('Failed to parse resume optimization')
}
