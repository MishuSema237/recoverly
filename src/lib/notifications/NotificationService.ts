import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEmail, emailTemplates, getBaseTemplate } from '@/lib/email';

interface NotificationData {
  title: string;
  message: string;
  type: 'deposit_request' | 'withdrawal_request' | 'deposit_approval' | 'deposit_decline' | 'withdrawal_approval' | 'withdrawal_decline' | 'daily_gain' | 'referral_gain' | 'broadcast' | 'individual' | 'transfer_sent' | 'transfer_received' | 'welcome' | 'plan_selected' | 'plan_updated' | 'support_sent' | 'support_reply' | 'login' | 'logout' | 'user_activity' | 'plan_completed';
  recipients: string[] | 'all';
  sentBy: string;
  metadata?: {
    transactionId?: string;
    amount?: number;
    planName?: string;
    referralCode?: string;
    userId?: string;
    userEmail?: string;
    receiverEmail?: string;
    fee?: number;
    senderEmail?: string;
    transferAmount?: number;
    supportMessageId?: string;
    loginTime?: string;
    logoutTime?: string;
    activityType?: string;
    reason?: string;
    capitalReturned?: boolean;
  };
}

export class NotificationService {
  static async createNotification(notificationData: NotificationData) {
    const db = await getDb();

    // If recipients is 'all' and type is broadcast, send to admins only
    if (notificationData.recipients === 'all' && notificationData.type === 'broadcast') {
      const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
      notificationData.recipients = adminUsers.map(admin => admin._id?.toString()).filter(Boolean) as string[];
    }

    const notification = {
      ...notificationData,
      sentAt: new Date(),
      read: false
    };

    const result = await db.collection('notifications').insertOne(notification);
    return { _id: result.insertedId, ...notification };
  }

  // Deposit Request Notifications
  static async notifyDepositRequest(userId: string, userEmail: string, amount: number, transactionId: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    // Get admin users
    const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
    const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

    // Notify user
    await this.createNotification({
      title: 'Deposit Request Submitted',
      message: `Your deposit request of $${amount} has been submitted and is pending review.`,
      type: 'deposit_request',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
    });

    // Email user
    const userEmailData = emailTemplates.depositConfirmation(userName, amount, transactionId, 'pending');
    await sendEmail({
      to: userEmail,
      subject: userEmailData.subject,
      html: userEmailData.html,
      text: userEmailData.text
    });

    // Notify all admins
    if (adminIds.length > 0) {
      await this.createNotification({
        title: 'New Deposit Request',
        message: `${userEmail} has submitted a deposit request of $${amount}. Please review and process.`,
        type: 'deposit_request',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { transactionId, amount }
      });

      // Email admins
      for (const admin of adminUsers) {
        if (admin.email) {
          const adminEmailData = emailTemplates.adminAlert('Deposit', userEmail, amount, transactionId);
          await sendEmail({
            to: admin.email,
            subject: adminEmailData.subject,
            html: adminEmailData.html,
            text: adminEmailData.text
          });
        }
      }
    }
  }

