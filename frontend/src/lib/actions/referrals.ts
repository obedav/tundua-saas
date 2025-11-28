'use server'

/**
 * Server Actions for Referrals
 *
 * Manage referral program and rewards
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
 * Get user's referrals
 */
export async function getUserReferrals() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/referrals`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['referrals'],
        revalidate: 300, // Cache for 5 minutes
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user referrals error:', error)
    return null
  }
}

/**
 * Create a new referral
 */
export async function createReferralAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ referral: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const email = formData.get('email') as string
    const source = (formData.get('source') as string) || 'manual'

    if (!email) {
      return { success: false, error: 'Email is required' }
    }

    const response = await fetch(`${API_URL}/api/referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, source }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to create referral' }
    }

    const result = await response.json()

    // Revalidate referrals list
    revalidatePath('/dashboard/referrals')
    revalidateTag('referrals')

    return { success: true, data: result }
  } catch (error) {
    console.error('Create referral error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Claim referral reward
 */
export async function claimReferralRewardAction(
  id: number
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/referrals/${id}/claim`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to claim reward' }
    }

    // Revalidate
    revalidatePath('/dashboard/referrals')
    revalidateTag('referrals')

    return { success: true }
  } catch (error) {
    console.error('Claim referral reward error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
