import { NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const POST = requireAuth(async (request) => {
  try {
    const { planId, amount, planName } = await request.json();
    const userId = request.user!.id;

    if (!planId || !amount || !planName) {
      return NextResponse.json(
        { success: false, error: 'Plan ID, amount, and plan name are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Investment amount must be greater than 0' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection('users');
    const plansCollection = db.collection('investmentPlans');

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check balance
    const currentBalance = user.balances?.main || 0;
    if (currentBalance < amount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await plansCollection.findOne({ _id: new ObjectId(planId) });
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate duration in days
    let durationDays = 30;
    if (typeof plan.duration === 'string') {
      const match = plan.duration.match(/\d+/);
      durationDays = match ? parseInt(match[0]) : 30;
    } else if (typeof plan.duration === 'number') {
      durationDays = plan.duration;
    }

    // Calculate ROI and daily rate
    const roi = typeof plan.roi === 'number' ? plan.roi : parseFloat(plan.roi || '0');
    const dailyRate = roi / durationDays;

    // Create investment object
    const now = new Date();
    const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    
    const investment = {
      _id: new ObjectId().toString(),
      planName,
      amount: parseFloat(amount.toString()),
      status: 'active',
      plan: {
        name: planName,
        dailyRate,
        duration: durationDays
      },
      createdAt: now,
      endDate
    };

    // Update user - deduct from main, add to investment
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          totalInvested: (user.totalInvested || 0) + amount,
          currentInvestment: amount,
          investmentPlan: planName,
          'balances.main': currentBalance - amount,
          'balances.investment': (user.balances?.investment || 0) + amount,
          'balances.total': (user.balances?.main || 0) - amount + (user.balances?.investment || 0) + amount,
          updatedAt: now
        },
        $push: {
          investments: investment,
          transactions: {
            type: 'investment',
            amount: amount,
            planName: planName,
            date: now,
            status: 'completed',
            description: `Invested $${amount} in ${planName} plan`
          },
          activityLog: {
            action: `Invested $${amount} in ${planName} plan`,
            timestamp: now.toISOString()
          }
        }
      }
    );

    // Create notification for user
    await db.collection('notifications').insertOne({
      title: 'Investment Started',
      message: `You've successfully invested $${amount} in ${planName} plan. Your investment will earn ${roi}% over ${durationDays} days.`,
      type: 'success',
      recipients: [userId],
      sentBy: 'system',
      sentAt: now,
      read: false,
      metadata: { investmentId: investment._id, amount, planName }
    });

    // Create notification for admins
    const admins = await usersCollection.find({ isAdmin: true }).toArray();
    const adminIds = admins.map(admin => admin._id?.toString()).filter(Boolean);
    
    if (adminIds.length > 0) {
      await db.collection('notifications').insertOne({
        title: 'New Investment',
        message: `${user.firstName} ${user.lastName} (${user.email}) invested $${amount} in ${planName} plan`,
        type: 'admin-only',
        recipients: adminIds,
        sentBy: 'system',
        sentAt: now,
        read: false,
        details: JSON.stringify({
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          amount,
          planName,
          investmentId: investment._id
        })
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Investment created successfully',
      data: investment
    });

  } catch (error) {
    console.error('Investment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Investment failed' 
      },
      { status: 500 }
    );
  }
});
