import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Notification {
  _id?: ObjectId;
  title: string;
  message: string;
  type: 'broadcast' | 'individual';
  recipients: string[] | 'all';
  sentBy: string;
  sentAt: Date;
  read: boolean;
  attachments?: Array<{
    filename: string;
    originalName: string;
    contentType: string;
    size: number;
    url: string;
  }>;
}

export async function GET() {
  try {
    const db = await getDb();
    const notifications = await db.collection('notifications').find({}).sort({ sentAt: -1 }).toArray();
    
    return NextResponse.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const notificationData: Notification = await request.json();
    
    // If this is a broadcast to all users, create notifications for each user
    if (notificationData.type === 'broadcast' && notificationData.recipients === 'all') {
      // Get all active users
      const users = await db.collection('users').find({ isActive: true }).toArray();
      
      // Create individual notifications for each user
      const notifications = users.map(user => ({
        ...notificationData,
        recipients: [user._id?.toString()],
        sentAt: new Date(),
        read: false
      }));
      
      // Insert all notifications
      if (notifications.length > 0) {
        await db.collection('notifications').insertMany(notifications);
      }
      
      return NextResponse.json({
        success: true,
        message: `Broadcast notification sent to ${notifications.length} users`,
        data: { count: notifications.length }
      });
    }
    
    // For individual notifications or non-broadcast
    const notification = {
      ...notificationData,
      sentAt: new Date(),
      read: false
    };
    
    const result = await db.collection('notifications').insertOne(notification);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...notification }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { _id, ...updateData } = await request.json();
    
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID is required'
      }, { status: 400 });
    }
    
    const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notification not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
