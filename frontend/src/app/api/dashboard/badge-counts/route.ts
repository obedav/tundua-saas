import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Route - Get Badge Counts
 * Returns real-time counts for navigation badges
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Return default counts if not authenticated (graceful degradation)
    if (!token) {
      return NextResponse.json(
        {
          counts: {
            applications: 0,
            documents: 0,
            support: 0,
            notifications: 0,
          }
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          }
        }
      );
    }

    // TODO: Replace with actual API calls to your backend
    // For now, return mock data
    const counts = {
      applications: 0,
      documents: 0,
      support: 0,
      notifications: 0,
    };

    return NextResponse.json(
      { counts },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error) {
    console.error('Badge counts error:', error);
    // Return default counts on error (graceful degradation)
    return NextResponse.json(
      {
        counts: {
          applications: 0,
          documents: 0,
          support: 0,
          notifications: 0,
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  }
}
