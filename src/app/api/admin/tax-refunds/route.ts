import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/middleware/auth';

export const GET = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    
    const requests = await db.collection('taxRefunds').aggregate([
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          userObjectId: 0,
          "userDetails.password": 0,
          "userDetails.transactions": 0,
          "userDetails.activityLog": 0
        }
      }
    ]).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching admin tax refunds:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tax refund requests' }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    const { id, status, rejectionReason } = await request.json();

    if (!['approved', 'rejected', 'processing'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    await db.collection('taxRefunds').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date(),
          rejectionReason: rejectionReason || null
        } 
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating tax refund status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tax refund status' }, { status: 500 });
  }
});
