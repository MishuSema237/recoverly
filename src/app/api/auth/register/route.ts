import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/auth/user';
import { validatePassword } from '@/lib/auth/password';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, country, state, city, zip, referralCode } = await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Validate referral code if provided
    if (referralCode) {
      const isValidReferralCode = await UserService.validateReferralCode(referralCode);
      if (!isValidReferralCode) {
        return NextResponse.json(
          { success: false, error: 'Invalid referral code' },
          { status: 400 }
        );
      }
    }

    // Create user
    const result = await UserService.createUser({
      email: email.toLowerCase(),
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      phone,
      country,
      state,
      city,
      zip
    }, password, referralCode);

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${result.emailVerificationToken}`;
      
      await sendEmail({
        to: result.user.email,
        subject: 'Verify Your Email - Tesla Capital',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Welcome to Tesla Capital!</h2>
            <p>Hi ${result.user.firstName},</p>
            <p>Thank you for registering with Tesla Capital. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with Tesla Capital, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">© 2024 Tesla Capital. All rights reserved.</p>
          </div>
        `,
        text: `Welcome to Tesla Capital!

Hi ${result.user.firstName},

Thank you for registering with Tesla Capital. Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with Tesla Capital, please ignore this email.

© 2024 Tesla Capital. All rights reserved.`
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Remove sensitive data from response
    const { password: _password, emailVerificationToken: _emailToken, ...userWithoutSensitiveData } = result.user;

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: userWithoutSensitiveData,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      },
      { status: 500 }
    );
  }
}
