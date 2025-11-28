'use server'

/**
 * Server Actions for Add-Ons Management
 *
 * Purchase and manage add-on services
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
 * Get user's purchased add-ons
 */
export async function getUserAddOns(status?: string) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/addons/purchased`)
    if (status) url.searchParams.set('status', status)

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['user-addons'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user add-ons error:', error)
    return null
  }
}

/**
 * Purchase an add-on service
 */
export async function purchaseAddOnAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ order: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const addonServiceId = Number(formData.get('addon_service_id'))
    const applicationId = Number(formData.get('application_id'))
    const quantity = Number(formData.get('quantity')) || 1

    if (!addonServiceId || !applicationId) {
      return { success: false, error: 'Add-on service and application are required' }
    }

    const response = await fetch(`${API_URL}/api/addons/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        addon_service_id: addonServiceId,
        application_id: applicationId,
        quantity,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to purchase add-on' }
    }

    const result = await response.json()

    // Revalidate add-ons list
    revalidatePath('/dashboard/addons')
    revalidatePath('/dashboard/my-addons')
    revalidateTag('user-addons')

    return { success: true, data: result }
  } catch (error) {
    console.error('Purchase add-on error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get a specific add-on order
 */
export async function getAddOnOrder(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/addons/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`addon-order-${id}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get add-on order error:', error)
    return null
  }
}

/**
 * Get add-ons for a specific application
 */
export async function getApplicationAddOns(applicationId: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/addons/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`application-addons-${applicationId}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get application add-ons error:', error)
    return null
  }
}
