import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface NotificationData {
  title: string;
  message: string;
  type: 'deposit_request' | 'withdrawal_request' | 'deposit_approval' | 'deposit_decline' | 'withdrawal_approval' | 'withdrawal_decline' | 'daily_gain' | 'referral_gain' | 'broadcast' | 'individual' | 'transfer_sent' | 'transfer_received';
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
}
