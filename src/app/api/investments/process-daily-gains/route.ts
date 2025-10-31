import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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
        
        // Check if investment was created today - if so, first earning comes tomorrow
        const investmentDate = investment.createdAt ? new Date(investment.createdAt) : null;
        const investmentDateOnly = investmentDate ? new Date(investmentDate.getFullYear(), investmentDate.getMonth(), investmentDate.getDate()) : null;
        
        // If investment was created today, skip processing (first earning comes tomorrow)
        if (investmentDateOnly && investmentDateOnly.getTime() === today.getTime()) {
          continue; // Skip first day - first earning comes tomorrow
        }
        
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              $push: {
                transactions: {
                  type: 'daily_gain',
                  amount: dailyGain,
                  planName: investment.planName,
                  date: now,
                  status: 'completed',
                  description: `Daily earnings from ${investment.planName}`
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any,
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
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

