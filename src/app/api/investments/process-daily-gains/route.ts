import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import NotificationService from '@/lib/notifications/NotificationService';

export async function POST() {
  try {
    const db = await getDb();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all users with active investments
    const users = await db.collection('users').find({
      'investments.status': 'active'
    }).toArray();
    
    let processedGains = 0;
    
    for (const user of users) {
      if (!user.investments || user.investments.length === 0) continue;
      
      for (const investment of user.investments) {
        if (investment.status !== 'active' || !investment.plan) continue;
        
        // Check if we already processed today's gain for this investment
        const lastGainDate = investment.lastGainDate ? new Date(investment.lastGainDate) : null;
        const lastGainDateOnly = lastGainDate ? new Date(lastGainDate.getFullYear(), lastGainDate.getMonth(), lastGainDate.getDate()) : null;
        
        if (lastGainDateOnly && lastGainDateOnly.getTime() === today.getTime()) {
          continue; // Already processed today
        }
        
        // Calculate daily gain
        const dailyRate = investment.plan.dailyRate || 0;
        const dailyGain = (investment.amount * dailyRate) / 100;
        
        if (dailyGain > 0) {
          // Add to user's main balance
          await db.collection('users').updateOne(
            { _id: user._id },
            {
              $inc: {
                'balances.main': dailyGain,
                'balances.total': dailyGain
              },
              $push: {
                transactions: {
                  type: 'daily_gain',
                  amount: dailyGain,
                  planName: investment.planName,
                  date: now,
                  status: 'completed',
                  description: `Daily earnings from ${investment.planName}`
                }
              } as Record<string, unknown>,
              $set: {
                updatedAt: now
              }
            }
          );
          
          // Update last gain date for this investment
          await db.collection('users').updateOne(
            { _id: user._id, 'investments._id': investment._id },
            {
              $set: {
                'investments.$.lastGainDate': now
              }
            } as Record<string, unknown>
          );
          
          // Send notification
          await NotificationService.notifyDailyGain(
            user._id?.toString() || '',
            dailyGain,
            investment.planName
          );
          
          processedGains++;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed daily gains for ${processedGains} investments`,
      processedGains
    });
    
  } catch (error) {
    console.error('Error processing daily gains:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process daily gains' },
      { status: 500 }
    );
  }
}

