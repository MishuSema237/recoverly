import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (you can add authentication here)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Process daily gains for all users
    await NotificationService.processDailyGains();

    return NextResponse.json({
      success: true,
      message: 'Daily gains processed successfully'
    });
  } catch (error) {
    console.error('Error processing daily gains:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


