import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface DepositRequest {
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

// Deposit Requests API
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'deposits';
    
    if (type === 'deposits') {
      const deposits = await db.collection('depositRequests').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ success: true, data: deposits });
    } else if (type === 'withdrawals') {
      const withdrawals = await db.collection('withdrawalRequests').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ success: true, data: withdrawals });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const { type, ...data } = await request.json();
    
    if (type === 'deposit') {
      const depositRequest: DepositRequest = {
        ...data,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('depositRequests').insertOne(depositRequest);
      
      // Update user balance if approved
      if (data.status === 'approved') {
        await db.collection('users').updateOne(
          { _id: new ObjectId(data.userId) },
          { 
            $inc: { 
              'balances.main': data.amount,
              'balances.total': data.amount
            },
            $set: { updatedAt: new Date() }
          }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: { _id: result.insertedId, ...depositRequest }
      });
    } else if (type === 'withdrawal') {
      const withdrawalRequest: WithdrawalRequest = {
        ...data,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('withdrawalRequests').insertOne(withdrawalRequest);
      
      return NextResponse.json({
        success: true,
        data: { _id: result.insertedId, ...withdrawalRequest }
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { _id, type, ...updateData } = await request.json();
    
    const collection = type === 'deposit' ? 'depositRequests' : 'withdrawalRequests';
    
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Request not found'
      }, { status: 404 });
    }
    
    // If approving a deposit, update user balance
    if (type === 'deposit' && updateData.status === 'approved') {
      const deposit = await db.collection('depositRequests').findOne({ _id: new ObjectId(_id) });
      if (deposit) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(deposit.userId) },
          { 
            $inc: { 
              'balances.main': deposit.amount,
              'balances.total': deposit.amount
            },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }
    
    // If completing a withdrawal, deduct from user balance
    if (type === 'withdrawal' && updateData.status === 'completed') {
      const withdrawal = await db.collection('withdrawalRequests').findOne({ _id: new ObjectId(_id) });
      if (withdrawal) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(withdrawal.userId) },
          { 
            $inc: { 
              'balances.main': -withdrawal.amount,
              'balances.total': -withdrawal.amount
            },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Request updated successfully'
    });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
