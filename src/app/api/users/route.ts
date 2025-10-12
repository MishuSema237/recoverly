import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newUser = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newUser } });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}






