import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = (await cookies()).get('auth_token')?.value;

    console.log(`[API Route] PUT /api/admin/applications/${id}/status`);

    if (!token) {
      console.log('[API Route] No auth token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[API Route] Request body:', body);

    const url = `${API_URL}/api/admin/applications/${id}/status`;
    console.log('[API Route] Proxying to:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[API Route] Backend response status:', response.status);
    console.log('[API Route] Backend response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorText = await response.text();

      console.error('[API Route] Backend error response:', errorText.substring(0, 500));

      // Try to parse as JSON if it's JSON
      if (contentType?.includes('application/json')) {
        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            errorJson,
            { status: response.status }
          );
        } catch (e) {
          // Not valid JSON, return as text
        }
      }

      return NextResponse.json(
        { success: false, error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API Route] Success:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API Route] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
