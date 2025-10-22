import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailVerificationToken } from '@/lib/auth/jwt';
import { UserService } from '@/lib/auth/user';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Verify token
    const payload = verifyEmailVerificationToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Verify email
    const success = await UserService.verifyEmail(payload.userId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Get user details for notifications
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Move referral earnings to main balance if user was referred
    try {
      await UserService.moveReferralEarningsToMainBalance(payload.userId);
      
      // Process referral bonus for the referrer
      if (user.referredBy) {
        const referrer = await UserService.getUserById(user.referredBy);
        if (referrer) {
          const bonusAmount = 50; // $50 referral bonus
          await NotificationService.processReferralBonus(
            referrer._id?.toString() || '',
            bonusAmount,
            user.userCode || ''
          );
        }
      }
    } catch (error) {
      console.error('Error processing referral earnings:', error);
      // Don't fail the verification if this fails
    }

    // Send notification to user about email verification
    await NotificationService.createNotification({
      title: 'Email Verified Successfully',
      message: 'Your email has been verified successfully. You can now make deposits and access all features.',
      type: 'individual',
      recipients: [payload.userId],
      sentBy: 'system'
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Email verification failed' 
      },
      { status: 500 }
    );
  }
}