  // Withdrawal Request Notifications
  static async notifyWithdrawalRequest(userId: string, userEmail: string, amount: number, transactionId: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    // Get admin users
    const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
    const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

    // Notify user
    await this.createNotification({
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request of $${amount} has been submitted and is pending review.`,
      type: 'withdrawal_request',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
    });

    // Email user
    const userEmailData = emailTemplates.withdrawalConfirmation(userName, amount, transactionId, 'pending');
    await sendEmail({
      to: userEmail,
      subject: userEmailData.subject,
      html: userEmailData.html,
      text: userEmailData.text
    });

    // Notify all admins
    if (adminIds.length > 0) {
      await this.createNotification({
        title: 'New Withdrawal Request',
        message: `${userEmail} has submitted a withdrawal request of $${amount}. Please review and process.`,
        type: 'withdrawal_request',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { transactionId, amount }
      });

      // Email admins
      for (const admin of adminUsers) {
        if (admin.email) {
          const adminEmailData = emailTemplates.adminAlert('Withdrawal', userEmail, amount, transactionId);
          await sendEmail({
            to: admin.email,
            subject: adminEmailData.subject,
            html: adminEmailData.html,
            text: adminEmailData.text
          });
        }
      }
    }
  }

  // Deposit Approval Notifications
  static async notifyDepositApproval(userId: string, userEmail: string, amount: number, transactionId: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Deposit Approved',
      message: `Your deposit of $${amount} has been approved and added to your account balance.`,
      type: 'deposit_approval',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
    });

    // Email user
    const emailData = emailTemplates.depositConfirmation(userName, amount, transactionId, 'approved');
    await sendEmail({
      to: userEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
  }

  // Deposit Decline Notifications
  static async notifyDepositDecline(userId: string, userEmail: string, amount: number, transactionId: string, reason?: string) {
    await this.createNotification({
      title: 'Deposit Declined',
      message: `Your deposit of $${amount} has been declined.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'deposit_decline',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount, reason }
    });

