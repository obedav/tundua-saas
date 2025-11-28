'use server'

/**
 * Server Actions for Activity Feed
 *
 * Track and display user activity
 */

import { cookies } from 'next/headers'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Get user activity
 */
export async function getUserActivity(params?: { limit?: number }) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/activity`)
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit))
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['user-activity'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user activity error:', error)
    return null
  }
}

/**
 * Get activity for a specific entity (application, document, etc.)
 */
export async function getEntityActivity(
  entityType: string,
  entityId: number,
  params?: { limit?: number }
) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/activity/${entityType}/${entityId}`)
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit))
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`${entityType}-activity-${entityId}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get entity activity error:', error)
    return null
  }
}
