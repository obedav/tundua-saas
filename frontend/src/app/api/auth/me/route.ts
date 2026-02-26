import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

/**
 * API Route - Get Current User
 *
 * This route reads the HttpOnly cookie and fetches user data from the backend
 * Used by Client Components that need user data (like the dashboard layout)
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${API_URL}/api/auth/me`;

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Don't cache user data
    });

    if (!response.ok) {
      await response.json().catch(() => ({}));
      console.error('Failed to fetch user from backend, status:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    const user = data.user || data.data?.user || data.data;

    if (!user) {
      console.error('No user data in backend response');
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
