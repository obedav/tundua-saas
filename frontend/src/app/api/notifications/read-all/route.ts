import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Route - Mark All Notifications as Read
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // TODO: Call your backend API to mark all notifications as read
    console.log('Marking all notifications as read');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark all as read error:', error);
    return NextResponse.json(
      { error: 'Failed to mark all as read' },
      { status: 500 }
    );
  }
}
