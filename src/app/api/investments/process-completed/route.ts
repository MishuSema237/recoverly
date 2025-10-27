import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST() {
  try {
    const db = await getDb();
    const now = new Date();
    
    // Get all users with investments
    const users = await db.collection('users').find({}).toArray();
    
    let processedCount = 0;
    
    for (const user of users) {
      if (!user.investments || user.investments.length === 0) continue;
      
      for (const investment of user.investments) {
        if (investment.status !== 'active') continue;
        
        // Check if investment end date has passed
        const endDate = new Date(investment.endDate);
        if (endDate <= now) {
          // Get the plan details to check if capital back is enabled
          const plan = await db.collection('investmentPlans').findOne({ name: investment.planName });
          
          if (plan) {
            const capitalBack = plan.capitalBack === true || plan.capitalBack === 'yes';
            const investmentAmount = investment.amount;
            
            if (capitalBack) {
              // Return capital to main balance
              await db.collection('users').updateOne(
                { _id: user._id },
                {
                  $inc: {
                    'balances.main': investmentAmount,
                    'balances.total': investmentAmount
                  },
                  $set: {
                    'balances.investment': (user.balances?.investment || 0) - investmentAmount,
                    'currentInvestment': 0,
                    'investmentPlan': null,
                    updatedAt: now
                  }
                }
              );
              
              // Add transaction for capital return
              await db.collection('users').updateOne(
                { _id: user._id },
                {
                  $push: {
                    transactions: {
                      type: 'capital_return',
                      amount: investmentAmount,
                      planName: investment.planName,
                      date: now,
                      status: 'completed',
                      description: `Capital returned from ${investment.planName} investment`
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any
                }
              );
              
              // Add activity log
              await db.collection('users').updateOne(
                { _id: user._id },
                {
                  $push: {
                    activityLog: {
                      action: `Capital of $${investmentAmount} returned from ${investment.planName}`,
                      timestamp: now.toISOString()
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any
                }
              );
            } else {
              // No capital back - just update investment status
              await db.collection('users').updateOne(
                { _id: user._id },
                {
                  $set: {
                    'balances.investment': (user.balances?.investment || 0) - investmentAmount,
                    'balances.total': (user.balances?.total || 0) - investmentAmount,
                    'currentInvestment': 0,
                    'investmentPlan': null,
                    updatedAt: now
                  }
                }
              );
            }
            
            // Mark investment as completed
            await db.collection('users').updateOne(
              { _id: user._id, 'investments._id': investment._id },
              {
                $set: {
                  'investments.$.status': 'completed',
                  'investments.$.completedAt': now
                }
              } as Record<string, unknown>
            );
            
            processedCount++;
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} completed investments`,
      processedCount
    });
    
  } catch (error) {
    console.error('Error processing completed investments:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process completed investments' },
      { status: 500 }
    );
  }
}

