import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from '@/lib/env';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

// This endpoint is public - no authentication required
export async function GET(_request: NextRequest) {
  try {
    const url = `${API_URL}/api/documents/types`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache since this is static data
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { success: false, error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
