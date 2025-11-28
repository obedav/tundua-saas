'use server'

/**
 * Server Actions for Document Management
 *
 * Handles file uploads, downloads, and document operations
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
 * Upload a document
 * Note: FormData is automatically handled by server actions
 */
export async function uploadDocumentAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ document: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate file exists
    const file = formData.get('file')
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let fetch handle multipart/form-data boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to upload document' }
    }

    const result = await response.json()

    // Revalidate documents list
    const applicationId = formData.get('application_id')
    if (applicationId) {
      revalidatePath(`/dashboard/applications/${applicationId}/documents`)
      revalidateTag(`documents-${applicationId}`)
    }
    revalidatePath('/dashboard/documents')
    revalidateTag('documents')

    return { success: true, data: result }
  } catch (error) {
    console.error('Upload document error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get documents for a specific application
 */
export async function getApplicationDocuments(applicationId: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/documents/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`documents-${applicationId}`, 'documents'],
        revalidate: 60, // Cache for 1 minute
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get application documents error:', error)
    return null
  }
}

/**
 * Delete a document
 */
export async function deleteDocumentAction(
  id: number,
  applicationId?: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/documents/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to delete document' }
    }

    // Revalidate
    if (applicationId) {
      revalidatePath(`/dashboard/applications/${applicationId}/documents`)
      revalidateTag(`documents-${applicationId}`)
    }
    revalidatePath('/dashboard/documents')
    revalidateTag('documents')

    return { success: true }
  } catch (error) {
    console.error('Delete document error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Download a document
 * Returns the blob URL for client-side download
 */
export async function downloadDocumentAction(
  id: number
): Promise<ActionResponse<{ blob: Blob; filename: string }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/documents/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to download document' }
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
    const filename = filenameMatch?.[1] || `document-${id}`

    const blob = await response.blob()

    return {
      success: true,
      data: { blob, filename }
    }
  } catch (error) {
    console.error('Download document error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get available document types
 */
export async function getDocumentTypes() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/documents/types`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        revalidate: 3600, // Cache for 1 hour (rarely changes)
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get document types error:', error)
    return null
  }
}
