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

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const url = `${API_URL}/api/admin/applications/${id}/status`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      const errorText = await response.text();

      console.error('[Application Status API] Backend error, status:', response.status);

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
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Application Status API] Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
