import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
const dbName = process.env.MONGODB_DB || 'tesla-capital';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Global variable to store the cached connection in development
  let cachedClient = (global as unknown as { _mongoClient?: MongoClient })._mongoClient;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      maxPoolSize: 10,
      retryWrites: true,
    });
    (global as unknown as { _mongoClient: MongoClient })._mongoClient = cachedClient;
  }
  clientPromise = cachedClient.connect();
} else {
  // In production, create a new client
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    maxPoolSize: 10,
    retryWrites: true,
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    // Test the connection (optional, can be slow on some networks)
    // await client.db('admin').command({ ping: 1 });
    // console.log('Connected to MongoDB successfully');
    
    return { client, db };
  } catch (error) {
    console.error('CRITICAL: MongoDB connection error:', error);
    if (error instanceof Error && (error.message.includes('ETIMEDOUT') || error.message.includes('ServerSelectionError'))) {
      console.error('--- DIAGNOSTIC HINT ---');
      console.error('This error often means your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('1. Log in to MongoDB Atlas.');
      console.error('2. Go to "Network Access".');
      console.error('3. Click "Add IP Address" and select "Allow Access From Anywhere" (0.0.0.0/0) or "Add Current IP Address".');
      console.error('-----------------------');
    }
    throw error;
  }
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// Close connection (useful for cleanup)
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
  }
}

