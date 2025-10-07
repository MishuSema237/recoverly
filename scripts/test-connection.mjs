// Simple MongoDB connection test
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('tesla-capital');
    
    // Test ping
    console.log('Testing ping...');
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping successful!');
    
    // List collections
    console.log('Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Count plans
    console.log('Counting investment plans...');
    const planCount = await db.collection('investmentPlans').countDocuments();
    console.log(`✅ Found ${planCount} investment plans`);
    
    if (planCount > 0) {
      const samplePlan = await db.collection('investmentPlans').findOne({});
      console.log('Sample plan:', {
        name: samplePlan.name,
        roi: samplePlan.roi,
        minAmount: samplePlan.minAmount,
        maxAmount: samplePlan.maxAmount
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection();
