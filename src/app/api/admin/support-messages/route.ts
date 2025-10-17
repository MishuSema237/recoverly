import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { requireAdmin } from '@/middleware/auth';

export const GET = requireAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const priority = searchParams.get('priority') || 'all';
    
    const db = await getDb();
    const supportMessagesCollection = db.collection('supportMessages');

    let query: any = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (priority !== 'all') {
      query.priority = priority;
    }

    const messages = await supportMessagesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching support messages:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
});

export const PUT = requireAdmin(async (request) => {
  try {
    const { messageId, status, adminReply } = await request.json();
    const adminId = request.user!.id;
    const adminEmail = request.user!.email;

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const supportMessagesCollection = db.collection('supportMessages');

    const updateData: any = {
      updatedAt: new Date()
    };

    if (status) {
      updateData.status = status;
    }

    if (adminReply) {
      updateData.$push = {
        adminReplies: {
          adminId,
          adminEmail,
          reply: adminReply,
          createdAt: new Date()
        }
      };
    }

    const result = await supportMessagesCollection.updateOne(
      { _id: messageId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Support message not found' },
        { status: 404 }
      );
    }

    // Create notification for the user about the reply
    if (adminReply) {
      const message = await supportMessagesCollection.findOne({ _id: messageId });
      if (message) {
        const notificationsCollection = db.collection('notifications');
        await notificationsCollection.insertOne({
          title: 'Support Reply',
          message: `Admin replied to your support request: "${message.subject}"\n\nReply: ${adminReply}`,
          type: 'individual',
          recipients: [message.userId],
          sentBy: 'system',
          metadata: {
            supportMessageId: messageId,
            adminId,
            adminEmail
          },
          sentAt: new Date(),
          read: false
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Support message updated successfully'
    });
  } catch (error) {
    console.error('Error updating support message:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
});
