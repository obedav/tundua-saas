'use server'

/**
 * Admin Server Actions for Refund Management
 *
 * Review and process refund requests
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
 * Get all refunds (admin view)
 */
export async function getAllRefunds(params?: {
  status?: string
  search?: string
  page?: number
  per_page?: number
}) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/admin/refunds`)
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page))

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-refunds'],
        revalidate: 30, // Short cache
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get all refunds error:', error)
    return null
  }
}

/**
 * Review a refund request
 */
export async function reviewRefundAction(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const action = formData.get('action') as 'approve' | 'reject'
    const notes = formData.get('notes') as string | undefined

    if (!action) {
      return { success: false, error: 'Action is required' }
    }

    const response = await fetch(`${API_URL}/api/admin/refunds/${id}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, notes }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to review refund' }
    }

    // Revalidate
    revalidatePath('/dashboard/admin/financial/refunds')
    revalidateTag('admin-refunds')
    revalidateTag(`refund-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Review refund error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
