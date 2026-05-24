import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

/**
 * POST /api/auth/refresh
 *
 * Exchanges the refresh_token httpOnly cookie for a new access token (and a
 * new refresh token when REFRESH_TOKEN_ROTATION=true on the backend).
 * Called automatically by api-client.ts on 401 before redirecting to login.
 */
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false, error: 'No refresh token' }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Refresh failed' }, { status: 401 });
    }

    data = await response.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Refresh request failed' }, { status: 500 });
  }

  const inner = data['data'] as Record<string, string> | undefined;
  const newAccessToken = inner?.['access_token'] ?? (data['access_token'] as string | undefined);
  const newRefreshToken = inner?.['refresh_token'] ?? (data['refresh_token'] as string | undefined);

  if (!newAccessToken || typeof newAccessToken !== 'string') {
    return NextResponse.json({ success: false, error: 'No access token in refresh response' }, { status: 500 });
  }

  const isProd = process.env.NODE_ENV === 'production';

  cookieStore.set('auth_token', newAccessToken as string, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60,
    path: '/',
  });

  if (newRefreshToken) {
    cookieStore.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  }

  return NextResponse.json({ success: true });
}
