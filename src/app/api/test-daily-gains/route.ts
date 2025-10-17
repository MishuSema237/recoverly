import { NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications/NotificationService';

export async function GET() {
  try {
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



