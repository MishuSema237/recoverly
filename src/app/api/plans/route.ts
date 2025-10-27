import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching plans from MongoDB...');
    const db = await getDb();
    console.log('Connected to database, querying plans...');
    
    // Check if filtering by name
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    let plans;
    if (name) {
      // Find plan by name
      plans = await db.collection('investmentPlans').findOne({ name: name });
      console.log(`Found plan: ${name}`, plans);
      
      if (!plans) {
        return NextResponse.json({ 
          success: false, 
          error: 'Plan not found',
          data: null
        }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: plans });
    } else {
      // Get all plans
      plans = await db.collection('investmentPlans').find({}).toArray();
      console.log(`Found ${plans.length} plans`);
      
      return NextResponse.json({ success: true, data: plans });
    }
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch plans',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDb();
    
    const newPlan = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('investmentPlans').insertOne(newPlan);
    
    return NextResponse.json({ success: true, data: { _id: result.insertedId, ...newPlan } });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ success: false, error: 'Failed to create plan' }, { status: 500 });
  }
}
