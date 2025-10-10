import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { collection, getDocs } from 'firebase/firestore';
import { db as firestoreDb } from '@/config/firebase';

export async function POST() {
  try {
    const mongoDb = await getDb();
    
    // Get all users from Firestore
    const usersRef = collection(firestoreDb, 'users');
    const firestoreSnapshot = await getDocs(usersRef);
    
    const firestoreUsers = firestoreSnapshot.docs.map(doc => ({
      firebaseId: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${firestoreUsers.length} users in Firestore`);
    
    const syncResults = [];
    
    for (const user of firestoreUsers) {
      try {
        // Check if user exists in MongoDB
        const existingUser = await mongoDb.collection('users').findOne({ 
          firebaseId: user.firebaseId 
        });
        
        if (existingUser) {
          // Update existing user
          await mongoDb.collection('users').updateOne(
            { firebaseId: user.firebaseId },
            {
              $set: {
                email: user.email,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                displayName: user.displayName || '',
                emailVerified: user.emailVerified || false,
                userCode: user.userCode || '',
                isAdmin: user.isAdmin || false,
                isActive: user.isActive !== false,
                totalInvested: user.totalInvested || 0,
                currentInvestment: user.currentInvestment || 0,
                totalDeposit: user.totalDeposit || 0,
                totalWithdraw: user.totalWithdraw || 0,
                referralEarnings: user.referralEarnings || 0,
                balances: user.balances || {
                  main: 0,
                  investment: 0,
                  referral: 0,
                  total: 0
                },
                updatedAt: new Date(),
                updatedBy: 'system-sync'
              }
            }
          );
          syncResults.push({ 
            email: user.email, 
            action: 'updated', 
            success: true 
          });
        } else {
          // Create new user
          await mongoDb.collection('users').insertOne({
            firebaseId: user.firebaseId,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            displayName: user.displayName || '',
            emailVerified: user.emailVerified || false,
            userCode: user.userCode || '',
            isAdmin: user.isAdmin || false,
            isActive: user.isActive !== false,
            totalInvested: user.totalInvested || 0,
            currentInvestment: user.currentInvestment || 0,
            totalDeposit: user.totalDeposit || 0,
            totalWithdraw: user.totalWithdraw || 0,
            referralEarnings: user.referralEarnings || 0,
            balances: user.balances || {
              main: 0,
              investment: 0,
              referral: 0,
              total: 0
            },
            createdAt: user.createdAt || new Date(),
            lastLoginAt: user.lastLoginAt || new Date(),
            updatedAt: new Date(),
            updatedBy: 'system-sync'
          });
          syncResults.push({ 
            email: user.email, 
            action: 'created', 
            success: true 
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
      message: `Synced ${firestoreUsers.length} users`,
      results: syncResults
    });
    
  } catch (error) {
    console.error('Error syncing users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
