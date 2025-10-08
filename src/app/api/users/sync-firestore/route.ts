import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface FirestoreUser {
  firebaseId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  emailVerified?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  totalInvested?: number;
  userCode?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export async function POST() {
  try {
    // Get all users from Firestore
    const usersRef = collection(db, 'users');
    const firestoreSnapshot = await getDocs(usersRef);
    
    const firestoreUsers: FirestoreUser[] = firestoreSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        firebaseId: doc.id,
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        displayName: data.displayName || '',
        emailVerified: data.emailVerified || false,
        totalInvested: data.totalInvested || 0,
        userCode: data.userCode || '',
        isAdmin: data.isAdmin || false,
        isActive: data.isActive !== false,
        // Convert Firestore timestamps to JavaScript Date objects
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        updatedAt: new Date(),
        updatedBy: 'system-sync'
      };
    });

    // Get MongoDB connection
    const mongoDb = await getDb();
    
    // Clear existing users in MongoDB (optional - you might want to keep them)
    // await mongoDb.collection('users').deleteMany({});
    
    // Sync users to MongoDB
    const syncResults = [];
    
    for (const user of firestoreUsers) {
      try {
        // Check if user already exists in MongoDB
        const existingUser = await mongoDb.collection('users').findOne({ 
          firebaseId: user.firebaseId 
        });
        
        if (existingUser) {
          // Update existing user
          const result = await mongoDb.collection('users').updateOne(
            { firebaseId: user.firebaseId },
            { 
              $set: {
                ...user,
                updatedAt: new Date(),
                updatedBy: 'system-sync'
              }
            }
          );
          syncResults.push({ 
            email: user.email, 
            action: 'updated', 
            success: result.modifiedCount > 0 
          });
        } else {
          // Insert new user
          const result = await mongoDb.collection('users').insertOne(user);
          syncResults.push({ 
            email: user.email, 
            action: 'created', 
            success: !!result.insertedId 
          });
        }
      } catch (error) {
        console.error(`Error syncing user ${user.email}:`, error);
        syncResults.push({ 
          email: user.email, 
          action: 'error', 
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${firestoreUsers.length} users from Firestore to MongoDB`,
      results: syncResults,
      totalUsers: firestoreUsers.length
    });
    
  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to sync users from Firestore to MongoDB' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('Starting sync status check...');
    
    // Get MongoDB connection
    console.log('Connecting to MongoDB...');
    const mongoDb = await getDb();
    console.log('MongoDB connected successfully');
    
    // Count users in MongoDB
    console.log('Counting users in MongoDB...');
    const mongoUserCount = await mongoDb.collection('users').countDocuments();
    console.log(`MongoDB user count: ${mongoUserCount}`);
    
    // Count users in Firestore
    console.log('Connecting to Firestore...');
    const usersRef = collection(db, 'users');
    const firestoreSnapshot = await getDocs(usersRef);
    const firestoreUserCount = firestoreSnapshot.size;
    console.log(`Firestore user count: ${firestoreUserCount}`);
    
    const result = {
      success: true,
      data: {
        mongoUserCount,
        firestoreUserCount,
        needsSync: mongoUserCount !== firestoreUserCount
      }
    };
    
    console.log('Sync status check completed:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error checking user sync status:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 });
  }
}
