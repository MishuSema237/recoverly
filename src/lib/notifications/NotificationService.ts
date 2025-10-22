import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface NotificationData {
  title: string;
  message: string;
  type: 'deposit_request' | 'withdrawal_request' | 'deposit_approval' | 'deposit_decline' | 'withdrawal_approval' | 'withdrawal_decline' | 'daily_gain' | 'referral_gain' | 'broadcast' | 'individual' | 'transfer_sent' | 'transfer_received' | 'welcome' | 'plan_selected' | 'plan_updated' | 'support_sent' | 'support_reply' | 'login' | 'logout' | 'user_activity';
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
    }
  }

  // Withdrawal Request Notifications
  static async notifyWithdrawalRequest(userId: string, userEmail: string, amount: number, transactionId: string) {
    const db = await getDb();
    
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
    }
  }

  // Deposit Approval Notifications
  static async notifyDepositApproval(userId: string, userEmail: string, amount: number, transactionId: string) {
    await this.createNotification({
      title: 'Deposit Approved',
      message: `Your deposit of $${amount} has been approved and added to your account balance.`,
      type: 'deposit_approval',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
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
      metadata: { transactionId, amount }
    });
  }

  // Withdrawal Approval Notifications
  static async notifyWithdrawalApproval(userId: string, userEmail: string, amount: number, transactionId: string) {
    await this.createNotification({
      title: 'Withdrawal Approved',
      message: `Your withdrawal of $${amount} has been approved and will be processed shortly.`,
      type: 'withdrawal_approval',
      recipients: [userId],
      sentBy: 'system',
      metadata: { transactionId, amount }
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
      metadata: { transactionId, amount }
    });
  }

  // Daily Gain Notifications
  static async notifyDailyGain(userId: string, amount: number, planName: string) {
    await this.createNotification({
      title: 'Daily Earnings Received',
      message: `You have received $${amount.toFixed(2)} in daily earnings from your ${planName} investment.`,
      type: 'daily_gain',
      recipients: [userId],
      sentBy: 'system',
      metadata: { amount, planName }
    });
  }

  // Referral Gain Notifications
  static async notifyReferralGain(userId: string, amount: number, referralCode: string) {
    await this.createNotification({
      title: 'Referral Bonus Earned',
      message: `You have earned $${amount} referral bonus from user with code ${referralCode}.`,
      type: 'referral_gain',
      recipients: [userId],
      sentBy: 'system',
      metadata: { amount, referralCode }
    });
  }

  // Process daily gains for all active investments
  static async processDailyGains() {
    const db = await getDb();
    
    // Get all users with active investments
    const users = await db.collection('users').find({
      'investments.status': 'active'
    }).toArray();

    for (const user of users) {
      if (user.investments && user.investments.length > 0) {
        for (const investment of user.investments) {
          if (investment.status === 'active' && investment.plan) {
            // Calculate daily gain based on plan
            const dailyRate = investment.plan.dailyRate || 0;
            const dailyGain = (investment.amount * dailyRate) / 100;
            
            if (dailyGain > 0) {
              // Add to user's balance
              await db.collection('users').updateOne(
                { _id: user._id },
                { 
                  $inc: { 
                    'balances.main': dailyGain,
                    'balances.total': dailyGain
                  },
                  $push: { 
                    'transactions': {
                      type: 'daily_gain',
                      amount: dailyGain,
                      planName: investment.plan.name,
                      date: new Date(),
                      status: 'completed'
                    }
                  },
                  $set: {
                    updatedAt: new Date()
                  }
                } as Record<string, unknown>
              );

              // Send notification
              await this.notifyDailyGain(
                user._id?.toString() || '',
                dailyGain,
                investment.plan.name
              );
            }
          }
        }
      }
    }
  }

  // Process referral bonuses
  static async processReferralBonus(referrerId: string, bonusAmount: number, referredUserCode: string) {
    const db = await getDb();
    
    // Add bonus to referrer's balance
    await db.collection('users').updateOne(
      { _id: new ObjectId(referrerId) },
      { 
        $inc: { 'balances.main': bonusAmount },
        $push: { 
          'transactions': {
            type: 'referral_bonus',
            amount: bonusAmount,
            referredUserCode: referredUserCode,
            date: new Date(),
            status: 'completed'
          }
        }
      } as Record<string, unknown>
    );

    // Send notification
    await this.notifyReferralGain(
      referrerId,
      bonusAmount,
      referredUserCode
    );
  }

  // Welcome notification for new users
  static async notifyWelcome(userId: string, userEmail: string) {
    await this.createNotification({
      title: 'Welcome to Tesla Capital!',
      message: 'Welcome to Tesla Capital! Your account has been created successfully. Start investing and grow your wealth with our premium investment plans.',
      type: 'welcome',
      recipients: [userId],
      sentBy: 'system',
      metadata: { userEmail }
    });
  }

  // Plan selection notification
  static async notifyPlanSelected(userId: string, planName: string, amount: number) {
    await this.createNotification({
      title: 'Investment Plan Selected',
      message: `You have successfully selected the ${planName} plan with an investment of $${amount}. Your investment is now active and earning daily returns.`,
      type: 'plan_selected',
      recipients: [userId],
      sentBy: 'system',
      metadata: { planName, amount }
    });
  }

  // Plan update notification
  static async notifyPlanUpdated(userId: string, oldPlan: string, newPlan: string, amount: number) {
    await this.createNotification({
      title: 'Investment Plan Updated',
      message: `Your investment plan has been updated from ${oldPlan} to ${newPlan} with an investment of $${amount}.`,
      type: 'plan_updated',
      recipients: [userId],
      sentBy: 'system',
      metadata: { planName: newPlan, amount }
    });
  }

  // Support message sent notification
  static async notifySupportSent(userId: string, userEmail: string, messageId: string) {
    const db = await getDb();
    
    // Get admin users
    const adminUsers = await db.collection('users').find({ isAdmin: true }).toArray();
    const adminIds = adminUsers.map(admin => admin._id?.toString()).filter(Boolean);
    
    // Notify user
    await this.createNotification({
      title: 'Support Message Sent',
      message: 'Your support message has been sent successfully. Our team will respond within 24 hours.',
      type: 'support_sent',
      recipients: [userId],
      sentBy: 'system',
      metadata: { supportMessageId: messageId }
    });

    // Notify all admins
    if (adminIds.length > 0) {
      await this.createNotification({
        title: 'New Support Message',
        message: `${userEmail} has sent a new support message. Please review and respond.`,
        type: 'support_sent',
        recipients: adminIds,
        sentBy: 'system',
        metadata: { supportMessageId: messageId, userEmail }
      });
    }
  }

  // Support reply notification
  static async notifySupportReply(userId: string, userEmail: string, messageId: string) {
    await this.createNotification({
      title: 'Support Reply Received',
      message: 'You have received a reply to your support message. Please check your support inbox.',
      type: 'support_reply',
      recipients: [userId],
      sentBy: 'system',
      metadata: { supportMessageId: messageId }
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
