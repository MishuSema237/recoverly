import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const userReferralCode = searchParams.get('userCode');
    
    if (!userReferralCode) {
      return NextResponse.json({
        success: false,
        error: 'User referral code is required'
      }, { status: 400 });
    }
    
    // Get notifications for this user (broadcast + individual)
    const notifications = await db.collection('notifications').find({
      $or: [
        { recipients: 'all' }, // Broadcast notifications
        { recipients: userReferralCode } // Individual notifications for this user
      ]
    }).sort({ sentAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { notificationId, userCode } = await request.json();
    
    if (!notificationId || !userCode) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID and user code are required'
      }, { status: 400 });
    }
    
    // Mark notification as read for this user
    const result = await db.collection('notifications').updateOne(
      { 
        _id: new ObjectId(notificationId),
        $or: [
          { recipients: 'all' },
          { recipients: userCode }
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
