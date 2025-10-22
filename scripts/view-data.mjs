// View MongoDB data script
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function viewData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('tesla-capital');
    
    // View investment plans
    console.log('\n📊 === INVESTMENT PLANS ===');
    const plans = await db.collection('investmentPlans').find({}).toArray();
    console.log(`Total plans: ${plans.length}`);
    plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name}`);
      console.log(`   ROI: ${plan.roi}% | Duration: ${plan.duration}`);
      console.log(`   Amount: $${plan.minAmount.toLocaleString()} - $${plan.maxAmount.toLocaleString()}`);
      console.log(`   Capital Back: ${plan.capitalBack ? 'Yes' : 'No'}`);
      console.log(`   Color: ${plan.color} | Icon: ${plan.icon}`);
      console.log(`   Active: ${plan.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${plan.createdAt}`);
      console.log('');
    });
    
    // View payment methods
    console.log('\n💳 === PAYMENT METHODS ===');
    const payments = await db.collection('paymentMethods').find({}).toArray();
    console.log(`Total payment methods: ${payments.length}`);
    payments.forEach((payment, index) => {
      console.log(`${index + 1}. ${payment.name} (${payment.currency})`);
      console.log(`   Address: ${payment.address}`);
      if (payment.trustWalletLink) {
        console.log(`   Trust Wallet: ${payment.trustWalletLink}`);
      }
      console.log(`   Active: ${payment.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${payment.createdAt}`);
      console.log('');
    });
    
    // View users (if any)
    console.log('\n👥 === USERS ===');
    const users = await db.collection('users').find({}).toArray();
    console.log(`Total users: ${users.length}`);
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   User Code: ${user.userCode}`);
        console.log(`   Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    } else {
      console.log('No users found in MongoDB (users are stored in Firebase)');
    }
    
    // Show collections
    console.log('\n📁 === COLLECTIONS ===');
    const collections = await db.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

viewData();










