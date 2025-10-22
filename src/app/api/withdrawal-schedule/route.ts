import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const scheduleCollection = db.collection('withdrawalSchedule');
    
    const schedule = await scheduleCollection.findOne({ type: 'withdrawal_schedule' });
    
    return NextResponse.json({
      success: true,
      data: schedule || {
        enabled: false,
        allowedDays: [],
        allowedTimes: {
          start: '09:00',
          end: '17:00'
        },
        timezone: 'UTC'
      }
    });
  } catch (error) {
    console.error('Get withdrawal schedule error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get withdrawal schedule' },
      { status: 500 }
    );
  }
}
