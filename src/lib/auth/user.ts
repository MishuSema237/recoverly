import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword, verifyPassword } from './password';
import { generateToken, generateEmailVerificationToken, generatePasswordResetToken } from './jwt';

export interface User {
  _id?: string;
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
  balances?: {
    main: number;
    investment: number;
    referral: number;
    total: number;
  };
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

  static async createUser(userData: Omit<User, '_id' | 'password' | 'userCode' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'emailVerified' | 'isAdmin' | 'isActive' | 'totalInvested' | 'currentInvestment' | 'totalDeposit' | 'totalWithdraw' | 'referralEarnings'>, password: string): Promise<{ user: User; token: string; emailVerificationToken: string }> {
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

  static async getAllUsers(): Promise<User[]> {
    const db = await getDb();
    const usersCollection = db.collection<User>('users');

    const users = await usersCollection.find({}).toArray();
    return users.map(user => ({ ...user, _id: user._id!.toString() }));
  }
}
