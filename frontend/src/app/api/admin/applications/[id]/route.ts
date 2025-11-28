import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = (await cookies()).get('auth_token')?.value;

    console.log(`[Admin Application API] GET /api/admin/applications/${id}`);

    if (!token) {
      console.log('[Admin Application API] No auth token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_URL}/api/admin/applications/${id}`;
    console.log('[Admin Application API] Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Admin Application API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Application API] Backend error response:', errorText.substring(0, 500));

      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: response.status });
      } catch (e) {
        return NextResponse.json(
          { success: false, error: errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log('[Admin Application API] Success, application data received');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Admin Application API] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
