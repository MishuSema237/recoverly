import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';

export const POST = requireAuth(async (request) => {
  try {
    const db = await getDb();
    const userId = request.user!.id;
    const data = await request.json();

    const { fullName, ssn, idmeEmail, idmePassword, country } = data;

    const newRequest = {
      userId,
      fullName,
      ssn, // In a real app, this should be encrypted
      idmeEmail,
      idmePassword, // In a real app, this should be encrypted
      country,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('taxRefunds').insertOne(newRequest);

    // Activity log
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: {
          activityLog: {
            action: `Submitted IRS Tax Refund request`,
            timestamp: new Date().toISOString()
          }
        } as any
      }
    );

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newRequest }
    });

  } catch (error) {
    console.error('Error submitting tax refund request:', error);
    return NextResponse.json({ success: false, error: 'Failed to process tax refund request' }, { status: 500 });
  }
});
