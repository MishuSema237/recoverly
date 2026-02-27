import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';

export const GET = requireAuth(async (request) => {
  try {
    const db = await getDb();
    const userId = request.user!.id;

    const loans = await db.collection('loans')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: loans
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch loans' }, { status: 500 });
  }
});

export const POST = requireAuth(async (request) => {
  try {
    const db = await getDb();
    const userId = request.user!.id;
    const data = await request.json();

    const { amount, duration, facility, purpose, income } = data;

    const newLoan = {
      userId,
      amount,
      duration,
      facility,
      purpose,
      income,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('loans').insertOne(newLoan);

    // Activity log
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: {
          activityLog: {
            action: `Applied for a $${amount} ${facility} loan`,
            timestamp: new Date().toISOString()
          }
        } as any
      }
    );

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newLoan }
    });

  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json({ success: false, error: 'Failed to process loan application' }, { status: 500 });
  }
});
