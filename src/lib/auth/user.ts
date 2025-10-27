import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword, verifyPassword } from './password';
import { generateToken, generateEmailVerificationToken, generatePasswordResetToken } from './jwt';

export interface User {
  _id?: string | ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  userCode: string;
  isAdmin: boolean;
  isActive: boolean;
  profilePicture?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  totalInvested: number;
  currentInvestment: number;
  investmentPlan?: string;
  totalDeposit: number;
  totalWithdraw: number;
  referralEarnings: number;
  referredBy?: string; // ID of the user who referred this user
  referredByCode?: string; // Referral code used when signing up
  balances?: {
    main: number;
    investment: number;
    referral: number;
    total: number;
  };
  investments?: Array<{
    _id: string;
    planName: string;
    amount: number;
    status: 'active' | 'completed' | 'cancelled';
    plan: {
      name: string;
      dailyRate: number;
      duration: number;
    };
    createdAt: Date;
    endDate: Date;
  }>;
  transactions?: Array<{
    type: 'daily_gain' | 'referral_bonus' | 'deposit' | 'withdrawal' | 'investment';
    amount: number;
    planName?: string;
    date: Date;
    status: 'completed' | 'pending' | 'failed';
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  activityLog?: Array<{
    action: string;
    timestamp: string;
  }>;
}

export class UserService {
  private static generateUserCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async createUser(userData: Omit<User, '_id' | 'password' | 'userCode' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'emailVerified' | 'isAdmin' | 'isActive' | 'totalInvested' | 'currentInvestment' | 'totalDeposit' | 'totalWithdraw' | 'referralEarnings'>, password: string, referralCode?: string): Promise<{ user: User; token: string; emailVerificationToken: string }> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate user code
    let userCode: string;
    let isUnique = false;
    while (!isUnique) {
      userCode = this.generateUserCode();
      const existingCode = await usersCollection.findOne({ userCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken('temp'); // Will be updated after user creation

    const now = new Date();
    const user: User = {
      ...userData,
      password: hashedPassword,
      userCode: userCode!,
      emailVerified: false,
      emailVerificationToken,
      emailVerificationExpires: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
      isAdmin: false,
      isActive: true,
      totalInvested: 0,
      currentInvestment: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      referralEarnings: 0,
      balances: {
        main: 0,
        investment: 0,
        referral: 0,
        total: 0
      },
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
      activityLog: [{
        action: 'Account created',
        timestamp: now.toISOString()
      }]
    };

    const result = await usersCollection.insertOne(user);
    const createdUser = { ...user, _id: result.insertedId.toString() };

    // Generate proper email verification token with actual user ID
    const properEmailVerificationToken = generateEmailVerificationToken(createdUser._id!);
    await usersCollection.updateOne(
      { _id: result.insertedId },
      { $set: { emailVerificationToken: properEmailVerificationToken } }
    );

    // Handle referral bonus if referral code provided
    if (referralCode) {
      await this.processReferralBonus(referralCode, createdUser._id!);
    }

    // Notify admins of new user registration
    await this.notifyAdminsOfUserActivity(createdUser._id!, 'registration', createdUser);

    // Generate JWT token
    const token = generateToken({
      userId: createdUser._id!,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin
    });

    return {
      user: { ...createdUser, emailVerificationToken: properEmailVerificationToken },
      token,
      emailVerificationToken: properEmailVerificationToken
    };
  }

  static async authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return null;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLoginAt: new Date(),
          updatedAt: new Date()
        },
        $push: {
          activityLog: {
            action: 'User logged in',
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    // Notify admins of user login
    await this.notifyAdminsOfUserActivity(user._id!.toString(), 'login', user);

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      isAdmin: user.isAdmin
    });

    return {
      user: { ...user, _id: user._id!.toString() },
      token
    };
  }

  static async getUserById(userId: string): Promise<User | null> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }

