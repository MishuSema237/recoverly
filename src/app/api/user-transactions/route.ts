import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const db = await getDb();

    // Fetch all transaction types for the user
    const [deposits, withdrawals, transfers, investments] = await Promise.all([
      // Deposit requests
      db.collection('depositRequests').find({ userId: user.id }).sort({ createdAt: -1 }).toArray(),
      
      // Withdrawal requests  
      db.collection('withdrawalRequests').find({ userId: user.id }).sort({ createdAt: -1 }).toArray(),
      
      // Money transfers (if you have a transfers collection)
      db.collection('moneyTransfers').find({ 
        $or: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ]
      }).sort({ createdAt: -1 }).toArray(),
      
      // Investment transactions (if you have an investments collection)
      db.collection('investments').find({ userId: user.id }).sort({ createdAt: -1 }).toArray()
    ]);

    // Transform deposits
    const depositTransactions = deposits.map(deposit => ({
      id: deposit._id.toString(),
      type: 'deposit',
      date: deposit.createdAt,
      amount: deposit.amount,
      currency: 'USD',
      status: deposit.status === 'approved' ? 'completed' : deposit.status === 'rejected' ? 'failed' : 'pending',
      details: `Deposit via ${deposit.paymentMethodId}`,
      method: deposit.paymentMethodId,
      transactionId: deposit._id.toString()
    }));

    // Transform withdrawals
    const withdrawalTransactions = withdrawals.map(withdrawal => ({
      id: withdrawal._id.toString(),
      type: 'withdrawal',
      date: withdrawal.createdAt,
      amount: withdrawal.amount,
      currency: 'USD',
      status: withdrawal.status === 'completed' ? 'completed' : withdrawal.status === 'rejected' ? 'failed' : 'pending',
      details: `Withdrawal to ${withdrawal.accountDetails?.accountName || 'Account'}`,
      method: withdrawal.accountDetails?.bankName || 'Bank Transfer',
      transactionId: withdrawal._id.toString()
    }));

    // Transform transfers
    const transferTransactions = transfers.map(transfer => ({
      id: transfer._id.toString(),
      type: 'transfer',
      date: transfer.createdAt,
      amount: transfer.amount,
      currency: 'USD',
      status: transfer.status === 'completed' ? 'completed' : transfer.status === 'failed' ? 'failed' : 'pending',
      details: transfer.fromUserId === user.id 
        ? `Transfer to user ${transfer.toUserCode || 'Unknown'}`
        : `Transfer from user ${transfer.fromUserCode || 'Unknown'}`,
      sender: transfer.fromUserId === user.id ? 'You' : transfer.fromUserCode,
      receiver: transfer.toUserId === user.id ? 'You' : transfer.toUserCode,
      fee: transfer.fee || 0,
      transactionId: transfer._id.toString()
    }));

    // Transform investments
    const investmentTransactions = investments.map(investment => ({
      id: investment._id.toString(),
      type: 'investment',
      date: investment.createdAt,
      amount: investment.amount,
      currency: 'USD',
      status: investment.status === 'active' ? 'completed' : 'pending',
      details: `Investment in ${investment.planName || 'Investment Plan'}`,
      plan: investment.planName,
      transactionId: investment._id.toString()
    }));

    // Get user's transaction history from user document
    const userDoc = await db.collection('users').findOne({ _id: new ObjectId(user.id) });
    const userTransactions = userDoc?.transactions || [];

    // Transform user transactions (daily gains, referral bonuses, etc.)
    const userTransactionLogs = userTransactions.map((transaction: Record<string, unknown>, index: number) => ({
      id: `${user.id}_${index}`,
      type: transaction.type === 'daily_gain' ? 'earning' : 
            transaction.type === 'referral_bonus' ? 'earning' :
            transaction.type === 'investment' ? 'investment' : 'other',
      date: transaction.date || new Date(),
      amount: transaction.amount,
      currency: 'USD',
      status: 'completed',
      details: transaction.type === 'daily_gain' ? 
        `Daily earnings from ${transaction.planName || 'Investment Plan'}` :
        transaction.type === 'referral_bonus' ?
        `Referral bonus from user ${transaction.referredUserCode || 'Unknown'}` :
        transaction.description || 'Transaction',
      plan: transaction.planName,
      transactionId: `${user.id}_${index}`
    }));

    // Combine all transactions
    const allTransactions = [
      ...depositTransactions,
      ...withdrawalTransactions,
      ...transferTransactions,
      ...investmentTransactions,
      ...userTransactionLogs
    ];

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: allTransactions
    });

  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions'
    }, { status: 500 });
  }
}


