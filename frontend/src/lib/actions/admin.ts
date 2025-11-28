'use server'

/**
 * Server Actions for Admin Operations
 *
 * Provides server-side data fetching for admin dashboard
 * Uses httpOnly cookies for authentication
 */

import { cookies } from 'next/headers'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

/**
 * Get auth token from cookies
 * Note: In Next.js 15, cookies() returns a Promise
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

/**
 * Get admin analytics overview
 */
export async function getAdminAnalytics() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-analytics'],
        revalidate: 60, // Cache for 1 minute
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get admin analytics error:', error)
    return null
  }
}

/**
 * Get all applications for admin
 */
export async function getAdminApplications(params?: {
  status?: string
  limit?: number
  page?: number
  order?: string
}) {
  try {
    const token = await getAuthToken()
    if (!token) {
      console.error('No auth token found in getAdminApplications')
      return null
    }

    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.limit) queryParams.append('per_page', params.limit.toString()) // Backend uses per_page not limit
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.order) queryParams.append('order', params.order)

    const url = `${API_URL}/api/admin/applications${queryParams.toString() ? `?${queryParams}` : ''}`

    console.log('Fetching admin applications from:', url)

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-applications'],
        revalidate: 30,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Admin applications fetch failed:', response.status, errorText)
      return null
    }

    const data = await response.json()
    console.log('Admin applications response:', data)
    return data
  } catch (error) {
    console.error('Get admin applications error:', error)
    return null
  }
}

/**
 * Get all users for admin
 */
export async function getAdminUsers(params?: {
  role?: string
  status?: string
  limit?: number
  page?: number
}) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const queryParams = new URLSearchParams()
    if (params?.role) queryParams.append('role', params.role)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.page) queryParams.append('page', params.page.toString())

    const url = `${API_URL}/api/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`

    const response = await fetch(url, {
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
    console.error('Get admin users error:', error)
    return null
  }
}

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats() {
  try {
    const token = await getAuthToken()
    if (!token) {
      console.error('No auth token found in getAdminDashboardStats')
      return {
        total_applications: 0,
        pending_applications: 0,
        approved_applications: 0,
        rejected_applications: 0,
        total_revenue: 0,
        pending_documents: 0,
        total_users: 0,
        applications_this_month: 0,
        revenue_this_month: 0,
      }
    }

    console.log('Fetching admin stats from:', `${API_URL}/api/admin/analytics`)

    const response = await fetch(`${API_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-stats'],
        revalidate: 60,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Admin stats fetch failed:', response.status, errorText)
      // Return zeros instead of null - honest about no data
      return {
        total_applications: 0,
        pending_applications: 0,
        approved_applications: 0,
        rejected_applications: 0,
        total_revenue: 0,
        pending_documents: 0,
        total_users: 0,
        applications_this_month: 0,
        revenue_this_month: 0,
      }
    }

    const data = await response.json()
    console.log('Admin stats response:', data)

    // Parse the response - backend returns nested structure
    const overview = data.analytics?.overview || data.overview || {}
    const byStatus = overview.by_status || {}

    // Calculate pending applications (submitted + payment_pending + under_review)
    const pendingCount = (byStatus.submitted || 0) +
                         (byStatus.payment_pending || 0) +
                         (byStatus.under_review || 0)

    const stats = {
      total_applications: overview.total_applications || 0,
      pending_applications: pendingCount,
      approved_applications: byStatus.approved || 0,
      rejected_applications: byStatus.rejected || 0,
      total_revenue: overview.total_revenue || 0,
      pending_documents: overview.pending_documents || 0,
      total_users: overview.total_users || 0,
      applications_this_month: overview.applications_this_month || 0,
      revenue_this_month: overview.revenue_this_month || 0,
    }

    console.log('Parsed stats:', stats)
    return stats
  } catch (error) {
    console.error('Get admin dashboard stats error:', error)
    // Return zeros - honest about errors
    return {
      total_applications: 0,
      pending_applications: 0,
      approved_applications: 0,
      rejected_applications: 0,
      total_revenue: 0,
      pending_documents: 0,
      total_users: 0,
      applications_this_month: 0,
      revenue_this_month: 0,
    }
  }
}

/**
 * Get recent admin activity
 */
export async function getAdminActivity(limit: number = 10) {
  try {
    const token = await getAuthToken()
    if (!token) return []

    const response = await fetch(`${API_URL}/api/admin/activity?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-activity'],
        revalidate: 30,
      },
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.activities || data.data || []
  } catch (error) {
    console.error('Get admin activity error:', error)
    return []
  }
}

/**
 * Get comprehensive admin analytics
 */
export async function getComprehensiveAnalytics(period: number = 30) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/analytics?period=${period}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-comprehensive-analytics'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.analytics || data
  } catch (error) {
    console.error('Get comprehensive analytics error:', error)
    return null
  }
}

/**
 * Get revenue chart data
 */
export async function getRevenueChartData(period: string = 'daily', days: number = 30) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/admin/analytics/revenue-chart?period=${period}&days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-revenue-chart'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Get revenue chart data error:', error)
    return null
  }
}
