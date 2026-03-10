import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    console.warn('SMTP credentials not found. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.warn('Email transporter not initialized. Skipping email:', options.subject);
      return;
    }

    const from = process.env.EMAIL_FROM || `"Recoverly - Trust Bank" <${process.env.SMTP_USER}>`;

    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
    // We don't throw here to prevent breaking the flow if email fails
    // But in critical paths, the caller might want to know
  }
};

// Base HTML template wrapper
export const getBaseTemplate = (title: string, content: string, userName?: string) => {
  const year = new Date().getFullYear();
  const appName = 'Recoverly';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recoverly.vercel.app';
  const logoUrl = `${appUrl}/RecoverlyLogo.png`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #ffffff;
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid #f3f4f6;
        }
        .logo {
          height: 60px;
          margin-bottom: 20px;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
          text-align: center;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 30px;
          color: #4b5563;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #c9933a;
          color: #0b1626 !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.2s;
        }
        .footer {
          background-color: #111827;
          color: #9ca3af;
          padding: 30px;
          text-align: center;
          font-size: 14px;
        }
        .footer-logo {
          color: #ffffff;
          font-weight: 700;
          font-size: 18px;
          margin-bottom: 15px;
        }
        .footer-links {
          margin: 15px 0;
        }
        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          margin: 0 10px;
        }
        .social-links {
          margin-top: 20px;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          background-color: #f9fafb;
          border-radius: 8px;
          overflow: hidden;
        }
        .data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .data-table td:first-child {
          font-weight: 600;
          color: #4b5563;
          width: 40%;
        }
        .data-table td:last-child {
          text-align: right;
          color: #111827;
        }
        .highlight {
          color: #c9933a;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="${appName}" class="logo">
        </div>
        
        <div class="content">
          <h1 class="title">${title}</h1>
          <div class="greeting">Hello${userName ? ` ${userName}` : ''},</div>
          <div class="message">
            ${content}
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">${appName}</div>
          <p>The smartest way to grow your wealth with advanced technology.</p>
          <div class="footer-links">
            <a href="${appUrl}/dashboard">Dashboard</a> | 
            <a href="${appUrl}/support">Support</a> | 
            <a href="${appUrl}/terms">Terms of Service</a>
          </div>
          <p>&copy; ${year} ${appName}. All rights reserved.</p>
          <p style="font-size: 12px; margin-top: 20px;">
            If you did not expect this email, please ignore it or contact our support.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email templates
export const emailTemplates = {
  // 1. Email Verification
  emailVerification: (userName: string, verifyUrl: string) => ({
    subject: 'Verify Your Email - Recoverly',
    html: getBaseTemplate(
      'Verify Your Email',
      `
      <p>Welcome to Recoverly! We're excited to have you on board.</p>
      <p>To get started and access all our private banking features, please verify your email address by clicking the button below:</p>
      <div class="button-container">
        <a href="${verifyUrl}" class="button">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #6b7280; word-break: break-all;">${verifyUrl}</p>
      `,
      userName
    ),
    text: `Hello ${userName}, Welcome to Recoverly! Please verify your email by following this link: ${verifyUrl}`
  }),

  // 2. Password Reset
  passwordReset: (userName: string, resetUrl: string) => ({
    subject: 'Reset Your Password - Recoverly',
    html: getBaseTemplate(
      'Reset Your Password',
      `
      <p>We received a request to reset your password for your Recoverly account.</p>
      <p>If you made this request, click the button below to set a new password:</p>
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour for your security.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      `,
      userName
    ),
    text: `Hello ${userName}, someone requested a password reset for your Recoverly account. Use this link: ${resetUrl}`
  }),

  // 3. Welcome (Sign up)
  welcome: (userName: string) => ({
    subject: 'Welcome to Recoverly! 🚀',
    html: getBaseTemplate(
      'Welcome Aboard!',
      `
      <p>Your account has been successfully created. We're thrilled to have you join our community!</p>
      <p>With Recoverly, you can:</p>
      <ul>
        <li>Securely hold and manage assets</li>
        <li>Track recovery progress in real-time</li>
        <li>Access private wealth management tools</li>
        <li>Connect with 24/7 dedicated advisors</li>
      </ul>
      <p>Ready to start your journey?</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, Welcome to Recoverly! Your account has been created successfully.`
  }),

  // 4. Deposit Confirmation
  depositConfirmation: (userName: string, amount: number, transactionId: string, status: string = 'approved', paymentMethodName: string = 'Bank Transfer') => ({
    subject: `Deposit ${status === 'approved' ? 'Successful' : 'Pending'} - Recoverly`,
    html: getBaseTemplate(
      `Deposit ${status === 'approved' ? 'Confirmed' : 'Received'}`,
      `
      <p>Your deposit has been ${status === 'approved' ? 'successfully processed and added to your balance' : 'received and is currently pending review'}.</p>
      <table class="data-table">
        <tr><td>Amount:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>Payment Method:</td><td>${paymentMethodName}</td></tr>
        <tr><td>Transaction ID:</td><td>${transactionId}</td></tr>
        <tr><td>Status:</td><td>${status.toUpperCase()}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      ${status === 'approved' ? '<p>You can now use these funds within your private account features.</p>' : '<p>We will notify you once your deposit has been approved.</p>'}
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your deposit of $${amount} via ${paymentMethodName} is ${status}. Transaction ID: ${transactionId}`
  }),

  // 5. Withdrawal Confirmation
  withdrawalConfirmation: (userName: string, amount: number, transactionId: string, status: string = 'pending', paymentMethodName: string = 'Bank Transfer') => ({
    subject: `Withdrawal ${status === 'approved' ? 'Processed' : 'Request Received'} - Recoverly`,
    html: getBaseTemplate(
      `Withdrawal ${status === 'approved' ? 'Successful' : 'Request'}`,
      `
      <p>Your withdrawal ${status === 'approved' ? 'has been processed successfully' : 'request has been received and is being reviewed by our team'}.</p>
      <table class="data-table">
        <tr><td>Amount:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>Payment Method:</td><td>${paymentMethodName}</td></tr>
        <tr><td>Transaction ID:</td><td>${transactionId}</td></tr>
        <tr><td>Status:</td><td>${status.toUpperCase()}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>Expect your funds to reach your provided destination shortly after approval.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Dashboard</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your withdrawal of $${amount} via ${paymentMethodName} is ${status}. Transaction ID: ${transactionId}`
  }),

  // 6. Money Transfer
  moneyTransfer: (userName: string, amount: number, recipientEmail: string, type: 'sent' | 'received') => ({
    subject: `Money Transfer ${type === 'sent' ? 'to' : 'from'} ${recipientEmail} - Recoverly`,
    html: getBaseTemplate(
      `Money ${type === 'sent' ? 'Sent' : 'Received'}`,
      `
      <p>You have successfully ${type === 'sent' ? 'sent' : 'received'} a money transfer.</p>
      <table class="data-table">
        <tr><td>Amount:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>${type === 'sent' ? 'Recipient' : 'Sender'}:</td><td>${recipientEmail}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Check Balance</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, you have ${type} $${amount} ${type === 'sent' ? 'to' : 'from'} ${recipientEmail}.`
  }),

  // 7. Daily Earnings
  dailyEarnings: (userName: string, amount: number, planName: string) => ({
    subject: `Daily Update Credited: $${amount.toFixed(2)} - Recoverly`,
    html: getBaseTemplate(
      'Daily Progress Credited',
      `
      <p>Your daily update from the <strong>${planName}</strong> plan has been credited to your account.</p>
      <table class="data-table">
        <tr><td>Plan:</td><td>${planName}</td></tr>
        <tr><td>Amount:</td><td class="highlight">$${amount.toFixed(2)}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>Your balance has been updated. Keep growing with Recoverly!</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Details</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your daily credited amount of $${amount.toFixed(2)} from ${planName} has been processed.`
  }),

  // 8. Subscription to a Plan
  planSubscription: (userName: string, amount: number, planName: string) => ({
    subject: `Account Activated: ${planName} - Recoverly`,
    html: getBaseTemplate(
      'Account Strategy Started!',
      `
      <p>You have successfully activated the <strong>${planName}</strong> account plan.</p>
      <table class="data-table">
        <tr><td>Plan:</td><td>${planName}</td></tr>
        <tr><td>Principal:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>Start Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>Your account is now active and will be monitored by our global wealth management team.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Track Progress</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, you have successfully activated the ${planName} plan with $${amount}.`
  }),

  // 9. Upgrade/Downgrade Plan
  planChange: (userName: string, oldPlan: string, newPlan: string, amount: number) => ({
    subject: `Account Plan Updated - Recoverly`,
    html: getBaseTemplate(
      'Plan Successfully Updated',
      `
      <p>Your account plan has been successfully updated.</p>
      <table class="data-table">
        <tr><td>Previous Plan:</td><td>${oldPlan}</td></tr>
        <tr><td>New Plan:</td><td class="highlight">${newPlan}</td></tr>
        <tr><td>Amount:</td><td>$${amount.toLocaleString()}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>Your future returns will now be calculated based on the <strong>${newPlan}</strong> plan.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Track Progress</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your account plan has been updated from ${oldPlan} to ${newPlan}.`
  }),

  // 10. Withdrawal/Deposit Request (Admin only)
  adminAlert: (type: 'Deposit' | 'Withdrawal', userEmail: string, amount: number, transactionId: string, paymentMethodName: string = 'Bank Transfer') => ({
    subject: `Admin Alert: New ${type} Request - $${amount}`,
    html: getBaseTemplate(
      `New ${type} Request`,
      `
      <p>A user has submitted a new ${type.toLowerCase()} request for review.</p>
      <table class="data-table">
        <tr><td>User:</td><td>${userEmail}</td></tr>
        <tr><td>Amount:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>Payment Method:</td><td>${paymentMethodName}</td></tr>
        <tr><td>Transaction ID:</td><td>${transactionId}</td></tr>
        <tr><td>Date:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <p>Please log in to the admin dashboard to process this request.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?section=admin" class="button">Admin Dashboard</a>
      </div>
      `,
      'Admin'
    ),
    text: `Admin Alert: New ${type} request of $${amount} via ${paymentMethodName} from ${userEmail}.`
  }),
  // 11. Plan Completed
  planCompleted: (userName: string, planName: string, amount: number, capitalReturned: boolean) => ({
    subject: `Account Strategy Completed: ${planName} - Recoverly`,
    html: getBaseTemplate(
      'Account Strategy Completed',
      `
      <p>Congratulations! Your strategy in the <strong>${planName}</strong> plan has successfully reached its maturity.</p>
      <table class="data-table">
        <tr><td>Plan:</td><td>${planName}</td></tr>
        <tr><td>Principal:</td><td>$${amount.toLocaleString()}</td></tr>
        <tr><td>Capital Returned:</td><td>${capitalReturned ? 'YES' : 'NO'}</td></tr>
        <tr><td>Completion Date:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>${capitalReturned ? 'Your principal amount has been returned to your main balance.' : 'Your strategy period has ended.'}</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your ${planName} strategy has completed. ${capitalReturned ? 'Capital returned.' : ''}`
  }),

  // 12. Broadcast Intelligence
  broadcastEmail: (subject: string, htmlContent: string) => ({
    subject: subject,
    html: getBaseTemplate(
      subject,
      `
      <div class="broadcast-payload">
        ${htmlContent}
      </div>
      <p style="font-size: 10px; color: #9ca3af; margin-top: 40px; text-align: center; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">
        Transmission Authorized by Global Wealth Management Intelligence
      </p>
      `
    ),
    text: `Recoverly Intelligence Update: ${subject}`
  }),

  // 13. Support Response Protocol
  supportResponse: (userName: string, subject: string, reply: string) => ({
    subject: `Secure Response: ${subject} - Recoverly`,
    html: getBaseTemplate(
      'Authorized Intelligence Response',
      `
      <p>A secure response has been authorized for your inquiry: <strong>${subject}</strong></p>
      <div style="background-color: #f9fafb; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="margin: 0; font-size: 15px; color: #111827; line-height: 1.6;">${reply}</p>
      </div>
      <p>If you require further assistance, please log in to your dashboard and initiate a follow-up sequence.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?section=support" class="button">View Communications</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, an admin has replied to your support request: ${subject}. Reply: ${reply}`
  }),

  // 14. Recovery Claim Confirmation
  recoveryClaimConfirmation: (userName: string, claimNumber: string, scamType: string) => ({
    subject: `Claim Received: Case #${claimNumber} - Recoverly`,
    html: getBaseTemplate(
      'Recovery Claim Filed',
      `
      <p>Your forensic briefing has been received and logged into our secure registry.</p>
      <table class="data-table">
        <tr><td>Claim Number:</td><td class="highlight">${claimNumber}</td></tr>
        <tr><td>Scam Type:</td><td>${scamType}</td></tr>
        <tr><td>Status:</td><td>PENDING REVIEW</td></tr>
        <tr><td>Date Filed:</td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>
      <p>Our intelligence division will begin a preliminary audit of your case. You can track your claim progress using your email and claim number.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-claim" class="button">Track Your Claim</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your recovery claim #${claimNumber} for ${scamType} has been received. Track it here: ${process.env.NEXT_PUBLIC_APP_URL}/track-claim`
  }),

  // 15. Recovery Claim Admin Alert
  recoveryClaimAdminAlert: (userEmail: string, claimNumber: string, scamType: string, amount: number) => ({
    subject: `Admin Alert: New Recovery Claim #${claimNumber}`,
    html: getBaseTemplate(
      'New Recovery Briefing',
      `
      <p>A new fraud recovery claim has been transmitted for forensic evaluation.</p>
      <table class="data-table">
        <tr><td>User Email:</td><td>${userEmail}</td></tr>
        <tr><td>Claim Number:</td><td>${claimNumber}</td></tr>
        <tr><td>Scam Type:</td><td>${scamType}</td></tr>
        <tr><td>Amount Lost:</td><td class="highlight">$${amount.toLocaleString()}</td></tr>
        <tr><td>Timestamp:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <p>Immediate officer assignment is recommended for this asset repatriation protocol.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?section=admin" class="button">Admin Dashboard</a>
      </div>
      `,
      'Forensic Admin'
    ),
    text: `Admin Alert: New Recovery Claim #${claimNumber} from ${userEmail}. Amount: $${amount}.`
  }),

  // 16. Recovery Claim Status Update
  recoveryClaimStatusUpdate: (userName: string, claimNumber: string, status: string, message: string) => ({
    subject: `Case Update: Case #${claimNumber} Status Shift - Recoverly`,
    html: getBaseTemplate(
      'Forensic Case Intelligence Update',
      `
      <p>An authorized update has been posted to your recovery case timeline.</p>
      <table class="data-table">
        <tr><td>Claim Number:</td><td class="highlight">${claimNumber}</td></tr>
        <tr><td>New Status:</td><td>${status.toUpperCase().replace('_', ' ')}</td></tr>
        <tr><td>Update Time:</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <div style="background-color: #f9fafb; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="margin: 0; font-size: 15px; color: #111827; line-height: 1.6;"><strong>Forensic Note:</strong> ${message}</p>
      </div>
      <p>Please use the button below to view the full chronology of your repatriation process.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/track-claim" class="button">Track Your Claim</a>
      </div>
      `,
      userName
    ),
    text: `Hello ${userName}, your case #${claimNumber} has been updated to ${status}. Note: ${message}`
  }),

  // 17. Recovery Claim Completion (Final Instruction)
  recoveryClaimCompletion: (userName: string, claimNumber: string, recoveredAmount: number, serviceFee: number) => ({
    subject: `FINAL AUTHORIZATION: Case #${claimNumber} Funds Ready - Recoverly`,
    html: getBaseTemplate(
      'Funds Recovery Protocol Finalized',
      `
      <p>We are pleased to inform you that our forensic team has successfully secured the repatriation of your lost assets.</p>
      <table class="data-table">
        <tr><td>Claim Number:</td><td>${claimNumber}</td></tr>
        <tr><td>Recovered Amount:</td><td class="highlight">$${recoveredAmount.toLocaleString()}</td></tr>
        <tr><td>Service Fee:</td><td>$${serviceFee.toLocaleString()}</td></tr>
        <tr><td>Net Payout:</td><td class="highlight" style="color: #10b981;">$${(recoveredAmount - serviceFee).toLocaleString()}</td></tr>
      </table>
      <p><strong>Action Required:</strong> To receive your funds, you must have an active Recoverly account. If you haven't created one, please use the button below to register. Once your account is active and the service fee is cleared, the funds will be instantly credited to your Safe Vault.</p>
      <div class="button-container">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/signup" class="button">Create Account / Login</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">
        Note: The recovered funds will be held in our secure escrow until identity verification and fee clearance are completed.
      </p>
      `,
      userName
    ),
    text: `Hello ${userName}, case #${claimNumber} finalized. $${recoveredAmount} recovered. Register at ${process.env.NEXT_PUBLIC_APP_URL}/signup to receive funds.`
  }),
};



