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
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    // Test the connection
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB successfully');

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
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

