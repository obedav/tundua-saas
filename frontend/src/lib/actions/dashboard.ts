'use server'

/**
 * Server Actions for Dashboard
 *
 * Dashboard statistics and overview data
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
 * Get dashboard statistics
 * Used for dashboard widgets and KPIs
 */
export async function getDashboardStats() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['dashboard-stats'],
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return null
  }
}

/**
 * Get dashboard overview
 * Comprehensive dashboard data including recent activity
 */
export async function getDashboardOverview() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['dashboard-overview'],
        revalidate: 180, // Cache for 3 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get dashboard overview error:', error)
    return null
  }
}
