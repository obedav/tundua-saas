'use server'

/**
 * Admin Server Actions for Document Management
 *
 * Review and manage user documents
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
 * Get pending documents for review
 */
export async function getPendingDocuments() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/documents/pending`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-pending-documents'],
        revalidate: 30, // Short cache
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get pending documents error:', error)
    return null
  }
}

/**
 * Review a document
 */
export async function reviewDocumentAction(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const status = formData.get('status') as string
    const notes = formData.get('notes') as string | undefined

    if (!status) {
      return { success: false, error: 'Status is required' }
    }

    const response = await fetch(`${API_URL}/api/admin/documents/${id}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to review document' }
    }

    // Revalidate
    revalidatePath('/dashboard/admin/documents')
    revalidateTag('admin-pending-documents')
    revalidateTag('documents')

    return { success: true }
  } catch (error) {
    console.error('Review document error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
