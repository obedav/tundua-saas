'use server'

/**
 * Server Actions for Notifications
 *
 * Manage user notifications and alerts
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
 * Get user notifications
 */
export async function getUserNotifications(params?: { unread?: boolean; limit?: number }) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/notifications`)
    if (params?.unread !== undefined) {
      url.searchParams.set('unread', String(params.unread))
    }
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit))
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['notifications'],
        revalidate: 30, // Short cache for notifications
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user notifications error:', error)
    return null
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationReadAction(
  id: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to mark notification as read' }
    }

    // Revalidate notifications
    revalidateTag('notifications')
    revalidateTag('unread-count')

    return { success: true }
  } catch (error) {
    console.error('Mark notification read error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsReadAction(): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/notifications/read-all`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to mark all notifications as read' }
    }

    // Revalidate notifications
    revalidateTag('notifications')
    revalidateTag('unread-count')

    return { success: true }
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a notification
 */
export async function deleteNotificationAction(
  id: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to delete notification' }
    }

    // Revalidate notifications
    revalidateTag('notifications')
    revalidateTag('unread-count')

    return { success: true }
  } catch (error) {
    console.error('Delete notification error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadNotificationsCount() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['unread-count'],
        revalidate: 30, // Short cache
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get unread notifications count error:', error)
    return null
  }
}
