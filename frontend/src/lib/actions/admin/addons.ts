'use server'

/**
 * Admin Server Actions for Add-On Order Management
 *
 * Manage and fulfill add-on orders
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
 * Get all add-on orders (admin view)
 */
export async function getAllAddOnOrders(params?: {
  status?: string
  search?: string
  page?: number
  per_page?: number
}) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/admin/addons/orders`)
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.search) url.searchParams.set('search', params.search)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page))

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['admin-addon-orders'],
        revalidate: 30,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get all add-on orders error:', error)
    return null
  }
}

/**
 * Update add-on order status
 */
export async function updateAddOnOrderStatusAction(
  id: number,
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const status = formData.get('status') as string
    const fulfillmentNotes = formData.get('fulfillment_notes') as string | undefined
    const trackingNumber = formData.get('tracking_number') as string | undefined

    if (!status) {
      return { success: false, error: 'Status is required' }
    }

    const data: Record<string, any> = { status }
    if (fulfillmentNotes) data['fulfillment_notes'] = fulfillmentNotes
    if (trackingNumber) data['tracking_number'] = trackingNumber

    const response = await fetch(`${API_URL}/api/admin/addons/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to update order status' }
    }

    // Revalidate
    revalidatePath('/dashboard/admin/addons')
    revalidateTag('admin-addon-orders')
    revalidateTag(`addon-order-${id}`)

    return { success: true }
  } catch (error) {
    console.error('Update add-on order status error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
