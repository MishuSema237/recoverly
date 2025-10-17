import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const adminReferralCode = searchParams.get('adminCode');
    
    if (!adminReferralCode) {
      return NextResponse.json({
        success: false,
        error: 'Admin referral code is required'
      }, { status: 400 });
    }
    
    // Get all notifications for admins (including admin-only notifications)
    const notifications = await db.collection('notifications').find({
      $or: [
        { recipients: 'all' }, // Broadcast notifications
        { recipients: adminReferralCode }, // Individual notifications for this admin
        { type: 'admin-only' }, // Admin-only notifications (user activity logs)
        { type: 'broadcast' } // System broadcast notifications
      ]
    }).sort({ sentAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { notificationId, adminCode } = await request.json();
    
    if (!notificationId || !adminCode) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID and admin code are required'
      }, { status: 400 });
    }
    
    // Mark notification as read for this admin
    const result = await db.collection('notifications').updateOne(
      { 
        _id: new ObjectId(notificationId),
        $or: [
          { recipients: 'all' },
          { recipients: adminCode },
          { type: 'admin-only' },
          { type: 'broadcast' }
        ]
      },
      { 
        $set: { 
          read: true,
          readAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}



