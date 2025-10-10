import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface PaymentMethod {
  name: string;
  logo: string;
  accountDetails: {
    accountName: string;
    accountNumber: string;
    bankName?: string;
    walletAddress?: string;
    network?: string;
  };
  instructions: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const db = await getDb();
    const paymentMethods = await db.collection('paymentMethods').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const data: Omit<PaymentMethod, 'createdAt' | 'updatedAt'> = await request.json();
    
    const paymentMethod: PaymentMethod = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('paymentMethods').insertOne(paymentMethod);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...paymentMethod }
    });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const { _id, ...updateData } = await request.json();
    
    const result = await db.collection('paymentMethods').updateOne(
      { _id: new ObjectId(_id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Payment method not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Payment method ID is required'
      }, { status: 400 });
    }
    
    const result = await db.collection('paymentMethods').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Payment method not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
