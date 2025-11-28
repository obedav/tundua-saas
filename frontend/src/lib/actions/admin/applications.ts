'use server'

/**
 * Admin Server Actions for Applications
 *
 * Manage all applications in the system
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
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Get all applications (admin view)
 */
export async function getAllApplications(params?: {
  status?: string
  search?: string
  page?: number
  per_page?: number
}) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/admin/applications`)
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page))

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-applications'],
        revalidate: 30, // Short cache for admin views
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get all applications error:', error)
    return null
  }
}

/**
 * Get single application (admin view)
 */
export async function getAdminApplication(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`application-${id}`, 'admin-applications'],
        revalidate: 30,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get admin application error:', error)
    return null
  }
}

/**
 * Update application status (direct call)
 */
export async function updateApplicationStatusAction(
  id: number,
  status: string
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!status) {
      return { success: false, error: 'Status is required' }
    }

    console.log(`[Server Action] Updating application ${id} status to ${status}`)
    console.log(`[Server Action] Backend URL: ${API_URL}/api/admin/applications/${id}/status`)

    const response = await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    console.log(`[Server Action] Response status: ${response.status}`)
    console.log(`[Server Action] Response content-type: ${response.headers.get('content-type')}`)

    if (!response.ok) {
      // Try to parse as JSON, but handle HTML responses
      const contentType = response.headers.get('content-type')
      let errorMessage = 'Failed to update status'
      let errorDetails = null

      if (contentType?.includes('application/json')) {
        try {
          const error = await response.json()
          console.error('[Server Action] Backend error response:', JSON.stringify(error, null, 2))
          errorMessage = error.error || error.message || errorMessage
          errorDetails = error.details || error
        } catch (e) {
          errorMessage = `Server returned ${response.status}`
        }
      } else {
        // HTML or other response - likely a 404 or server error
        const text = await response.text()
        console.error('[Server Action] Non-JSON response:', text.substring(0, 200))
        errorMessage = `Server error (${response.status}): Backend returned HTML instead of JSON. Check if backend server is running.`
      }

      console.error('[Server Action] Final error message:', errorMessage)
      if (errorDetails) {
        console.error('[Server Action] Error details:', errorDetails)
      }

      return { success: false, error: errorMessage }
    }

    // Parse success response
    const data = await response.json()
    console.log('[Server Action] Success:', data)

    // Revalidate
    revalidatePath('/dashboard/admin/applications')
    revalidatePath(`/dashboard/admin/applications/${id}`)
    revalidateTag('admin-applications')
    revalidateTag(`application-${id}`)

    return { success: true, data }
  } catch (error: any) {
    console.error('Update application status error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred. Check if backend server is running.'
    }
  }
}

/**
 * Add admin notes to application (direct call)
 */
export async function addAdminNotesAction(
  id: number,
  notes: string
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    if (!notes) {
      return { success: false, error: 'Notes are required' }
    }

    const response = await fetch(`${API_URL}/api/admin/applications/${id}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notes }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to add notes' }
    }

    // Revalidate
    revalidatePath(`/dashboard/admin/applications/${id}`)
    revalidateTag(`application-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Add admin notes error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
