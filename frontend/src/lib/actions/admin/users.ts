'use server'

/**
 * Admin Server Actions for User Management
 *
 * Manage users and their accounts
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
 * Get all users
 */
export async function getAllUsers(params?: {
  search?: string
  role?: string
  status?: string
  page?: number
  per_page?: number
}) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/admin/users`)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.role) url.searchParams.set('role', params.role)
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page))

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-users'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get all users error:', error)
    return null
  }
}

/**
 * Get user details
 */
export async function getUserDetails(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`admin-user-${id}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user details error:', error)
    return null
  }
}

/**
 * Update user
 */
export async function updateUserAction(
  id: number,
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const data: Record<string, any> = {}

    // Extract fields from formData
    const fields = ['first_name', 'last_name', 'email', 'phone', 'role']
    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null) {
        data[field] = value
      }
    }

    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to update user' }
    }

    // Revalidate
    revalidatePath('/dashboard/admin/users')
    revalidateTag('admin-users')
    revalidateTag(`admin-user-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Update user error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Suspend/unsuspend user
 */
export async function suspendUserAction(
  id: number,
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const action = formData.get('action') as 'suspend' | 'unsuspend'
    const minutes = formData.get('minutes') ? Number(formData.get('minutes')) : undefined

    if (!action) {
      return { success: false, error: 'Action is required' }
    }

    const response = await fetch(`${API_URL}/api/admin/users/${id}/suspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, minutes }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to update suspension status' }
    }

    // Revalidate
    revalidatePath('/dashboard/admin/users')
    revalidateTag('admin-users')
    revalidateTag(`admin-user-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Suspend user error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/users/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-user-stats'],
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user statistics error:', error)
    return null
  }
}
