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

    console.log('🔍 /api/auth/me called');
    console.log('🍪 Token from cookie:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NOT FOUND');

    if (!token) {
      console.log('❌ No token, returning 401');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('📡 Calling backend /api/auth/me with token');
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // Don't cache user data
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      console.log('❌ Backend returned error:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📦 Backend /api/auth/me response:', JSON.stringify(data, null, 2));

    // Handle different response structures from backend
    const user = data.user || data.data?.user || data.data;

    console.log('✅ User fetched successfully:', user?.email);

    if (!user) {
      console.error('❌ No user data in backend response');
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
    console.error('❌ Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
