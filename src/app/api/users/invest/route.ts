import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';

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

    // Update user's investment
    const success = await UserService.updateUserInvestment(userId, {
      planId,
      amount,
      planName
    });

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update investment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Investment updated successfully'
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
