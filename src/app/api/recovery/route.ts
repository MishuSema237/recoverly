import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import RecoveryCase from '@/lib/models/RecoveryCase';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    await getDb();
    const cases = await RecoveryCase.find({ userId: new ObjectId(payload.userId) }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: cases });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { scamType, amountLost, dateOfIncident, platformName, details } = body;

    if (!scamType || !amountLost || !dateOfIncident || !platformName || !details) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await getDb();
    const newCase = new RecoveryCase({
      userId: new ObjectId(payload.userId),
      scamType,
      amountLost: parseFloat(amountLost),
      dateOfIncident,
      platformName,
      details,
      status: 'pending',
      updates: [{
        status: 'pending',
        message: 'Case initialized and awaiting officer assignment.',
        timestamp: new Date()
      }]
    });

    await newCase.save();

    return NextResponse.json({ success: true, data: newCase });
  } catch (error) {
    console.error('Recovery submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit report' }, { status: 500 });
  }
}
