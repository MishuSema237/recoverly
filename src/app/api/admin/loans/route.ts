import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/middleware/auth';
import { sendEmail, emailTemplates } from '@/lib/email';

export const GET = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    
    // Join with users to get applicant details
    const loans = await db.collection('loans').aggregate([
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
      data: loans
    });
  } catch (error) {
    console.error('Error fetching admin loans:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch loan requests' }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    const { id, status, rejectionReason } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const loan = await db.collection('loans').findOne({ _id: new ObjectId(id) });
    if (!loan) {
      return NextResponse.json({ success: false, error: 'Loan not found' }, { status: 404 });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(loan.userId) });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const updateData: any = { 
      status, 
      updatedAt: new Date(),
      processedAt: new Date(),
      processedBy: request.user!.id
    };
    
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    await db.collection('loans').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // If approved, send email with instructions
    if (status === 'approved') {
      const subject = 'Your Loan Application has been Approved';
      const text = `Hello ${user.firstName}, your application for a ${loan.facility} has been approved. Please log in to your dashboard to view the instructions on how to receive your funds.`;
      
      // We can use a custom template or a simple one for now
      // Recoverly instructions often involve some fee or direct contact
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #c9933a;">Congratulations!</h2>
          <p>Hello <strong>${user.firstName}</strong>,</p>
          <p>We are pleased to inform you that your loan application for <strong>$${loan.amount.toLocaleString()}</strong> (${loan.facility}) has been <strong>APPROVED</strong>.</p>
          <div style="background: #fdf6ec; border: 1px solid #faecc5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #8a6d3b;">Next Steps:</p>
            <ol>
              <li>Log in to your Recoverly Dashboard.</li>
              <li>Navigate to the "Loan Services" section.</li>
              <li>Follow the disbursement instructions provided in your active loan details.</li>
            </ol>
          </div>
          <p>If you have any questions, please contact our financial services department.</p>
          <p>Best regards,<br/>The Recoverly Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        text,
        html
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating loan status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update loan status' }, { status: 500 });
  }
});
