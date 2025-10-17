import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';

export const DELETE = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { notificationId } = await request.json();
    const userId = request.user!.id;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const notificationsCollection = db.collection('notifications');

    // Delete the notification for this specific user
    const result = await notificationsCollection.deleteOne({
      _id: notificationId,
      recipients: userId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Notification not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
});