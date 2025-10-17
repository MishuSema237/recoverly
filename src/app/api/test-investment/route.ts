import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';

export const POST = requireAuth(async (request) => {
  try {
    const { planName, amount } = await request.json();
    const userId = request.user!.id;

    if (!planName || !amount) {
      return NextResponse.json({
        success: false,
        error: 'Plan name and amount are required'
      }, { status: 400 });
    }

    const db = await getDb();
    
    // Create a test investment
    const investment = {
      _id: new ObjectId().toString(),
      planName,
      amount: parseFloat(amount),
      status: 'active',
      plan: {
        name: planName,
        dailyRate: 2.5, // 2.5% daily return
        duration: 30 // 30 days
      },
      createdAt: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    // Add investment to user
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: { investments: investment },
        $inc: { 
          'balances.main': -parseFloat(amount),
          'balances.investment': parseFloat(amount),
          totalInvested: parseFloat(amount),
          currentInvestment: parseFloat(amount)
        }
      } as Record<string, unknown>
    );

    return NextResponse.json({
      success: true,
      message: 'Test investment created successfully',
      data: investment
    });

  } catch (error) {
    console.error('Error creating test investment:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create investment'
    }, { status: 500 });
  }
});


