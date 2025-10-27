import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';

export const GET = requireAuth(async (request) => {
  try {
    const userId = request.user!.id;
    const db = await getDb();

    // Fetch all transaction types for the user
    const [deposits, withdrawals, transfers, investments] = await Promise.all([
      // Deposit requests
      db.collection('depositRequests').find({ userId }).sort({ createdAt: -1 }).toArray(),
      
      // Withdrawal requests  
      db.collection('withdrawalRequests').find({ userId }).sort({ createdAt: -1 }).toArray(),
      
      // Money transfers
      db.collection('transfers').find({ 
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }).sort({ createdAt: -1 }).toArray(),
      
      // Investment transactions (if you have an investments collection)
      db.collection('investments').find({ userId }).sort({ createdAt: -1 }).toArray()
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
      details: transfer.senderId === userId 
        ? `Transfer to ${transfer.receiverEmail}`
        : `Transfer from ${transfer.senderEmail}`,
      sender: transfer.senderEmail,
      receiver: transfer.receiverEmail,
      fee: transfer.fee || 0,
      transactionId: transfer._id.toString(),
      isSent: transfer.senderId === userId
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
    const userDoc = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const userTransactions = userDoc?.transactions || [];

    // Transform user transactions (daily gains, referral bonuses, transfers, etc.)
    const userTransactionLogs = userTransactions.map((transaction: Record<string, unknown>, index: number) => {
      const isTransfer = transaction.type === 'transfer_sent' || transaction.type === 'transfer_received';
      const isSent = transaction.type === 'transfer_sent';
      
      // Determine transaction type and details
      let txType = 'other';
      let details = transaction.description || 'Transaction';
      
      if (transaction.type === 'daily_gain') {
        txType = 'earning';
        details = `Daily earnings from ${transaction.planName || 'Investment Plan'}`;
      } else if (transaction.type === 'referral_bonus') {
        txType = 'earning';
        details = `Referral bonus from user ${transaction.referredUserCode || 'Unknown'}`;
      } else if (transaction.type === 'investment') {
        txType = 'investment';
        details = `Investment in ${transaction.planName || 'Investment Plan'}`;
      } else if (isTransfer) {
        txType = 'transfer';
        details = transaction.description || 'Transfer';
      }
      
      return {
        id: `${userId}_${index}`,
        type: txType,
        date: transaction.date || new Date(),
        amount: transaction.amount,
        currency: 'USD',
        status: 'completed',
        details: details,
        plan: transaction.planName,
        transactionId: `${userId}_${index}`,
        isSent: isSent,
        metadata: transaction.metadata || {}
      };
    });

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
});


