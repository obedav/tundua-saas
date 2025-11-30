import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

export async function GET(
  _request: NextRequest,
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

    const url = `${API_URL}/api/documents/${id}/download`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error },
        { status: response.status }
      );
    }

    // Get the file data and headers
    const blob = await response.blob();
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('Content-Disposition') || '';

    // Return the file with appropriate headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: any) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
