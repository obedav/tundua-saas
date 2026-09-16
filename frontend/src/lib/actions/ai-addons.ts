'use server'

import { cookies } from 'next/headers'
import {
  generateSOP,
  generateUniversityReport,
  optimizeResume,
  estimateAddonTokens,
  type SOPGenerationRequest,
  type SOPGenerationResponse,
  type UniversityReportRequest,
  type UniversityReportResponse,
  type ResumeOptimizationRequest,
  type ResumeOptimizationResponse,
} from '@/lib/ai-addons-generator'
import { rateLimiters } from '@/lib/rate-limit'
import { trackAIUsage } from '@/lib/ai-usage-tracker'

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    tokensUsed?: number
    duration?: number
    rateLimitRemaining?: number
    generatedAt?: string
  }
}

// Decode JWT payload without verification — used only to extract the user ID
// for rate-limit keying. The backend still validates the token on every AI call.
function decodeTokenPayload(token: string): { sub?: number; uuid?: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'))
  } catch {
    return null
  }
}

export async function generateSOPAction(
  request: SOPGenerationRequest
): Promise<ActionResponse<SOPGenerationResponse>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { success: false, error: 'Authentication required. Please log in.' }
  }

  const userId = decodeTokenPayload(token)?.sub ?? 0
  const rateLimitResult = await rateLimiters.ai.limit(`user:${userId}`)

  if (!rateLimitResult.success) {
    return {
      success: false,
      error: 'AI rate limit exceeded. Please wait before generating again.',
    }
  }

  if (!request.fullName || !request.academicBackground || !request.careerGoals) {
    return {
      success: false,
      error: 'Missing required fields: fullName, academicBackground, careerGoals',
    }
  }

  if (!request.whyThisProgram && request.targetUniversity && request.targetDegree) {
    request.whyThisProgram = `I am interested in ${request.targetDegree} at ${request.targetUniversity} because it aligns with my career goals and academic background.`
  }

  const minWords = 200
  const academicWords = request.academicBackground.split(/\s+/).filter(Boolean).length
  const careerWords = request.careerGoals.split(/\s+/).filter(Boolean).length
  const whyProgramWords = (request.whyThisProgram || '').split(/\s+/).filter(Boolean).length

  const isCustomMode = academicWords >= 50 || careerWords >= 50
  if (isCustomMode && (academicWords < minWords || careerWords < minWords || whyProgramWords < minWords)) {
    return {
      success: false,
      error: `Each narrative section must be at least ${minWords} words. Current: Academic (${academicWords}), Career (${careerWords}), Why Program (${whyProgramWords})`,
    }
  }

  const startTime = Date.now()
  try {
    const result = await generateSOP(request)
    const duration = Date.now() - startTime

    const tokensUsed = estimateAddonTokens('sop_generation', JSON.stringify(request).length)
    await trackAIUsage({
      userId,
      action: 'sop_generation',
      tokensInput: tokensUsed.input,
      tokensOutput: tokensUsed.output,
      durationMs: duration,
      success: true,
    }).catch(() => {})

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
        rateLimitRemaining: rateLimitResult.remaining,
      },
    }
  } catch (error: any) {
    console.error('SOP generation error:', error)
    await trackAIUsage({
      userId,
      action: 'sop_generation',
      tokensInput: 0,
      tokensOutput: 0,
      durationMs: Date.now() - startTime,
      success: false,
      errorMessage: error.message,
    }).catch(() => {})
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function generateUniversityReportAction(
  request: UniversityReportRequest
): Promise<ActionResponse<UniversityReportResponse>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { success: false, error: 'Authentication required. Please log in.' }
  }

  const userId = decodeTokenPayload(token)?.sub ?? 0
  const rateLimitResult = await rateLimiters.ai.limit(`user:${userId}`)

  if (!rateLimitResult.success) {
    return {
      success: false,
      error: 'AI rate limit exceeded. Please wait before generating again.',
    }
  }

  if (!request.field || !request.degree || request.gpa === undefined || !request.budget) {
    return { success: false, error: 'Missing required fields: field, degree, gpa, budget' }
  }

  if (request.gpa < 0 || request.gpa > 4.0) {
    return { success: false, error: 'GPA must be between 0.0 and 4.0' }
  }

  if (request.budget < 0) {
    return { success: false, error: 'Budget must be a positive number' }
  }

  const startTime = Date.now()
  try {
    const result = await generateUniversityReport(request)
    const duration = Date.now() - startTime

    const tokensUsed = estimateAddonTokens('university_report', JSON.stringify(request).length)
    await trackAIUsage({
      userId,
      action: 'university_report',
      tokensInput: tokensUsed.input,
      tokensOutput: tokensUsed.output,
      durationMs: duration,
      success: true,
    }).catch(() => {})

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
        rateLimitRemaining: rateLimitResult.remaining,
      },
    }
  } catch (error: any) {
    console.error('University report generation error:', error)
    await trackAIUsage({
      userId,
      action: 'university_report',
      tokensInput: 0,
      tokensOutput: 0,
      durationMs: Date.now() - startTime,
      success: false,
      errorMessage: error.message,
    }).catch(() => {})
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function optimizeResumeAction(
  request: ResumeOptimizationRequest
): Promise<ActionResponse<ResumeOptimizationResponse>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return { success: false, error: 'Authentication required. Please log in.' }
  }

  const userId = decodeTokenPayload(token)?.sub ?? 0
  const rateLimitResult = await rateLimiters.ai.limit(`user:${userId}`)

  if (!rateLimitResult.success) {
    return {
      success: false,
      error: 'AI rate limit exceeded. Please wait before generating again.',
    }
  }

  if (!request.currentResume || !request.targetField || !request.targetLevel) {
    return {
      success: false,
      error: 'Missing required fields: currentResume, targetField, targetLevel',
    }
  }

  const resumeWords = request.currentResume.trim().split(/\s+/).filter(Boolean).length
  if (resumeWords < 100) {
    return {
      success: false,
      error: `Resume must be at least 100 words. Current: ${resumeWords} words`,
    }
  }

  const startTime = Date.now()
  try {
    const result = await optimizeResume(request)
    const duration = Date.now() - startTime

    const tokensUsed = estimateAddonTokens('resume_optimization', request.currentResume.length)
    await trackAIUsage({
      userId,
      action: 'resume_optimization',
      tokensInput: tokensUsed.input,
      tokensOutput: tokensUsed.output,
      durationMs: duration,
      success: true,
    }).catch(() => {})

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
        rateLimitRemaining: rateLimitResult.remaining,
      },
    }
  } catch (error: any) {
    console.error('Resume optimization error:', error)
    await trackAIUsage({
      userId,
      action: 'resume_optimization',
      tokensInput: 0,
      tokensOutput: 0,
      durationMs: Date.now() - startTime,
      success: false,
      errorMessage: error.message,
    }).catch(() => {})
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function getAIAddonTypesAction(): Promise<ActionResponse<any>> {
  try {
    const response = await fetch(`${process.env['NEXT_PUBLIC_APP_URL']}/api/ai/addons/generate`, {
      method: 'GET',
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch AI addon types' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Fetch AI addon types error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function checkAIQuotaAction(): Promise<ActionResponse<{
  used: number
  limit: number
  remaining: number
  resetAt: string
}>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return { success: false, error: 'Authentication required' }
    }

    const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/v1/ai/usage/quota`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to check AI quota' }
    }

    const result = await response.json()
    return { success: true, data: result.quota }
  } catch (error: any) {
    console.error('Check AI quota error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}
