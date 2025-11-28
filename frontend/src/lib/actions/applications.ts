'use server'

/**
 * Server Actions for Applications
 *
 * Replaces axios-based API calls with type-safe server actions
 */

import { cookies } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get auth token from cookies (helper function)
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Create a new application
 */
export async function createApplicationAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ application: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    // Extract form data
    const data = {
      service_tier_id: Number(formData.get('service_tier_id')),
      destination_country: formData.get('destination_country') as string,
      preferred_intake: formData.get('preferred_intake') as string,
      education_level: formData.get('education_level') as string,
      field_of_study: formData.get('field_of_study') as string,
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      additional_notes: formData.get('additional_notes') as string || undefined,
    }

    const response = await fetch(`${API_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to create application' }
    }

    const result = await response.json()

    // Revalidate applications list
    revalidatePath('/dashboard/applications')
    revalidatePath('/dashboard')
    revalidateTag('applications')

    return { success: true, data: result }
  } catch (error) {
    console.error('Create application error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get all applications for the current user
 */
export async function getApplications() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['applications'],
        revalidate: 60, // Cache for 1 minute
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get applications error:', error)
    return null
  }
}

/**
 * Get a single application by ID
 */
export async function getApplication(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`application-${id}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get application error:', error)
    return null
  }
}

/**
 * Update an application
 */
export async function updateApplicationAction(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    // Extract update data
    const data: Record<string, any> = {}

    // Only include fields that are present in formData
    const fields = [
      'destination_country',
      'preferred_intake',
      'education_level',
      'field_of_study',
      'additional_notes',
    ]

    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null) {
        data[field] = value as string
      }
    }

    // Handle numeric fields
    const budget = formData.get('budget')
    if (budget !== null) {
      data.budget = Number(budget)
    }

    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to update application' }
    }

    // Revalidate
    revalidatePath(`/dashboard/applications/${id}`)
    revalidatePath('/dashboard/applications')
    revalidateTag(`application-${id}`)
    revalidateTag('applications')

    return { success: true }
  } catch (error) {
    console.error('Update application error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Submit an application for processing
 */
export async function submitApplicationAction(
  id: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/applications/${id}/submit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to submit application' }
    }

    // Revalidate
    revalidatePath(`/dashboard/applications/${id}`)
    revalidatePath('/dashboard/applications')
    revalidateTag(`application-${id}`)
    revalidateTag('applications')

    return { success: true }
  } catch (error) {
    console.error('Submit application error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete an application
 */
export async function deleteApplicationAction(
  id: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/applications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to delete application' }
    }

    // Revalidate
    revalidatePath('/dashboard/applications')
    revalidatePath('/dashboard')
    revalidateTag('applications')

    return { success: true }
  } catch (error) {
    console.error('Delete application error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Calculate pricing for an application
 */
export async function calculatePricingAction(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ pricing: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const data = {
      addon_services: formData.getAll('addon_services').map(Number),
      rush_processing: formData.get('rush_processing') === 'true',
    }

    const response = await fetch(`${API_URL}/api/applications/${id}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to calculate pricing' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Calculate pricing error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
