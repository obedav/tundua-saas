'use server'

/**
 * Server Actions for Authentication
 *
 * These replace the old API client methods with type-safe server actions.
 * Benefits:
 * - Direct server execution
 * - Type-safe end-to-end
 * - No exposed API endpoints
 * - Progressive enhancement support
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { clientEnv } from '@/lib/env'

const API_URL = clientEnv.NEXT_PUBLIC_API_URL

// Response types
interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Login action - Replaces apiClient.login()
 */
export async function loginAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse<{ user: any; token: string }>> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      }
    }

    // Call backend API
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Login failed',
      }
    }

    const data = await response.json()

    console.log('📦 Backend login response:', JSON.stringify(data, null, 2));

    // Handle different response structures
    const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
    const user = data.user || data.data?.user;

    console.log('✅ Token received:', token ? 'YES' : 'NO');
    console.log('👤 User:', user?.email);

    if (!token) {
      console.error('❌ No token in backend response');
      return {
        success: false,
        error: 'Login failed: No token received from server',
      };
    }

    // Set HttpOnly cookie (secure!)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true, // ✅ Not accessible via JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // ✅ HTTPS only in production
      sameSite: 'lax', // Changed from strict to lax for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      priority: 'high', // Ensure cookie is sent with requests
    })

    console.log('🍪 Cookie set successfully');
    console.log('🍪 Cookie value preview:', token.substring(0, 30) + '...');

    // Revalidate cached pages
    revalidatePath('/', 'layout')

    return {
      success: true,
      data: {
        user: user,
        token: token,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

/**
 * Register action - Replaces apiClient.register()
 */
export async function registerAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse<{ user: any }>> {
  try {
    const data = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
    }

    // Validate
    if (!data.first_name || !data.last_name || !data.email || !data.password) {
      return {
        success: false,
        error: 'All required fields must be filled',
      }
    }

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Registration failed',
      }
    }

    const result = await response.json()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

/**
 * Logout action - Replaces apiClient.logout()
 */
export async function logoutAction() {
  try {
    // Call backend
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    // Clear cookie
    cookieStore.delete('auth_token')

    // Revalidate all pages
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
  }

  // Always redirect to login
  redirect('/auth/login')
}

/**
 * Get current user - Server-side data fetching
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    console.log('🔍 getCurrentUser: Token exists:', token ? 'YES' : 'NO')

    if (!token) {
      console.log('❌ getCurrentUser: No token, returning null')
      return null
    }

    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ['user'],
        revalidate: 300, // Cache for 5 minutes
      },
    })

    console.log('📡 getCurrentUser: Backend response status:', response.status)

    if (!response.ok) {
      console.log('❌ getCurrentUser: Backend returned error')
      return null
    }

    const data = await response.json()
    console.log('📦 getCurrentUser: Backend response:', JSON.stringify(data, null, 2))

    // Handle different response structures
    const user = data.user || data.data || data.data?.user

    console.log('✅ getCurrentUser: User found:', user?.email || 'NO')

    return user
  } catch (error) {
    console.error('❌ getCurrentUser error:', error)
    return null
  }
}

/**
 * Update profile action
 */
export async function updateProfileAction(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const token = (await cookies()).get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    const data = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
    }

    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.message || 'Update failed',
      }
    }

    // Revalidate user data
    revalidatePath('/', 'layout')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}