    return { ...user, _id: user._id!.toString() };
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return null;
    }

    return { ...user, _id: user._id!.toString() };
  }

  static async getUserByReferralCode(referralCode: string): Promise<User | null> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ userCode: referralCode });
    if (!user) {
      return null;
    }

    return { ...user, _id: user._id!.toString() };
  }

  static async verifyEmail(userId: string): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          emailVerified: true,
          updatedAt: new Date()
        },
        $unset: {
          emailVerificationToken: '',
          emailVerificationExpires: ''
        },
        $push: {
          activityLog: {
            action: 'Email verified',
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    return result.modifiedCount > 0;
  }

  static async requestPasswordReset(email: string): Promise<string | null> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return null;
    }

    const passwordResetToken = generatePasswordResetToken(user._id!.toString());
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          passwordResetToken,
          passwordResetExpires,
          updatedAt: new Date()
        }
      }
    );

    return passwordResetToken;
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    // Find user with valid reset token
    const user = await usersCollection.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return false;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    const result = await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        },
        $unset: {
          passwordResetToken: '',
          passwordResetExpires: ''
        },
        $push: {
          activityLog: {
            action: 'Password reset',
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    return result.modifiedCount > 0;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updates,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  static async updateUserInvestment(userId: string, investmentData: {
    planId: string;
    amount: number;
    planName: string;
  }): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return false;
      }

      // Check if user has enough balance
      const currentBalance = user.balances?.main || 0;
      if (currentBalance < investmentData.amount) {
        return false;
      }

      // Update user's investment
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            totalInvested: (user.totalInvested || 0) + investmentData.amount,
            currentInvestment: investmentData.amount,
            investmentPlan: investmentData.planName,
            'balances.main': currentBalance - investmentData.amount,
            'balances.investment': (user.balances?.investment || 0) + investmentData.amount,
            updatedAt: new Date()
          },
          $push: {
            activityLog: {
              action: `Invested $${investmentData.amount} in ${investmentData.planName} plan`,
              timestamp: new Date().toISOString()
            }
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user investment:', error);
      return false;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const users = await usersCollection.find({}).toArray();
    return users.map(user => ({ ...user, _id: user._id!.toString() }));
  }

  // Referral System Methods
  static async processReferralBonus(referralCode: string, newUserId: string): Promise<void> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    // Find the referrer by their user code
    const referrer = await usersCollection.findOne({ userCode: referralCode });
    if (!referrer) {
      console.log(`Referral code ${referralCode} not found`);
      return;
    }

    // Check if this user was already referred by someone else
    const newUser = await usersCollection.findOne({ _id: new ObjectId(newUserId) });
    if (!newUser) {
      console.log(`New user ${newUserId} not found`);
      return;
    }

    // Add referral bonus to referrer's main balance (immediately available for transfer)
    const referralBonus = 10; // $10 bonus for each referral
    const newReferralEarnings = (referrer.referralEarnings || 0) + referralBonus;
    const newMainBalance = (referrer.balances?.main || 0) + referralBonus;
    const newTotalBalance = (referrer.balances?.total || 0) + referralBonus;

    await usersCollection.updateOne(
      { _id: referrer._id },
      {
        $set: {
          referralEarnings: newReferralEarnings,
          'balances.main': newMainBalance,
          'balances.total': newTotalBalance,
          updatedAt: new Date()
        },
        $push: {
          activityLog: {
            action: `Referral bonus earned: $${referralBonus} from ${newUser.firstName} ${newUser.lastName} (signup)`,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    // Update new user with referrer info
    await usersCollection.updateOne(
      { _id: new ObjectId(newUserId) },
      {
        $set: {
          referredBy: referrer._id!.toString(),
          referredByCode: referralCode,
          updatedAt: new Date()
        },
        $push: {
          activityLog: {
            action: `Referred by ${referrer.firstName} ${referrer.lastName} (${referralCode})`,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    console.log(`Referral bonus processed: $${referralBonus} added to ${referrer.email} (pending email verification)`);
  }

  // Move referral earnings to main balance when user verifies email
  // NOTE: This function is kept for backward compatibility with existing users who may have bonuses in referral balance
  // New signups now get bonuses directly in main balance
  static async moveReferralEarningsToMainBalance(userId: string): Promise<void> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.referredBy) {
      return; // User wasn't referred or doesn't exist
    }

    // Find the referrer
    const referrer = await usersCollection.findOne({ _id: new ObjectId(user.referredBy) });
    if (!referrer) {
      return;
    }

    // Only move if there's actually a referral balance (for existing users)
    const referralBalance = referrer.balances?.referral || 0;
    if (referralBalance === 0) {
      return; // No referral balance to move
    }

    // Move referral earnings to main balance
    const referralBonus = 10; // Same amount as in processReferralBonus
    const newMainBalance = (referrer.balances?.main || 0) + referralBonus;
    const newReferralBalance = Math.max(0, referralBalance - referralBonus);

    await usersCollection.updateOne(
      { _id: referrer._id },
      {
        $set: {
          'balances.main': newMainBalance,
          'balances.referral': newReferralBalance,
          updatedAt: new Date()
        },
        $push: {
          activityLog: {
            action: `Referral bonus moved to main balance: $${referralBonus} from ${user.firstName} ${user.lastName} (email verified)`,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    console.log(`Referral bonus moved to main balance: $${referralBonus} for ${referrer.email}`);
  }

  static async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    totalEarnings: number;
    referrals: Array<{
      name: string;
      email: string;
      joinedAt: string;
    }>;
  }> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new Error('User not found');
    }

    // Find all users referred by this user
    const referrals = await usersCollection.find({ 
      referredBy: user._id!.toString()
    }).sort({ createdAt: -1 }).toArray();

    // Calculate total earnings from both referralEarnings and transactions
    let totalEarnings = user.referralEarnings || 0;
    
    // Add earnings from referral bonus transactions
    if (user.transactions) {
      const referralTransactions = user.transactions.filter(t => t.type === 'referral_bonus');
      const transactionEarnings = referralTransactions.reduce((sum, t) => sum + t.amount, 0);
      totalEarnings += transactionEarnings;
    }

    return {
      totalReferrals: referrals.length,
      totalEarnings: totalEarnings,
      referrals: referrals.map(ref => ({
        name: `${ref.firstName} ${ref.lastName}`,
        email: ref.email,
        joinedAt: ref.createdAt.toISOString()
      }))
    };
  }

  static generateReferralLink(userCode: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/signup?ref=${userCode}`;
  }

  static async validateReferralCode(referralCode: string): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ userCode: referralCode });
    return !!user;
  }

  // Admin Notification Methods
  static async notifyAdminsOfUserActivity(userId: string, activity: 'registration' | 'login', user: User): Promise<void> {
    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    const usersCollection = db.collection<User>('users');

    // Find all admin users
    const admins = await usersCollection.find({ isAdmin: true }).toArray();
    const adminReferralCodes = admins.map(admin => admin.userCode).filter(Boolean);

    if (adminReferralCodes.length === 0) {
      console.warn('No admins found to notify of user activity.');
      return;
    }

    let notificationTitle = '';
    let notificationMessage = '';

    if (activity === 'registration') {
      notificationTitle = 'New User Registration';
      notificationMessage = `New user registered: ${user.firstName} ${user.lastName} (${user.email})`;
    } else if (activity === 'login') {
      notificationTitle = 'User Login';
      notificationMessage = `User logged in: ${user.firstName} ${user.lastName} (${user.email})`;
    }

    // Create notification for all admins only
    await notificationsCollection.insertOne({
      title: notificationTitle,
      message: notificationMessage,
      type: 'admin-only', // Only admins see this
      recipients: adminReferralCodes, // Send to specific admin codes
      sentBy: 'system',
      sentAt: new Date(),
      read: false,
      details: JSON.stringify({
        userId: userId,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        userCode: user.userCode,
        activity: activity,
        timestamp: new Date().toISOString()
      })
    });

    console.log(`Admins notified of user ${activity}: ${user.email}`);
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
