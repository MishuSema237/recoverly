import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/auth/jwt';
import { UserService } from '@/lib/auth/user';
import RecoveryCase from '@/lib/models/RecoveryCase';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const user = await UserService.getUserById(payload.userId);
    if (!user || !user.isAdmin) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    await dbConnect();
    const cases = await RecoveryCase.find({}).sort({ createdAt: -1 });

    const db = await getDb();
    const usersCollection = db.collection('users');

    const userIds = [...new Set(cases.map(c => c.userId?.toString()).filter(Boolean))];
    const userDocs = await usersCollection.find({
      _id: { $in: userIds.map(id => new ObjectId(id)) }
    }).toArray();

    const userMap: Record<string, any> = {};
    userDocs.forEach(u => {
      userMap[u._id.toString()] = {
        _id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email
      };
    });

    const casesWithUsers = cases.map(c => {
      const caseObj = c.toObject();
      if (caseObj.userId && userMap[caseObj.userId.toString()]) {
        caseObj.userId = userMap[caseObj.userId.toString()];
      }
      return caseObj;
    });

    return NextResponse.json({ success: true, data: casesWithUsers });
  } catch (error: any) {
    console.error('Error in GET /api/admin/recovery:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
