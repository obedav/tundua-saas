import { NextResponse } from 'next/server'
import { generateWithGemini } from '@/lib/ai-providers/gemini-provider'

export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env['GOOGLE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY']

    if (!apiKey) {
      return NextResponse.json({
        error: 'Gemini API key not found',
        checked: ['GOOGLE_GEMINI_API_KEY', 'GEMINI_API_KEY'],
        available: Object.keys(process.env).filter(key => key.includes('GEMINI'))
      }, { status: 500 })
    }

    // Test simple generation
    const result = await generateWithGemini({
      prompt: 'Say "Hello from Gemini!" in exactly 5 words.',
      temperature: 0.7,
      maxTokens: 50
    })

    return NextResponse.json({
      success: true,
      message: 'Gemini is working!',
      test_response: result.text,
      tokens_used: result.tokensUsed,
      model: result.model
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      name: error.name
    }, { status: 500 })
  }
}
