import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Test endpoint to verify cookie functionality
 * Visit: /api/test-cookie
 */
export async function GET() {
  try {
    const cookieStore = await cookies();

    // Set a test cookie
    cookieStore.set('test_cookie', 'test_value_' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    });

    // Try to read it back
    const testCookie = cookieStore.get('test_cookie')?.value;
    const allCookies = cookieStore.getAll();

    return NextResponse.json({
      success: true,
      message: 'Cookie test completed',
      data: {
        testCookieSet: true,
        testCookieValue: testCookie,
        allCookies: allCookies.map(c => ({
          name: c.name,
          value: c.value.substring(0, 20) + (c.value.length > 20 ? '...' : '')
        })),
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Cookie test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Cookie test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
