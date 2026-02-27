import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function GET(req: NextRequest) {
    try {
        const db = await getDb();
        const usersCollection = db.collection('users');

        // Fetch users with pending KYC status
        const pendingKycUsers = await usersCollection.find(
            { kycStatus: 'pending' },
            { projection: { password: 0 } } // Exclude password security
        ).toArray();

        return NextResponse.json({ success: true, data: pendingKycUsers });
    } catch (error) {
        console.error('Admin KYC GET Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId, action, reason } = await req.json();

        if (!userId || !['approve', 'decline'].includes(action)) {
            return NextResponse.json({ success: false, error: 'Invalid data provided' }, { status: 400 });
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const newStatus = action === 'approve' ? 'verified' : 'rejected';
        const updateData: any = {
            kycStatus: newStatus,
            updatedAt: new Date(),
        };

        if (action === 'approve') {
            updateData.kycVerifiedAt = new Date();
        } else {
            updateData.kycRejectionReason = reason || '';
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: updateData,
                $push: {
                    activityLog: {
                        action: `KYC ${action === 'approve' ? 'approved' : 'declined'}`,
                        timestamp: new Date().toISOString(),
                        details: reason || ''
                    }
                } as any
            }
        );

        if (result.modifiedCount === 0 && result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: 'User not found or update failed' }, { status: 404 });
        }

        // Send notification to the user using NotificationService
        try {
            if (action === 'approve') {
                await NotificationService.notifyKycApproval(userId, user.email);
            } else {
                await NotificationService.notifyKycDecline(userId, user.email, reason);
            }
        } catch (notificationError) {
            console.error('Failed to send KYC notification:', notificationError);
        }

        return NextResponse.json({ success: true, message: `KYC successfully ${action}d` });
    } catch (error) {
        console.error('Admin KYC PUT Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
