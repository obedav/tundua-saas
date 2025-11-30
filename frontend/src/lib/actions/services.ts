'use server'

/**
 * Server Actions for Service Tiers & Add-on Services
 *
 * Get available services and pricing information
 */

import { cookies } from 'next/headers'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

/**
 * Get auth token from cookies (optional for these public endpoints)
 */
async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get('auth_token')?.value
}

/**
 * Get available service tiers
 * These are the main application service packages
 */
export async function getServiceTiers() {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/service-tiers`, {
      headers,
      next: {
        tags: ['service-tiers'],
        revalidate: 3600, // Cache for 1 hour (pricing rarely changes)
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get service tiers error:', error)
    return null
  }
}

/**
 * Get available add-on services
 * These are additional services that can be purchased
 */
export async function getAddonServices() {
  try {
    const token = await getAuthToken()

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/api/addon-services`, {
      headers,
      next: {
        tags: ['addon-services'],
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get addon services error:', error)
    return null
  }
}
