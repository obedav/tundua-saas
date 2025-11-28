import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Route - Get Notifications
 * Returns user notifications
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // TODO: Replace with actual API call to your backend
    // For now, return mock notifications
    const notifications = [
      {
        id: '1',
        title: 'Application Submitted',
        message: 'Your application to Stanford University has been submitted successfully.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        actionUrl: '/dashboard/applications/1',
      },
      {
        id: '2',
        title: 'Document Required',
        message: 'Please upload your transcript for MIT application.',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        actionUrl: '/dashboard/documents',
      },
      {
        id: '3',
        title: 'Support Reply',
        message: 'Our team has responded to your support ticket #1234.',
        type: 'info',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        actionUrl: '/dashboard/support',
      },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
