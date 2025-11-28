'use server'

/**
 * Server Actions for Payments & Refunds
 *
 * Handles payment processing via Paystack, Stripe, and M-Pesa
 * Also includes refund management
 */

import { cookies } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
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
 * Initialize Paystack payment
 */
export async function initializePaystackAction(
  applicationId: number
): Promise<ActionResponse<{ authorization_url: string; reference: string }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/payments/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ application_id: applicationId }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to initialize payment' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Initialize Paystack error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Verify Paystack payment
 */
export async function verifyPaystackAction(
  reference: string
): Promise<ActionResponse<{ payment: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/payments/paystack/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Payment verification failed' }
    }

    const result = await response.json()

    // Revalidate payment history
    revalidatePath('/dashboard/billing')
    revalidateTag('payments')

    return { success: true, data: result }
  } catch (error) {
    console.error('Verify Paystack error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckoutAction(
  applicationId: number,
  successUrl: string,
  cancelUrl: string
): Promise<ActionResponse<{ sessionId: string; url: string }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/payments/stripe/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        application_id: applicationId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to create checkout session' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Create Stripe checkout error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Initiate M-Pesa payment
 */
export async function initiateMpesaPaymentAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ checkoutRequestId: string }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const applicationId = Number(formData.get('application_id'))
    const phoneNumber = formData.get('phone_number') as string

    if (!applicationId || !phoneNumber) {
      return { success: false, error: 'Application ID and phone number are required' }
    }

    const response = await fetch(`${API_URL}/api/payments/mpesa/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        application_id: applicationId,
        phone_number: phoneNumber,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to initiate M-Pesa payment' }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Initiate M-Pesa error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`payment-${id}`],
        revalidate: 10, // Short cache for payment status
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get payment status error:', error)
    return null
  }
}

/**
 * Get user's payment history
 */
export async function getUserPayments(status?: string) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const url = new URL(`${API_URL}/api/payments/history`)
    if (status) url.searchParams.set('status', status)

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['payments'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user payments error:', error)
    return null
  }
}

// ============================================================================
// REFUNDS
// ============================================================================

/**
 * Request a refund
 */
export async function requestRefundAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<{ refund: any }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const applicationId = Number(formData.get('application_id'))
    const reason = formData.get('refund_reason') as string

    if (!applicationId || !reason) {
      return { success: false, error: 'Application ID and reason are required' }
    }

    const response = await fetch(`${API_URL}/api/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        application_id: applicationId,
        refund_reason: reason,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to request refund' }
    }

    const result = await response.json()

    // Revalidate refunds list
    revalidatePath('/dashboard/refunds')
    revalidateTag('refunds')

    return { success: true, data: result }
  } catch (error) {
    console.error('Request refund error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get user's refunds
 */
export async function getUserRefunds() {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/refunds/user`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: ['refunds'],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get user refunds error:', error)
    return null
  }
}

/**
 * Get a specific refund
 */
export async function getRefund(id: number) {
  try {
    const token = await getAuthToken()
    if (!token) return null

    const response = await fetch(`${API_URL}/api/refunds/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: {
        tags: [`refund-${id}`],
        revalidate: 60,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get refund error:', error)
    return null
  }
}

/**
 * Sign refund agreement
 */
export async function signRefundAgreementAction(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const signatureData = formData.get('signature_data') as string

    if (!signatureData) {
      return { success: false, error: 'Signature is required' }
    }

    const response = await fetch(`${API_URL}/api/refunds/${id}/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ signature_data: signatureData }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.message || 'Failed to sign agreement' }
    }

    // Revalidate
    revalidatePath(`/dashboard/refunds/${id}`)
    revalidateTag(`refund-${id}`)
    revalidateTag('refunds')

    return { success: true }
  } catch (error) {
    console.error('Sign refund agreement error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Download refund agreement
 */
export async function downloadRefundAgreementAction(
  id: number
): Promise<ActionResponse<{ blob: Blob; filename: string }>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${API_URL}/api/refunds/${id}/agreement`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to download agreement' }
    }

    const blob = await response.blob()
    const filename = `refund-agreement-${id}.pdf`

    return {
      success: true,
      data: { blob, filename }
    }
  } catch (error) {
    console.error('Download refund agreement error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
