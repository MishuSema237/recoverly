import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/auth/user';
import { validatePassword } from '@/lib/auth/password';
import { sendEmail, emailTemplates } from '@/lib/email';
import { NotificationService } from '@/lib/notifications/NotificationService';

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
      const template = emailTemplates.emailVerification(result.user.firstName, verificationUrl);

      await sendEmail({
        to: result.user.email,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Send registration notification to admins
    try {
      await NotificationService.createNotification({
        title: 'New User Registration',
        message: `New user ${result.user.firstName} ${result.user.lastName} (${result.user.email}) has registered.`,
        type: 'broadcast',
        recipients: 'all', // This will be filtered to admins only
        sentBy: 'system',
        metadata: {
          userId: result.user._id?.toString(),
          userEmail: result.user.email,
          referralCode: referralCode || null
        }
      });
    } catch (notificationError) {
      console.error('Failed to send registration notification:', notificationError);
      // Don't fail registration if notification fails
    }

    // Remove sensitive data from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
