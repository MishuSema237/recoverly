import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDb();
    const { id } = await params;
    
    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, error: 'Invalid transaction ID' }, { status: 400 });
    }

    // Try finding in deposits
    let transaction = await db.collection('depositRequests').findOne({ _id: new ObjectId(id) });
    
    if (!transaction) {
      // Try finding in withdrawals
      transaction = await db.collection('withdrawalRequests').findOne({ _id: new ObjectId(id) });
    }

    if (!transaction) {
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching single transaction:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
