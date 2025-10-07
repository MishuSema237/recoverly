// MongoDB seeding script
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://mishusema237_db_user:Mish%40el100%24@cluster0.wfmdwl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'tesla-capital';

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Clear existing data
    await db.collection('investmentPlans').deleteMany({});
    await db.collection('paymentMethods').deleteMany({});
    
    const defaultPlans = [
      {
        name: 'Probation',
        minAmount: 200,
        maxAmount: 999,
        duration: '10 Days',
        roi: 1.5,
        capitalBack: false,
        color: 'blue',
        icon: 'zap',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      {
        name: 'Silver',
        minAmount: 1000,
        maxAmount: 4999,
        duration: '20 Days',
        roi: 2.5,
        capitalBack: true,
        color: 'green',
        icon: 'star',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      {
        name: 'Gold',
        minAmount: 5000,
        maxAmount: 9999,
        duration: '30 Days',
        roi: 4.5,
        capitalBack: true,
        color: 'gold',
        icon: 'crown',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      {
        name: 'Platinum',
        minAmount: 300000,
        maxAmount: 999999,
        duration: '30 Days',
        roi: 6.66,
        capitalBack: true,
        color: 'purple',
        icon: 'gem',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      }
    ];

    const paymentMethods = [
      {
        name: 'Ethereum',
        currency: 'ETH',
        address: '0xd624DB06741B512059b6a8Cd0bbc3800A9Ecf083',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      {
        name: 'Bitcoin',
        currency: 'BTC',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      },
      {
        name: 'Trust Wallet',
        currency: 'USDT',
        address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        trustWalletLink: 'https://link.trustwallet.com/send?address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&asset=usdt',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        updatedAt: new Date(),
        updatedBy: 'system'
      }
    ];

    // Insert plans
    const plansResult = await db.collection('investmentPlans').insertMany(defaultPlans);
    console.log(`✅ Inserted ${plansResult.insertedCount} investment plans`);
    
    // Insert payment methods
    const paymentsResult = await db.collection('paymentMethods').insertMany(paymentMethods);
    console.log(`✅ Inserted ${paymentsResult.insertedCount} payment methods`);

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
