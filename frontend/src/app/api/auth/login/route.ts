import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

/**
 * API Route - Login
 *
 * Handles user login and sets HttpOnly cookie
 * Using API route instead of Server Action for better cookie handling
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { success: false, error: error.message || 'Login failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('📦 Backend response:', JSON.stringify(data, null, 2));

    // The backend might return data in different structures, check all possibilities
    const token = data.token || data.access_token || data.data?.token || data.data?.access_token;
    const user = data.user || data.data?.user;

    console.log('✅ Login successful, token received:', token ? 'YES' : 'NO');
    console.log('👤 User:', user?.email);

    if (!token) {
      console.error('❌ No token found in backend response!');
      return NextResponse.json(
        { success: false, error: 'Login failed: No token received from server' },
        { status: 500 }
      );
    }

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Not accessible via JavaScript (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('🍪 Cookie set with token:', token.substring(0, 20) + '...');

    // Create response
    const nextResponse = NextResponse.json({
      success: true,
      data: {
        user: user,
        token: token,
      },
    });

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
