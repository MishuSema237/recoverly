import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailVerificationToken } from '@/lib/auth/jwt';
import { UserService } from '@/lib/auth/user';

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
