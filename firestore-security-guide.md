# Firestore Security Rules Guide for Tesla Capital

## 🔐 Security Rules Overview

The provided Firestore rules implement a comprehensive security model for the Tesla Capital investment platform. Here's what each rule does:

## 📋 Rule Categories

### 1. **User Data Protection**
- **`/users/{userId}`** - Users can only access their own user data
- **`/userProfiles/{userId}`** - Users can only access their own profile
- **`/wallets/{walletId}`** - Users can only access their own wallet data

### 2. **Investment Data Security**
- **`/investments/{investmentId}`** - Users can only access their own investments
- **`/transactions/{transactionId}`** - Users can only access their own transactions
- **`/payments/{paymentId}`** - Users can only access their own payment records

### 3. **Public Content**
- **`/investmentPlans/{planId}`** - Read access for all authenticated users
- **`/blogPosts/{postId}`** - Public read access, admin write access
- **`/announcements/{announcementId}`** - Public read access, admin write access

### 4. **Admin-Only Content**
- **`/admin/{document=**}`** - Only users with admin token can access
- **`/systemSettings/{settingId}`** - Only admins can read/write system settings

### 5. **Support & Communication**
- **`/supportTickets/{ticketId}`** - Users can only access their own tickets
- **`/contactMessages/{messageId}`** - Anyone can create, only admins can read

## 🛠️ Implementation Steps

### 1. **Deploy Firestore Rules**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

### 2. **Set Up Admin Users**
To create admin users, you'll need to set custom claims in Firebase Auth:

```javascript
// In your Firebase Admin SDK (server-side only)
const admin = require('firebase-admin');

// Set admin claim for a user
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

### 3. **Client-Side Admin Check**
```javascript
// Check if user is admin
const checkAdminStatus = async (user) => {
  const idTokenResult = await user.getIdTokenResult();
  return idTokenResult.claims.admin === true;
};
```

## 🔒 Security Features

### **Data Isolation**
- Each user can only access their own data
- No cross-user data access possible
- Admin users have separate access controls

### **Input Validation**
- All writes require authentication
- User ID must match the authenticated user
- Admin operations require admin token

### **Public Content Control**
- Investment plans are readable by all authenticated users
- Blog posts and announcements are publicly readable
- Only admins can modify public content

## 📊 Database Structure

### **User Collections**
```
/users/{userId} - Basic user data
/userProfiles/{userId} - Extended profile information
/wallets/{walletId} - Wallet addresses and balances
/userActivityLogs/{logId} - User activity tracking
```

### **Investment Collections**
```
/investments/{investmentId} - User investment records
/transactions/{transactionId} - Transaction history
/payments/{paymentId} - Payment records
/investmentPlans/{planId} - Available investment plans
```

### **Support Collections**
```
/supportTickets/{ticketId} - User support tickets
/contactMessages/{messageId} - Contact form submissions
```

### **Admin Collections**
```
/admin/{document=**}/ - Admin-only data
/systemSettings/{settingId} - System configuration
```

## ⚠️ Important Security Notes

1. **Never store sensitive data** like passwords or private keys in Firestore
2. **Use Firebase Auth** for all authentication
3. **Validate data** on both client and server side
4. **Regularly audit** your security rules
5. **Test rules thoroughly** before deploying to production

## 🧪 Testing Your Rules

### **Test User Access**
```javascript
// Test if user can access their own data
const userDoc = await db.collection('users').doc(userId).get();
// Should work if userId matches authenticated user

// Test if user cannot access other user's data
const otherUserDoc = await db.collection('users').doc('otherUserId').get();
// Should fail with permission denied
```

### **Test Admin Access**
```javascript
// Test admin access to admin collections
const adminDoc = await db.collection('admin').doc('settings').get();
// Should work only if user has admin claim
```

## 🚀 Production Deployment

1. **Deploy rules** to production Firebase project
2. **Set up admin users** with custom claims
3. **Monitor security** using Firebase console
4. **Regular backups** of your Firestore data
5. **Update rules** as your app grows

## 📞 Support

If you need help with these rules or encounter issues:
- Check Firebase Console for rule violations
- Review the Firebase Security Rules documentation
- Test rules in the Firebase Console Rules Playground











