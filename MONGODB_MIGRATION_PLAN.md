# MongoDB Migration Plan

## Cost Comparison

### Firebase (Current)
- **Reads**: $0.36 per 1M reads after free tier (50k/day)
- **Writes**: $1.08 per 1M writes after free tier (20k/day)
- **Storage**: $0.18/GB/month
- **Bandwidth**: $0.12/GB
- **Image Storage**: Requires Cloud Storage (~$0.026/GB)

### MongoDB Atlas (Recommended)
- **Free Tier**: 512MB storage, shared clusters
- **Standard**: $57/month for 10GB + extra storage at $0.10/GB
- **Image Storage**: Built-in (no extra cost)
- **Connection**: Up to 100 connections
- **Perfect for**: Small to medium applications

## Migration Strategy

### Phase 1: Setup MongoDB Atlas

1. **Create MongoDB Atlas account**
   ```bash
   # Free tier registration at mongodb.com/cloud
   # Choose AWS/Azure/GCP region closest to users
   ```

2. **Install MongoDB driver**
   ```bash
   npm install mongodb
   # or
   npm install mongoose
   ```

3. **Create database connection**
   ```javascript
   // lib/mongodb.js
   import { MongoClient } from 'mongodb';

   const uri = process.env.MONGODB_URI;
   const client = new MongoClient(uri);

   export async function getDb() {
     await client.connect();
     return client.db('tesla-capital');
   }
   ```

### Phase 2: Database Schema Design

#### Collections Structure

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  displayName: String,
  emailVerified: Boolean,
  createdAt: Date,
  lastLoginAt: Date,
  walletAddress: String,
  investmentPlan: String,
  totalInvested: Number,
  userCode: String,
  isAdmin: Boolean,
  isActive: Boolean,
  // Audit fields
  createdBy: String,
  updatedBy: String,
  updatedAt: Date
}
```

**Investment Plans Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  minAmount: Number,
  maxAmount: Number,
  duration: String,
  roi: Number,
  capitalBack: Boolean,
  color: String,
  gradient: String,
  icon: String,
  isActive: Boolean,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String
}
```

**Transactions Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  planId: ObjectId,
  amount: Number,
  type: String, // 'investment', 'deposit', 'withdrawal', 'transfer'
  status: String, // 'pending', 'completed', 'failed'
  description: String,
  referenceNumber: String,
  paymentMethod: String,
  createdAt: Date,
  processedAt: Date,
  processedBy: String
}
```

**Payment Methods Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  currency: String,
  address: String,
  qrCode: String,
  trustWalletLink: String,
  isActive: Boolean,
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String
}
```

### Phase 3: Migration Script

```javascript
// scripts/migrate-to-mongodb.js
import { getDb } from '../lib/mongodb.js';
import { getFirestore } from 'firebase/firestore';
import { db } from '../config/firebase.js';

async function migrateUsers() {
  const firestore = getFirestore();
  const mongoDb = await getDb();
  
  // Get users from Firestore
  const usersSnapshot = await getDocs(collection(firestore, 'users'));
  const users = [];
  
  usersSnapshot.forEach(doc => {
    users.push({
      ...doc.data(),
      firebaseId: doc.id, // Keep for reference
      createdAt: doc.data().createdAt?.toDate(),
      lastLoginAt: doc.data().lastLoginAt?.toDate()
    });
  });
  
  // Insert into MongoDB
  await mongoDb.collection('users').insertMany(users);
}

async function migratePlans() {
  // Similar migration for investment plans
}

async function migratePaymentMethods() {
  // Similar migration for payment methods
}
```

### Phase 4: Update Application Code

#### Replace Firebase Functions

**Before (Firebase)**
```javascript
import { doc, setDoc, getDoc } from 'firebase/firestore';

await setDoc(doc(db, 'users', userId), userData);
const userDoc = await getDoc(doc(db, 'users', userId));
```

**After (MongoDB)**
```javascript
import { getDb } from '../lib/mongodb.js';

const db = await getDb();
await db.collection('users').insertOne(userData);
const user = await db.collection('users').findOne({ _id: userId });
```

### Phase 5: Authentication Migration

**Options:**
1. **Keep Firebase Auth**: Just migrate data storage
2. **Custom Auth**: Implement JWT-based authentication
3. **Auth0/Firebase**: Third-party authentication services

**Recommended**: Keep Firebase Auth + MongoDB data storage
```javascript
// Hybrid approach: Firebase Auth + MongoDB data
import { auth } from '../config/firebase.js';
import { getDb } from '../lib/mongodb.js';

const getUserFromMongoDB = async (firebaseUid) => {
  const db = await getDb();
  return db.collection('users').findOne({ firebaseId: firebaseUid });
};
```

## Implementation Timeline

### Week 1: Setup & Testing
- Set up MongoDB Atlas
- Create connection utilities
- Test basic CRUD operations

### Week 2: Migration Scripts
- Write data migration scripts
- Test on staging data
- Backup Firebase data

### Week 3: Code Updates
- Update all database operations
- Implement hybrid auth approach
- Test admin functions

### Week 4: Go Live
- Run migration on production
- Update deployment configuration
- Monitor performance

## Benefits After Migration

1. **Cost Savings**: ~70% reduction in storage costs
2. **Better Querying**: Complex queries possible
3. **No Vendor Lock-in**: Easy to migrate elsewhere
4. **Image Storage**: Built-in, no extra costs
5. **Timestamps**: Automatic on all operations
6. **Audit Trail**: Full track of who changed what

## Estimated Costs (Monthly)

### Current Firebase (1GB data, 1M operations)
- Storage: $0.18
- Reads: $0.36
- Writes: $0.54
- **Total**: ~$1.10/month

### MongoDB Atlas (1GB data, unlimited operations)
- Atlas M0 (Free): $0/month
- Storage: $0.10/GB
- **Total**: ~$0.10/month

**Savings**: 90% cost reduction

## Action Items

1. ✅ Add timestamps to current Firebase operations
2. 📅 Create MongoDB Atlas account (today)
3. 📅 Set up development environment (this week)
4. 📅 Write migration scripts (next week)
5. 📅 Update application code (week 3)
6. 📅 Plan migration date (week 4)

Would you like me to start implementing the MongoDB connection utilities?









