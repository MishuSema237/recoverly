import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { firebaseId, ...updateData } = data;

    if (!firebaseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Firebase ID is required' 
      }, { status: 400 });
    }

    const result = await db.collection('users').updateOne(
      { firebaseId: firebaseId },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date(),
          updatedBy: 'profile-update'
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found in MongoDB' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully in MongoDB' 
    });

  } catch (error) {
    console.error('Error updating user profile in MongoDB:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}



