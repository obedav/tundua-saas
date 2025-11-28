'use server'

/**
 * Admin Server Actions for Analytics
 *
 * Get system analytics and metrics
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
 * Get admin analytics
 */
export async function getAnalytics() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-analytics'],
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get analytics error:', error)
    return null
  }
}

/**
 * Get admin activity feed
 */
export async function getAdminActivity(params?: { limit?: number }) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/admin/activity`)
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit))
    }

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-activity'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get admin activity error:', error)
    return null
  }
}
