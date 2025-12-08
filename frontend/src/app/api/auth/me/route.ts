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
    const allCookies = cookieStore.getAll();
    const token = cookieStore.get('auth_token')?.value;

    console.log('🔍 /api/auth/me called');
    console.log('🍪 All cookies:', allCookies.map(c => c.name));
    console.log('🍪 Token from cookie:', token ? 'EXISTS (' + token.substring(0, 20) + '...)' : 'NOT FOUND');

    if (!token) {
      console.log('❌ No token, returning 401');
      console.error('❌ DEBUG: No auth_token cookie found. Available cookies:', allCookies.map(c => c.name).join(', '));
      return NextResponse.json(
        {
          error: 'Not authenticated',
          debug: {
            message: 'No auth_token cookie found',
            availableCookies: allCookies.map(c => c.name)
          }
        },
        { status: 401 }
      );
    }

    const backendUrl = `${API_URL}/api/auth/me`;
    console.log('📡 Calling backend:', backendUrl);
    console.log('📡 Authorization header:', `Bearer ${token.substring(0, 30)}...`);

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Don't cache user data
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Backend returned error:', response.status);
      console.error('❌ Backend error details:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to fetch user',
          debug: {
            backendStatus: response.status,
            backendError: errorData,
            tokenPreview: token.substring(0, 30) + '...',
            backendUrl: backendUrl,
            apiUrlEnv: API_URL
          }
        },
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
