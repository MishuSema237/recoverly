import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getUserByEmail } from '@/lib/services/UserService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Create verification URL (in a real app, you'd generate a unique token)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?verified=true&email=${encodeURIComponent(email)}`;

    // Send professional verification email
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Tesla Capital</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
          }
          .button:hover {
            background: linear-gradient(135deg, #b91c1c, #991b1b);
            transform: translateY(-1px);
          }
          .security-note {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .link {
            color: #dc2626;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Tesla Capital</div>
            <h1 class="title">Verify Your Email Address</h1>
          </div>
          
          <div class="content">
            <p>Hello${user.firstName ? ` ${user.firstName}` : ''},</p>
            
            <p>Thank you for creating your Tesla Capital account! To complete your registration and access all features, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify My Email</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
            
            <div class="security-note">
              <strong>Security Notice:</strong> This verification link will help secure your account. If you didn't create an account with Tesla Capital, you can safely ignore this email.
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul style="color: #6b7280; font-size: 14px;">
              <li>Access your investment dashboard</li>
              <li>Make deposits and withdrawals</li>
              <li>View your transaction history</li>
              <li>Access all premium features</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This email was sent from Tesla Capital</p>
            <p>If you have any questions, please contact our support team at <a href="mailto:support@teslacapital.com" class="link">support@teslacapital.com</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
              © ${new Date().getFullYear()} Tesla Capital. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Tesla Capital - Email Verification

Hello${user.firstName ? ` ${user.firstName}` : ''},

Thank you for creating your Tesla Capital account! To complete your registration and access all features, please verify your email address by clicking the link below:

${verificationUrl}

Once verified, you'll be able to:
- Access your investment dashboard
- Make deposits and withdrawals
- View your transaction history
- Access all premium features

If you didn't create an account with Tesla Capital, you can safely ignore this email.

If you have any questions, please contact our support team at support@teslacapital.com

© ${new Date().getFullYear()} Tesla Capital. All rights reserved.
    `;

    // Send email
    await sendEmail({
      to: email,
      subject: 'Verify Your Email Address - Tesla Capital',
      html: emailHtml,
      text: emailText,
    });

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send verification email error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}








