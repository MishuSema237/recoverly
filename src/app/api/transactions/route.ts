import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface DepositRequest {
  _id?: ObjectId;
  userId: string;
  paymentMethodId: string;
  amount: number;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

interface WithdrawalRequest {
  _id?: ObjectId;
  userId: string;
  paymentMethodId: string;
  amount: number;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  processedBy?: string;
  processedAt?: Date;
  rejectionReason?: string;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'deposits') {
      const collection = db.collection<DepositRequest>('depositRequests');
      const deposits = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ success: true, data: deposits });
    } else if (type === 'withdrawals') {
      const collection = db.collection<WithdrawalRequest>('withdrawalRequests');
      const withdrawals = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ success: true, data: withdrawals });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid transaction type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { type, ...transactionData } = data;

    if (type === 'deposit') {
      const collection = db.collection<DepositRequest>('depositRequests');
      const newDeposit = {
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
      };
      const result = await collection.insertOne(newDeposit);
      
      // Send notification to all admins
      await notifyAdminsOfTransaction('deposit', transactionData.userId, transactionData.amount);
      
      return NextResponse.json({ success: true, data: result.insertedId });
    } else if (type === 'withdrawal') {
      const collection = db.collection<WithdrawalRequest>('withdrawalRequests');
      const newWithdrawal = {
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
      };
      const result = await collection.insertOne(newWithdrawal);
      
      // Send notification to all admins
      await notifyAdminsOfTransaction('withdrawal', transactionData.userId, transactionData.amount);
      
      return NextResponse.json({ success: true, data: result.insertedId });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid transaction type for POST' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ success: false, error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { _id, type, status, rejectionReason, approvedBy, approvedAt } = await request.json();

    if (!_id || !type || !status) {
      return NextResponse.json({ success: false, error: 'Transaction ID, type, and status are required' }, { status: 400 });
    }

    // Validate ObjectId format
    let objectId;
    try {
      objectId = new ObjectId(_id);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Invalid transaction ID format' }, { status: 400 });
    }

    let collection;
    let updateDoc: any = { status, updatedAt: new Date() };

    if (type === 'deposit') {
      collection = db.collection<DepositRequest>('depositRequests');
      if (status === 'approved') {
        updateDoc = { ...updateDoc, approvedBy, approvedAt };
        
        // Get the deposit request to update user balance
        const depositRequest = await collection.findOne({ _id: objectId });
        if (depositRequest) {
          // Update user balance
          await updateUserBalance(depositRequest.userId, depositRequest.amount, 'add');
          
          // Notify user of approval
          await notifyUserOfTransactionApproval(depositRequest.userId, 'deposit', depositRequest.amount);
        }
      } else if (status === 'rejected') {
        updateDoc = { ...updateDoc, rejectionReason };
      }
    } else if (type === 'withdrawal') {
      collection = db.collection<WithdrawalRequest>('withdrawalRequests');
      if (status === 'completed') {
        updateDoc = { ...updateDoc, processedBy: approvedBy, processedAt: approvedAt };
        
        // Get the withdrawal request to deduct from user balance
        const withdrawalRequest = await collection.findOne({ _id: objectId });
        if (withdrawalRequest) {
          // Deduct from user balance
          await updateUserBalance(withdrawalRequest.userId, withdrawalRequest.amount, 'subtract');
          
          // Notify user of completion
          await notifyUserOfTransactionApproval(withdrawalRequest.userId, 'withdrawal', withdrawalRequest.amount);
        }
      } else if (status === 'rejected') {
        updateDoc = { ...updateDoc, rejectionReason };
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid transaction type for PUT' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ success: false, error: 'Failed to update transaction' }, { status: 500 });
  }
}

// Helper function to update user balance
async function updateUserBalance(userId: string, amount: number, operation: 'add' | 'subtract') {
  try {
    const db = await getDb();
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne({ firebaseId: userId });
    if (!user) {
      console.error('User not found for balance update:', userId);
      return;
    }

    const currentBalance = user.balances?.main || 0;
    const newBalance = operation === 'add' 
      ? currentBalance + amount 
      : Math.max(0, currentBalance - amount);

    await usersCollection.updateOne(
      { firebaseId: userId },
      { 
        $set: { 
          'balances.main': newBalance,
          'balances.total': (user.balances?.investment || 0) + (user.balances?.referral || 0) + newBalance,
          updatedAt: new Date()
        } 
      }
    );

    console.log(`Updated balance for user ${userId}: ${operation} ${amount}, new balance: ${newBalance}`);
  } catch (error) {
    console.error('Error updating user balance:', error);
  }
}

// Helper function to notify admins of new transactions
async function notifyAdminsOfTransaction(transactionType: string, userId: string, amount: number) {
  try {
    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    
    // Get all admin users
    const usersCollection = db.collection('users');
    const admins = await usersCollection.find({ isAdmin: true }).toArray();
    
    if (admins.length > 0) {
      const notification = {
        title: `New ${transactionType} Request`,
        message: `A user has submitted a ${transactionType} request for $${amount}`,
        details: `Transaction Type: ${transactionType}\nAmount: $${amount}\nUser ID: ${userId}`,
        type: 'broadcast',
        recipients: 'all', // Send to all admins
        sentBy: 'system',
        sentAt: new Date(),
        read: false
      };
      
      await notificationsCollection.insertOne(notification);
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
  }
}

// Helper function to notify user of transaction approval
async function notifyUserOfTransactionApproval(userId: string, transactionType: string, amount: number) {
  try {
    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    
    // Get user's referral code
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ firebaseId: userId });
    
    if (user && user.userCode) {
      const notification = {
        title: `${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} ${transactionType === 'deposit' ? 'Approved' : 'Completed'}`,
        message: `Your ${transactionType} request for $${amount} has been ${transactionType === 'deposit' ? 'approved' : 'completed'}`,
        details: `Amount: $${amount}\nStatus: ${transactionType === 'deposit' ? 'Approved' : 'Completed'}\nYour balance has been updated accordingly.`,
        type: 'individual',
        recipients: [user.userCode],
        sentBy: 'system',
        sentAt: new Date(),
        read: false
      };
      
      await notificationsCollection.insertOne(notification);
    }
  } catch (error) {
    console.error('Error notifying user:', error);
  }
}