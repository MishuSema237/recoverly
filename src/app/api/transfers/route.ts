import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NotificationService } from '@/lib/notifications/NotificationService';

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { receiverEmail, receiverUserCode, amount } = await request.json();
    const senderId = request.user!.id;
    const senderEmail = request.user!.email;

    // Validate required fields
    if (!receiverEmail || !receiverUserCode || !amount) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 1000 || amount > 10000) {
      return NextResponse.json(
        { success: false, error: 'Transfer amount must be between $1,000 and $10,000' },
        { status: 400 }
      );
    }

    // Get sender user
    const sender = await UserService.getUserById(senderId);
    if (!sender) {
      return NextResponse.json(
        { success: false, error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Validate receiver
    const receiver = await UserService.getUserByEmail(receiverEmail.toLowerCase());
    if (!receiver) {
      return NextResponse.json(
        { success: false, error: 'Receiver not found' },
        { status: 404 }
      );
    }

    if (receiver.userCode !== receiverUserCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid receiver details' },
        { status: 400 }
      );
    }

    if (receiver._id === senderId) {
      return NextResponse.json(
        { success: false, error: 'Cannot transfer to yourself' },
        { status: 400 }
      );
    }

    if (!receiver.isActive) {
      return NextResponse.json(
        { success: false, error: 'Receiver account is deactivated' },
        { status: 400 }
      );
    }

    // Calculate transfer fee (2%)
    const transferFee = amount * 0.02;
    const totalDeduction = amount + transferFee;

    // Check if sender has sufficient balance
    const senderBalance = (sender.balances?.main || 0) + (sender.balances?.investment || 0) + (sender.balances?.referral || 0);
    if (senderBalance < totalDeduction) {
      return NextResponse.json(
        { success: false, error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    // Start transaction
    const session = db.client.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Deduct from sender's main balance
        await usersCollection.updateOne(
          { _id: new ObjectId(senderId) },
          { 
            $inc: { 
              'balances.main': -totalDeduction,
              'balances.total': -totalDeduction
            },
            $push: {
              transactions: {
                type: 'transfer_sent',
                amount: -totalDeduction,
                description: `Transfer to ${receiverEmail}`,
                date: new Date(),
                status: 'completed',
                metadata: {
                  receiverEmail,
                  receiverUserCode,
                  transferAmount: amount,
                  fee: transferFee
                }
              }
            },
            $set: {
              updatedAt: new Date()
            }
          } as Record<string, unknown>,
          { session }
        );

        // Add to receiver's main balance
        await usersCollection.updateOne(
          { _id: new ObjectId(receiver._id) },
          { 
            $inc: { 
              'balances.main': amount,
              'balances.total': amount
            },
            $push: {
              transactions: {
                type: 'transfer_received',
                amount: amount,
                description: `Transfer from ${senderEmail}`,
                date: new Date(),
                status: 'completed',
                metadata: {
                  senderEmail,
                  transferAmount: amount
                }
              }
            },
            $set: {
              updatedAt: new Date()
            }
          } as Record<string, unknown>,
          { session }
        );

        // Create transfer record
        await db.collection('transfers').insertOne({
          senderId: new ObjectId(senderId),
          senderEmail,
          receiverId: new ObjectId(receiver._id),
          receiverEmail,
          receiverUserCode,
          amount,
          fee: transferFee,
          totalDeduction,
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date()
        }, { session });
      });

      // Send notifications
      await Promise.all([
        // Notify sender
        NotificationService.createNotification({
          title: 'Transfer Completed',
          message: `You have successfully transferred $${amount.toFixed(2)} to ${receiverEmail}. Transfer fee: $${transferFee.toFixed(2)}`,
          type: 'transfer_sent',
          recipients: [senderId],
          sentBy: 'system',
          metadata: {
            receiverEmail,
            amount,
            fee: transferFee
          }
        }),

        // Notify receiver
        NotificationService.createNotification({
          title: 'Transfer Received',
          message: `You have received $${amount.toFixed(2)} from ${senderEmail}`,
          type: 'transfer_received',
          recipients: [receiver._id],
          sentBy: 'system',
          metadata: {
            senderEmail,
            amount
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        message: 'Transfer completed successfully',
        data: {
          amount,
          fee: transferFee,
          totalDeduction,
          receiverEmail
        }
      });

    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('Transfer error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Transfer failed' },
      { status: 500 }
    );
  }
});
