import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import { UserService } from '@/lib/auth/user';
import RecoveryCase from '@/lib/models/RecoveryCase';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const user = await UserService.getUserById(payload.userId);
    if (!user || !user.isAdmin) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    await getDb();
    const cases = await RecoveryCase.find({}).sort({ createdAt: -1 }).populate('userId', 'firstName lastName email');

    return NextResponse.json({ success: true, data: cases });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
