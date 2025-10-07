// Test MongoDB connection with the exact format from MongoDB Atlas
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://mishusema237_db_user:MishaelSema@cluster0.wfmdwl3.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test tesla-capital database
    const db = client.db("tesla-capital");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Test investmentPlans collection
    const plans = await db.collection('investmentPlans').find({}).toArray();
    console.log(`Found ${plans.length} investment plans`);
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
