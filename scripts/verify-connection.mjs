// Verify MongoDB connection string
import { MongoClient } from 'mongodb';

// Test different connection string formats
const connectionStrings = [
  // Original format
  "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/tesla-capital?retryWrites=true&w=majority&appName=Cluster0&ssl=true&authSource=admin",
  
  // Alternative format 1
  "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  
  // Alternative format 2
  "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/tesla-capital?retryWrites=true&w=majority",
  
  // Alternative format 3 (without appName)
  "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/tesla-capital?retryWrites=true&w=majority&ssl=true"
];

async function testConnection(uri, index) {
  console.log(`\n🔍 Testing connection string ${index + 1}:`);
  console.log(`URI: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    console.log('⏳ Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('tesla-capital');
    
    // Test ping
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Ping successful!');
    
    // Count plans
    const planCount = await db.collection('investmentPlans').countDocuments();
    console.log(`✅ Found ${planCount} investment plans`);
    
    if (planCount > 0) {
      const samplePlan = await db.collection('investmentPlans').findOne({});
      console.log(`✅ Sample plan: ${samplePlan.name} (${samplePlan.roi}% ROI)`);
    }
    
    await client.close();
    console.log('✅ Connection closed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    await client.close();
    return false;
  }
}

async function verifyAllConnections() {
  console.log('🚀 Testing MongoDB connection strings...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i);
    if (success) {
      console.log(`\n🎉 SUCCESS! Use connection string ${i + 1}`);
      console.log(`Working URI: ${connectionStrings[i]}`);
      break;
    }
  }
}

verifyAllConnections();




