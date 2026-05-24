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
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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

    const accessToken = data.data?.access_token;
    const refreshToken = data.data?.refresh_token;
    const user = data.data?.user;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Login failed: No token received from server' },
        { status: 500 }
      );
    }

    const isProd = process.env.NODE_ENV === 'production';
    const cookieStore = await cookies();

    cookieStore.set('auth_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60,        // 1 hour — matches backend JWT_EXPIRY
      path: '/',
    });

    if (refreshToken) {
      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,  // 30 days — matches backend JWT_REFRESH_EXPIRY
        path: '/',
      });
    }

    return NextResponse.json({
      success: true,
      data: { user, token: accessToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
