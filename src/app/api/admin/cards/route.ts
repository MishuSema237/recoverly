import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { requireAuth } from '@/middleware/auth';
import { NotificationService } from '@/lib/notifications/NotificationService';
import { generateCardNumber, generateCVV, generateExpiryDate } from '@/lib/utils/cardUtils';

// Helper to check for admin access
const requireAdmin = (handler: (req: any) => Promise<NextResponse>) => {
  return requireAuth(async (req) => {
    if (!req.user?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    return handler(req);
  });
};

export const GET = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const cards = await db.collection('virtualCards')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    // Map user info to cards
    const userIds = [...new Set(cards.map(c => new ObjectId(c.userId)))];
    const users = await db.collection('users')
      .find({ _id: { $in: userIds } })
      .project({ firstName: 1, lastName: 1, email: 1, userCode: 1 })
      .toArray();

    const userMap = users.reduce((acc, u) => ({
      ...acc,
      [u._id.toString()]: u
    }), {} as any);

    const enrichedCards = cards.map(card => ({
      ...card,
      user: userMap[card.userId] || null
    }));

    return NextResponse.json({
      success: true,
      data: enrichedCards
    });
  } catch (error) {
    console.error('Error fetching card requests:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch card requests' }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request) => {
  try {
    const db = await getDb();
    const { cardId, action, reason } = await request.json();

    if (!cardId || !action) {
      return NextResponse.json({ success: false, error: 'Card ID and action are required' }, { status: 400 });
    }

    const card = await db.collection('virtualCards').findOne({ _id: new ObjectId(cardId) });
    if (!card) {
      return NextResponse.json({ success: false, error: 'Card request not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const cardNumber = generateCardNumber(card.cardType);
      const cvv = generateCVV(card.cardType);
      const expiry = generateExpiryDate();

      await db.collection('virtualCards').updateOne(
        { _id: new ObjectId(cardId) },
        { 
          $set: { 
            status: 'approved',
            cardNumber, // In a real system, these would be encrypted/PCI DSS compliant
            cvv,
            expiry,
            lastFour: cardNumber.slice(-4),
            approvedAt: new Date(),
            updatedAt: new Date()
          } 
        }
      );

      // Notify user
      await NotificationService.createNotification({
        title: 'Virtual Card Approved',
        message: `Your ${card.cardLevel} ${card.cardType} virtual card has been approved and is now ready for use.`,
        type: 'individual',
        recipients: [card.userId],
        sentBy: 'system'
      });

    } else if (action === 'decline') {
      await db.collection('virtualCards').updateOne(
        { _id: new ObjectId(cardId) },
        { 
          $set: { 
            status: 'rejected',
            rejectionReason: reason || 'Information provided was insufficient.',
            updatedAt: new Date()
          } 
        }
      );

      // Notify user
      await NotificationService.createNotification({
        title: 'Virtual Card Declined',
        message: `Unfortunately, your application for a ${card.cardLevel} virtual card was declined. Reason: ${reason || 'Insufficient information'}`,
        type: 'individual',
        recipients: [card.userId],
        sentBy: 'system'
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating card request:', error);
    return NextResponse.json({ success: false, error: 'Failed to update card request' }, { status: 500 });
  }
});
