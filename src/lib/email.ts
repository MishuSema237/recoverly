interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Check if EmailJS is configured
const isEmailConfigured = () => {
  return !!(
    process.env.EMAILJS_SERVICE_ID &&
    process.env.EMAILJS_TEMPLATE_ID &&
    process.env.EMAILJS_PUBLIC_KEY
  );
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (!isEmailConfigured()) {
      throw new Error('EmailJS configuration is missing. Please set up EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in your environment variables.');
    }

    // Send email using EmailJS REST API
    const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          to_email: options.to,
          subject: options.subject,
          message: options.html,
          from_name: 'Tesla Capital',
          reply_to: process.env.EMAIL_FROM || 'noreply@teslacapital.com',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} ${errorText}`);
    }

    console.log('Email sent successfully via EmailJS to:', options.to);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
export const emailTemplates = {
  passwordReset: {
    subject: 'Reset Your Password - Tesla Capital',
    getHtml: (resetUrl: string, userName?: string) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Tesla Capital</title>
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
            <h1 class="title">Reset Your Password</h1>
          </div>
          
          <div class="content">
            <p>Hello${userName ? ` ${userName}` : ''},</p>
            
            <p>We received a request to reset your password for your Tesla Capital account. If you made this request, click the button below to set a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
            
            <div class="security-note">
              <strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, you can safely ignore this email.
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the URL below into your web browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
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
    `,
    getText: (resetUrl: string, userName?: string) => `
Tesla Capital - Password Reset Request

Hello${userName ? ` ${userName}` : ''},

We received a request to reset your password for your Tesla Capital account. If you made this request, click the link below to set a new password:

${resetUrl}

This link will expire in 1 hour for your security. If you didn't request this password reset, you can safely ignore this email.

If you're having trouble with the link above, copy and paste the URL into your web browser.

If you have any questions, please contact our support team at support@teslacapital.com

© ${new Date().getFullYear()} Tesla Capital. All rights reserved.
    `,
  },
};



