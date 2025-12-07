import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env['GOOGLE_GEMINI_API_KEY'] || process.env['GEMINI_API_KEY']

    if (!apiKey) {
      return NextResponse.json({
        error: 'API key not configured'
      }, { status: 500 })
    }

    // Note: GoogleGenerativeAI doesn't expose a listModels method in the current API
    // Return a list of commonly available Gemini models instead
    const modelList = [
      {
        name: 'gemini-2.0-flash-exp',
        displayName: 'Gemini 2.0 Flash (Experimental)',
        description: 'Latest experimental flash model'
      },
      {
        name: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        description: 'Pro model with advanced capabilities'
      },
      {
        name: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        description: 'Fast and efficient model'
      }
    ]

    return NextResponse.json({
      success: true,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      totalModels: modelList.length,
      models: modelList
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
