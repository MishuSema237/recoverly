import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const { userId, documents } = await req.json();

        if (!userId || !documents || !documents.idFront || !documents.idBack || !documents.selfie) {
            return NextResponse.json({ success: false, error: 'Missing required data' }, { status: 400 });
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    kycStatus: 'pending',
                    kycDocuments: documents,
                    updatedAt: new Date(),
                },
                $push: {
                    activityLog: {
                        action: 'KYC documents submitted',
                        timestamp: new Date().toISOString()
                    }
                } as any
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, error: 'User not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'KYC documents submitted successfully' });
    } catch (error) {
        console.error('KYC API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