    // Email user
    await sendEmail({
      to: userEmail,
      subject: 'Deposit Declined - Recoverly',
      html: `
        <h2>Deposit Declined</h2>
        <p>We regret to inform you that your deposit of $${amount} has been declined.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
        <p>Transaction ID: ${transactionId}</p>
        <p>Please contact support if you have any questions.</p>
      `,
      text: `Your deposit of $${amount} has been declined. ${reason ? `Reason: ${reason}` : ''} Transaction ID: ${transactionId}`
    });
  }

  // Withdrawal Approval Notifications
  static async notifyWithdrawalApproval(userId: string, userEmail: string, amount: number, transactionId: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Withdrawal Approved',
      message: `Your withdrawal of $${amount} has been approved and will be processed shortly.`,
      type: 'withdrawal_approval',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
    });

    // Email user
    const emailData = emailTemplates.withdrawalConfirmation(userName, amount, transactionId, 'approved');
    await sendEmail({
      to: userEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
  }

  // Withdrawal Decline Notifications
  static async notifyWithdrawalDecline(userId: string, userEmail: string, amount: number, transactionId: string, reason?: string) {
    await this.createNotification({
      title: 'Withdrawal Declined',
      message: `Your withdrawal of $${amount} has been declined.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'withdrawal_decline',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount, reason }
    });

    // Email user
    await sendEmail({
      to: userEmail,
      subject: 'Withdrawal Declined - Recoverly',
      html: `
        <h2>Withdrawal Declined</h2>
        <p>We regret to inform you that your withdrawal of $${amount} has been declined.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
        <p>Transaction ID: ${transactionId}</p>
        <p>Please contact support if you have any questions.</p>
      `,
      text: `Your withdrawal of $${amount} has been declined. ${reason ? `Reason: ${reason}` : ''} Transaction ID: ${transactionId}`
    });
  }

  // Daily Gain Notifications
  static async notifyDailyGain(userId: string, userEmail: string, amount: number, planName: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Daily Earnings Received',
      message: `You have received $${amount.toFixed(2)} in daily earnings from your ${planName} investment.`,
      type: 'daily_gain',
      recipients: [userId],
      sentBy: 'system',
      metadata: { amount, planName }
    });

    // Email user
    const emailData = emailTemplates.dailyEarnings(userName, amount, planName);
    await sendEmail({
      to: userEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
  }

  // Referral Gain Notifications
  static async notifyReferralGain(userId: string, userEmail: string, amount: number, referralCode: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Referral Bonus Earned',
      message: `You have earned $${amount} referral bonus from user with code ${referralCode}.`,
      type: 'referral_gain',
      recipients: [userId],
      sentBy: 'system',
      metadata: { amount, referralCode }
    });

    // Email user
    await sendEmail({
      to: userEmail,
      subject: 'Referral Bonus Earned - Recoverly',
      html: getBaseTemplate(
        'Referral Bonus Earned!',
        `
        <p>Congratulations! You have earned <strong>$${amount}</strong> referral bonus.</p>
        <p>Referral Code: ${referralCode}</p>
        <p>Keep referring to earn more!</p>
        `,
        userName
      ),
      text: `You have earned $${amount} referral bonus from user with code ${referralCode}.`
    });
  }

  // Process daily gains for all active investments
  static async processDailyGains() {
    const db = await getDb();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Cleanup: Clear top-level fields for users who have no active investments in their array
    await db.collection('users').updateMany(
      {
        investmentPlan: { $ne: "" },
        $or: [
          { investments: { $exists: false } },
          { investments: { $size: 0 } },
          { investments: { $not: { $elemMatch: { status: 'active' } } } }
        ]
      },
      {
        $set: {
          investmentPlan: "",
          currentInvestment: 0,
          updatedAt: now
        }
      }
    );

    // 2. Get all users with active investments to process gains/completions
    const users = await db.collection('users').find({
      'investments.status': 'active'
    }).toArray();

    for (const user of users) {
      if (user.investments && user.investments.length > 0) {
        let userUpdated = false;
        const updates = {
          $inc: { 'balances.main': 0, 'balances.total': 0 },
          $push: { transactions: { $each: [] as Record<string, unknown>[] } },
          $set: {} as Record<string, unknown>
        };

        const userId = user._id?.toString() || '';
        const userEmail = user.email || '';
        // Removed unused userName

        for (let i = 0; i < user.investments.length; i++) {
          const investment = user.investments[i];

          if (investment.status === 'active' && investment.plan) {
            // Check if we already processed today's gain for ANY investment for this user to be extra safe, 
            // but ideally we should track per investment.
            const createdAt = new Date(investment.createdAt);
            const durationDays = parseInt(investment.plan.duration) || 0;
            const endDate = new Date(createdAt);
            endDate.setDate(createdAt.getDate() + durationDays);

            const lastGainDate = investment.lastGainDate ? new Date(investment.lastGainDate) : null;
            const lastGainDateOnly = lastGainDate ? new Date(lastGainDate.getFullYear(), lastGainDate.getMonth(), lastGainDate.getDate()) : null;
            const alreadyProcessedToday = lastGainDateOnly && lastGainDateOnly.getTime() === today.getTime();

            // Calculate daily gain
            const dailyRate = investment.plan.dailyRate || (durationDays > 0 ? investment.plan.roi / durationDays : 0);
            const dailyGain = (investment.amount * dailyRate) / 100;

            // Check if plan has expired
            if (now >= endDate) {
              // Plan completed
              userUpdated = true;

              // 1. Process final daily gain if not already done today
              if (dailyGain > 0 && !alreadyProcessedToday) {
                updates.$inc['balances.main'] += dailyGain;
                updates.$inc['balances.total'] += dailyGain;
                updates.$push.transactions.$each.push({
                  type: 'daily_gain',
                  amount: dailyGain,
                  planName: investment.plan.name,
                  date: now,
                  status: 'completed',
                  description: 'Final daily gain'
                });

                // Notify daily gain
                if (userEmail) {
                  await this.notifyDailyGain(userId, userEmail, dailyGain, investment.plan.name);
                }
              }

              // 2. Return capital if applicable
              if (investment.plan.capitalBack) {
                updates.$inc['balances.main'] += investment.amount;
                updates.$push.transactions.$each.push({
                  type: 'capital_return',
                  amount: investment.amount,
                  planName: investment.plan.name,
                  date: now,
                  status: 'completed',
                  description: 'Capital returned'
                });
              }

              // 3. Mark investment as completed and clear top-level fields
              await db.collection('users').updateOne(
                { _id: user._id },
                {
                  $set: {
                    [`investments.${i}.status`]: 'completed',
                    [`investments.${i}.completedAt`]: now,
                    [`investments.${i}.lastGainDate`]: now,
                    currentInvestment: 0,
                    investmentPlan: ""
                  }
                }
              );

              // 4. Notify completion
              if (userEmail) {
                await this.notifyPlanCompleted(userId, userEmail, investment.plan.name, investment.amount, !!investment.plan.capitalBack);
              }

            } else {
              // Plan still active, process daily gain
              if (alreadyProcessedToday) {
                continue; // Skip if already done today
              }

              // Skip if investment was created TODAY (first earning comes tomorrow)
              const createdAtOnly = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
              if (createdAtOnly.getTime() === today.getTime()) {
                continue;
              }

              if (dailyGain > 0) {
                userUpdated = true;
                updates.$inc['balances.main'] += dailyGain;
                updates.$inc['balances.total'] += dailyGain;

                updates.$push.transactions.$each.push({
                  type: 'daily_gain',
                  amount: dailyGain,
                  planName: investment.plan.name,
                  date: now,
                  status: 'completed',
                  description: `Daily earnings from ${investment.plan.name}`
                });

                // Update lastGainDate for this investment
                await db.collection('users').updateOne(
                  { _id: user._id },
                  { $set: { [`investments.${i}.lastGainDate`]: now } }
                );

                // Send notification
                if (userEmail) {
                  await this.notifyDailyGain(userId, userEmail, dailyGain, investment.plan.name);
                }
              }
            }
          }
        }

        if (userUpdated) {
          // Apply updates to balances and transactions
          await db.collection('users').updateOne(
            { _id: user._id },
            {
              $inc: updates.$inc,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              $push: updates.$push as any,
              $set: { ...updates.$set, updatedAt: now }
            }
          );
        }
      }
    }
  }

  // Plan completed notification
  static async notifyPlanCompleted(userId: string, userEmail: string, planName: string, amount: number, capitalReturned: boolean) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    const message = capitalReturned
      ? `Your ${planName} investment plan has completed. Your capital of $${amount} has been returned to your main balance.`
      : `Your ${planName} investment plan has completed.`;

    await this.createNotification({
      title: 'Investment Plan Completed',
      message: message,
      type: 'plan_completed',
      recipients: [userId],
      sentBy: 'system',
      metadata: { planName, amount, capitalReturned }
    });

    // Email user
    const emailData = emailTemplates.planCompleted(userName, planName, amount, capitalReturned);
    await sendEmail({
      to: userEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
  }

  // Process referral bonuses (already mostly correct, but updating notification)
  static async processReferralBonus(referrerId: string, bonusAmount: number, referredUserCode: string) {
    const db = await getDb();
    const referrer = await db.collection('users').findOne({ _id: new ObjectId(referrerId) });

    await db.collection('users').updateOne(
      { _id: new ObjectId(referrerId) },
      {
        $inc: { 'balances.main': bonusAmount, 'balances.referral': bonusAmount },
        $push: {
          'transactions': {
            type: 'referral_bonus',
            amount: bonusAmount,
            referredUserCode: referredUserCode,
            date: new Date(),
            status: 'completed',
            description: `Referral bonus from user ${referredUserCode}`
          }
        }
      } as Record<string, unknown>
    );

    if (referrer && referrer.email) {
      await this.notifyReferralGain(referrerId, referrer.email, bonusAmount, referredUserCode);
    }
  }

  // Welcome notification
  static async notifyWelcome(userId: string, userEmail: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Welcome to Recoverly!',
      message: 'Welcome to Recoverly! Your account has been created successfully. Start investing and grow your wealth.',
      type: 'welcome',
      recipients: [userId],
      sentBy: 'system',
      metadata: { userEmail }
    });

    // Email user
    const emailData = emailTemplates.welcome(userName);
    await sendEmail({
      to: userEmail,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
  }

  // Plan selection notification
  static async notifyPlanSelected(userId: string, planName: string, amount: number) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userEmail = user?.email || '';
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Investment Plan Selected',
      message: `You have successfully selected the ${planName} plan with an investment of $${amount}.`,
      type: 'plan_selected',
      recipients: [userId],
      sentBy: 'system',
      metadata: { planName, amount }
    });

    if (userEmail) {
      const emailData = emailTemplates.planSubscription(userName, amount, planName);
      await sendEmail({
        to: userEmail,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });
    }
  }

  // Plan update notification
  static async notifyPlanUpdated(userId: string, oldPlan: string, newPlan: string, amount: number) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userEmail = user?.email || '';
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Investment Plan Updated',
      message: `Your investment plan has been updated from ${oldPlan} to ${newPlan} with an investment of $${amount}.`,
      type: 'plan_updated',
      recipients: [userId],
      sentBy: 'system',
      metadata: { planName: newPlan, amount }
    });

    if (userEmail) {
      const emailData = emailTemplates.planChange(userName, oldPlan, newPlan, amount);
      await sendEmail({
        to: userEmail,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });
    }
  }

  // Support message sent notification
  static async notifySupportSent(userId: string, userEmail: string, messageId: string) {
    const db = await getDb();
    const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
    const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

    await this.createNotification({
      title: 'Support Message Sent',
      message: 'Your support message has been sent successfully. Our team will respond within 24 hours.',
      type: 'support_sent',
      recipients: [userId],
      sentBy: 'system',
      metadata: { supportMessageId: messageId }
    });

    if (adminIds.length > 0) {
      await this.createNotification({
        title: 'New Support Message',
        message: `${userEmail} has sent a new support message.`,
        type: 'support_sent',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { supportMessageId: messageId, userEmail }
      });
    }
  }

  // Support reply notification
  static async notifySupportReply(userId: string, userEmail: string, messageId: string) {
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userName = user?.firstName || userEmail;

    await this.createNotification({
      title: 'Support Reply Received',
      message: 'You have received a reply to your support message.',
      type: 'support_reply',
      recipients: [userId],
      sentBy: 'system',
      metadata: { supportMessageId: messageId }
    });

    // Email user
    await sendEmail({
      to: userEmail,
      subject: 'Support Reply Received - Recoverly',
      html: getBaseTemplate(
        'Support Reply Received',
        `
        <p>You have received a reply to your support message.</p>
        <p>Please log in to your account to view the message in the support section.</p>
        <div class="button-container">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?section=support" class="button">View Support Inbox</a>
        </div>
        `,
        userName
      ),
      text: `You have received a reply to your support message. Please log in to your account to view the reply.`
    });
  }

  // Login notification (for admins)
  static async notifyLogin(userId: string, userEmail: string, isAdmin: boolean = false) {
    if (isAdmin) {
      // Only notify other admins about admin logins
      const db = await getDb();
      const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
      const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

      await this.createNotification({
        title: 'Admin Login',
        message: `Admin ${userEmail} has logged in to the system.`,
        type: 'login',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { userEmail, loginTime: new Date().toISOString() }
      });
    }
  }

  // Logout notification (for admins)
  static async notifyLogout(userId: string, userEmail: string, isAdmin: boolean = false) {
    if (isAdmin) {
      // Only notify other admins about admin logouts
      const db = await getDb();
      const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
      const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

      await this.createNotification({
        title: 'Admin Logout',
        message: `Admin ${userEmail} has logged out of the system.`,
        type: 'logout',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { userEmail, logoutTime: new Date().toISOString() }
      });
    }
  }

  // User activity notification (for admins)
  static async notifyUserActivity(userId: string, userEmail: string, activityType: string, details?: string) {
    const db = await getDb();
    const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
    const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);

    if (adminIds.length > 0) {
      await this.createNotification({
        title: 'User Activity',
        message: `User ${userEmail} performed ${activityType}.${details ? ` Details: ${details}` : ''}`,
        type: 'user_activity',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { userEmail, activityType, userId }
      });
    }
  }
}
