'use server'

/**
 * Server Actions for University Intelligence System
 *
 * Search and recommend universities based on user criteria
 */

import { cookies } from 'next/headers'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get auth token from cookies (optional for some endpoints)
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Get list of available countries
 */
export async function getCountries() {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/universities/countries`, {
      headers,
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get countries error:', error)
    return null
  }
}

/**
 * Search universities with filters
 */
export async function searchUniversities(params: {
  country?: string
  budget?: number
  gpa?: number
  ielts?: number
  platform?: string
  field?: string
  sort?: 'smart' | 'commission' | 'acceptance' | 'tuition'
  page?: number
  per_page?: number
}) {
  try {
    const token = await getAuthToken()

    const url = new URL(`${API_URL}/api/universities/search`)

    // Add all search parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })

    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['universities-search'],
        revalidate: 1800, // Cache for 30 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Search universities error:', error)
    return null
  }
}

/**
 * Get university recommendations based on user profile
 */
export async function getUniversityRecommendationsAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ recommendations: any[] }>> {
  try {
    const token = await getAuthToken()

    const profile = {
      country: formData.get('country') as string | undefined,
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      gpa: formData.get('gpa') ? Number(formData.get('gpa')) : undefined,
      ielts: formData.get('ielts') ? Number(formData.get('ielts')) : undefined,
      field: formData.get('field') as string | undefined,
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/universities/recommend`, {
      method: 'POST',
      headers,
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to get recommendations' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Get university recommendations error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get a specific university by ID
 */
export async function getUniversityById(id: number) {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/universities/${id}`, {
      headers,
      next: {
        tags: [`university-${id}`],
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get university by ID error:', error)
    return null
  }
}
