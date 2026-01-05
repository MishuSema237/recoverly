import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (Vercel Cron or manual with secret)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const vercelCronAuth = request.headers.get('x-vercel-signature');

    // Allow if: Vercel Cron (has x-vercel-signature) OR manual call with correct CRON_SECRET
    if (cronSecret && !vercelCronAuth && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    // Process daily gains for all users using the consolidated service logic
    await NotificationService.processDailyGains();

    return NextResponse.json({
      success: true,
      message: 'Daily gains processed successfully'
    });

  } catch (error) {
    console.error('Error processing daily gains:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process daily gains' },
      { status: 500 }
    );
  }
}

