import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDb();
    
    // Clear all existing payment methods
    const result = await db.collection('paymentMethods').deleteMany({});
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.deletedCount} payment methods`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing payment methods:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
