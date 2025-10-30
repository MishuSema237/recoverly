import { NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/middleware/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const { planId, planName, amount } = await request.json();
    const userId = request.user!.id;

    if (!planId || !planName || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'planId, planName and positive amount are required' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const plans = db.collection('investmentPlans');

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const plan = await plans.findOne({ _id: new ObjectId(planId) });
    if (!plan) {
      return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });
    }

    const mainBalance = user.balances?.main || 0;
    if (mainBalance < amount) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    // Close previous active investment if any
    let prevActiveIndex = -1;
    if (Array.isArray(user.investments)) {
      prevActiveIndex = user.investments.findIndex((inv: any) => inv?.status === 'active');
    }
    const now = new Date();

    if (prevActiveIndex >= 0) {
      const prev = user.investments[prevActiveIndex];
      user.investments[prevActiveIndex] = {
        ...prev,
        status: 'completed',
        endDate: now
      };
    }

    // Compute duration
    let durationDays = 30;
    if (typeof plan.duration === 'string') {
      const m = plan.duration.match(/\d+/);
      durationDays = m ? parseInt(m[0]) : 30;
    } else if (typeof plan.duration === 'number') {
      durationDays = plan.duration;
    }

    const roi = typeof plan.roi === 'number' ? plan.roi : parseFloat(plan.roi || '0');
    const dailyRate = durationDays > 0 ? roi / durationDays : 0; // percent per day

    const newInvestment = {
      _id: new ObjectId().toString(),
      planName,
      amount: Number(amount),
      status: 'active',
      plan: {
        name: planName,
        dailyRate,
        duration: durationDays
      },
      createdAt: now,
      endDate: new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000)
    };

    // Apply balance updates
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          investmentPlan: planName,
          currentInvestment: Number(amount),
          'balances.main': mainBalance - Number(amount),
          'balances.investment': (user.balances?.investment || 0) + Number(amount),
          'balances.total': (user.balances?.total || 0),
          updatedAt: now,
          investments: Array.isArray(user.investments)
            ? [...user.investments.filter((inv: any, idx: number) => idx !== prevActiveIndex), newInvestment]
            : [newInvestment]
        },
        $push: {
          transactions: {
            type: 'investment',
            amount: Number(amount),
            planName,
            date: now,
            status: 'completed',
            description: `Upgraded investment by $${Number(amount)} to ${planName}`
          },
          activityLog: {
            action: `Upgraded plan to ${planName} with $${Number(amount)}`,
            timestamp: now.toISOString()
          }
        }
      }
    );

    return NextResponse.json({ success: true, data: { investment: newInvestment } });
  } catch (error) {
    console.error('Upgrade investment error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Upgrade failed' }, { status: 500 });
  }
});


