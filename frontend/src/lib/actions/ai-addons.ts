'use server'

/**
 * Server Actions for AI-Powered Addons
 *
 * These actions allow frontend components to generate AI documents
 */

import { cookies } from 'next/headers'
import {
  generateSOP,
  generateUniversityReport,
  optimizeResume,
  type SOPGenerationRequest,
  type SOPGenerationResponse,
  type UniversityReportRequest,
  type UniversityReportResponse,
  type ResumeOptimizationRequest,
  type ResumeOptimizationResponse,
} from '@/lib/ai-addons-generator'

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

/**
 * Generate Statement of Purpose
 */
export async function generateSOPAction(
  request: SOPGenerationRequest
): Promise<ActionResponse<SOPGenerationResponse>> {
  try {
    // 1. AUTHENTICATION CHECK
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      }
    }

    // 2. VALIDATE REQUIRED FIELDS
    if (!request.fullName || !request.academicBackground || !request.careerGoals) {
      return {
        success: false,
        error: 'Missing required fields: fullName, academicBackground, careerGoals',
      }
    }

    // Auto-generate whyThisProgram if not provided (for Express Mode)
    if (!request.whyThisProgram && request.targetUniversity && request.targetDegree) {
      request.whyThisProgram = `I am interested in ${request.targetDegree} at ${request.targetUniversity} because it aligns with my career goals and academic background.`
    }

    // 3. VALIDATE NARRATIVE LENGTH (minimum 200 words each for Custom Mode only)
    // Express Mode: Allow shorter inputs (AI will expand them)
    // Custom Mode: Requires detailed narratives (200+ words each)
    const minWords = 200
    const academicWords = request.academicBackground.split(/\s+/).filter(Boolean).length
    const careerWords = request.careerGoals.split(/\s+/).filter(Boolean).length
    const whyProgramWords = (request.whyThisProgram || '').split(/\s+/).filter(Boolean).length

    // Only enforce word count if user provided substantial input (Custom Mode)
    const isCustomMode = academicWords >= 50 || careerWords >= 50
    if (isCustomMode && (academicWords < minWords || careerWords < minWords || whyProgramWords < minWords)) {
      return {
        success: false,
        error: `Each narrative section must be at least ${minWords} words. Current: Academic (${academicWords}), Career (${careerWords}), Why Program (${whyProgramWords})`,
      }
    }

    // 4. GENERATE SOP
    const startTime = Date.now()
    const result = await generateSOP(request)
    const duration = Date.now() - startTime

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('SOP generation error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Generate University Selection Report
 */
export async function generateUniversityReportAction(
  request: UniversityReportRequest
): Promise<ActionResponse<UniversityReportResponse>> {
  try {
    // 1. AUTHENTICATION CHECK
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      }
    }

    // 2. VALIDATE REQUIRED FIELDS
    if (!request.field || !request.degree || request.gpa === undefined || !request.budget) {
      return {
        success: false,
        error: 'Missing required fields: field, degree, gpa, budget',
      }
    }

    // 3. VALIDATE GPA RANGE
    if (request.gpa < 0 || request.gpa > 4.0) {
      return {
        success: false,
        error: 'GPA must be between 0.0 and 4.0',
      }
    }

    // 4. VALIDATE BUDGET
    if (request.budget < 0) {
      return {
        success: false,
        error: 'Budget must be a positive number',
      }
    }

    // 5. GENERATE REPORT
    const startTime = Date.now()
    const result = await generateUniversityReport(request)
    const duration = Date.now() - startTime

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('University report generation error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Optimize Resume/CV
 */
export async function optimizeResumeAction(
  request: ResumeOptimizationRequest
): Promise<ActionResponse<ResumeOptimizationResponse>> {
  try {
    // 1. AUTHENTICATION CHECK
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Authentication required. Please log in.',
      }
    }

    // 2. VALIDATE REQUIRED FIELDS
    if (!request.currentResume || !request.targetField || !request.targetLevel) {
      return {
        success: false,
        error: 'Missing required fields: currentResume, targetField, targetLevel',
      }
    }

    // 3. VALIDATE RESUME LENGTH (minimum 100 words)
    const resumeWords = request.currentResume.split(/\s+/).length
    if (resumeWords < 100) {
      return {
        success: false,
        error: `Resume must be at least 100 words. Current: ${resumeWords} words`,
      }
    }

    // 4. OPTIMIZE RESUME
    const startTime = Date.now()
    const result = await optimizeResume(request)
    const duration = Date.now() - startTime

    return {
      success: true,
      data: result,
      meta: {
        duration,
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('Resume optimization error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Get available AI addon types and pricing
 */
export async function getAIAddonTypesAction(): Promise<ActionResponse<any>> {
  try {
    const response = await fetch(`${process.env['NEXT_PUBLIC_APP_URL']}/api/ai/addons/generate`, {
      method: 'GET',
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch AI addon types',
      }
    }

    const result = await response.json()
    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('Fetch AI addon types error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Check if user has remaining AI generation quota
 */
export async function checkAIQuotaAction(): Promise<ActionResponse<{
  used: number
  limit: number
  remaining: number
  resetAt: string
}>> {
  try {
    const response = await fetch(`${process.env['NEXT_PUBLIC_APP_URL']}/api/ai/usage/quota`, {
      method: 'GET',
      credentials: 'include', // Include cookies
    })

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to check AI quota',
      }
    }

    const result = await response.json()
    return {
      success: true,
      data: result.quota,
    }
  } catch (error: any) {
    console.error('Check AI quota error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}
