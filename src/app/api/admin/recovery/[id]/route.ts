import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth/jwt';
import { UserService } from '@/lib/auth/user';
import RecoveryCase from '@/lib/models/RecoveryCase';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const user = await UserService.getUserById(payload.userId);
    if (!user || !user.isAdmin) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { status, adminNotes, updateMessage } = body;

    await getDb();
    const recoveryCase = await RecoveryCase.findById(id);
    if (!recoveryCase) return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });

    if (status) recoveryCase.status = status;
    if (adminNotes !== undefined) recoveryCase.adminNotes = adminNotes;

    if (updateMessage) {
      recoveryCase.updates.push({
        status: status || recoveryCase.status,
        message: updateMessage,
        timestamp: new Date()
      });
    }

    await recoveryCase.save();

    return NextResponse.json({ success: true, data: recoveryCase });
  } catch (error) {
    console.error('Admin Recovery PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const user = await UserService.getUserById(payload.userId);
    if (!user || !user.isAdmin) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    await getDb();
    const result = await RecoveryCase.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Case removed' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
