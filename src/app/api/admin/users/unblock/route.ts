import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const POST = requireAdmin(async (request) => {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        // Get user
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (!user.isAccountBlocked && !user.isAccountRestricted) {
            return NextResponse.json({ success: false, error: 'User account is not blocked or restricted' }, { status: 400 });
        }

        const unblockFee = user.accountUnblockFee || 0;
        const currentMainBalance = user.balances?.main || 0;
        const newMainBalance = currentMainBalance + unblockFee;

        const currentTotalBalance = user.balances?.total || 0;
        const newTotalBalance = currentTotalBalance + unblockFee;

        // Update user: unblock and refund fee
        const updateData = {
            isAccountBlocked: false,
            isAccountRestricted: false,
            accountBlockReason: '',
            accountUnblockFee: 0,
            'balances.main': newMainBalance,
            'balances.total': newTotalBalance,
            updatedAt: new Date(),
            updatedBy: 'admin'
        };

        // Add activity log entry
        const activityEntry = {
            action: `Account unblocked and refund of $${unblockFee} credited to balance.`,
            timestamp: new Date().toISOString()
        };

        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: updateData,
                $push: { activityLog: { $each: [activityEntry], $position: 0 } }
            } as any
        );

        // Also send a notification to the user
        const notificationData = {
            title: 'ACCOUNT RESTORATION SUCCESSFUL',
            message: `Your account has been successfully restored. The safety fee of $${unblockFee} has been refunded to your main balance.`,
            type: 'individual',
            recipients: [userId],
            sentBy: 'admin',
            createdAt: new Date()
        };
        await db.collection('notifications').insertOne(notificationData);

        return NextResponse.json({
            success: true,
            message: 'User account unblocked and fee refunded',
            data: {
                balances: {
                    main: newMainBalance,
                    investment: user.balances?.investment || 0,
                    referral: user.balances?.referral || 0,
                    total: newTotalBalance
                }
            }
        });

    } catch (error) {
        console.error('Error unblocking user:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
});
