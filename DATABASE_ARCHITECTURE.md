# Tesla Capital - Database Architecture & User Structure

## 📋 **Overview**
This document outlines the complete database architecture, user structure, and data models for the Tesla Capital investment platform. Update this document whenever changes are made to the application structure.

---

## 🗄️ **Firebase Firestore Collections**

### **1. `users` Collection**
**Primary Key:** `uid` (Firebase Auth UID)

```typescript
interface UserProfile {
  // Core Identity
  uid: string;                    // Firebase Auth UID (Primary Key)
  email: string;                  // User email address
  firstName: string;              // First name
  lastName: string;               // Last name
  displayName: string;            // Full display name
  
  // Account Status
  emailVerified: boolean;         // Email verification status
  isAdmin?: boolean;              // Admin privileges flag
  isActive?: boolean;             // Account status flag (default: true)
  
  // Timestamps
  createdAt: Date;                // Account creation date
  lastLoginAt: Date;              // Last login timestamp
  
  // Financial Data
  totalInvested?: number;         // Total amount invested (default: 0)
  totalDeposit?: number;          // Total deposits made (default: 0)
  totalWithdraw?: number;         // Total withdrawals made (default: 0)
  currentInvestment?: number;     // Current active investment (default: 0)
  referralEarnings?: number;      // Total referral earnings (default: 0)
  
  // Investment & Wallet
  investmentPlan?: string;        // Current investment plan name
  walletAddress?: string;         // Crypto wallet address
  
  // Unique Identifiers
  userCode: string;               // Unique 8-character referral code (required)
  
  // Profile Information
  phone?: string;                 // Phone number
  country?: string;               // Country
  state?: string;                 // State/Province
  city?: string;                  // City
  zip?: string;                   // ZIP/Postal code
  profilePicture?: string;        // Profile image URL
}
```

**User Code Generation:**
- 8-character alphanumeric code (A-Z, 0-9)
- Generated during signup
- Used for referrals: `https://tesla-capital.com/ref/{userCode}`
- Used for money transfers (email + userCode validation)

---

### **2. `investmentPlans` Collection**
**Primary Key:** `id` (Auto-generated)

```typescript
interface InvestmentPlan {
  id: string;                     // Plan ID (auto-generated)
  name: string;                   // Plan name (e.g., "Silver", "Gold", "Platinum")
  minAmount: number;              // Minimum investment amount
  maxAmount: number;              // Maximum investment amount
  duration: string;               // Investment duration (e.g., "30 days", "Daily")
  roi: number;                    // Return on Investment percentage
  capitalBack: boolean;           // Whether capital is returned at maturity
  color: string;                  // UI color theme (e.g., "blue", "gold", "purple")
  isActive: boolean;              // Plan availability status
  description?: string;           // Plan description
  features?: string[];            // Plan features array
}
```

**Default Plans:**
- **Probation**: $100-$999, 1% daily, 30 days, No capital back
- **Silver**: $1,000-$9,999, 1.5% daily, 30 days, Capital back
- **Gold**: $10,000-$49,999, 2% daily, 30 days, Capital back
- **Platinum**: $50,000+, 2.5% daily, 30 days, Capital back

---

### **3. `paymentMethods` Collection**
**Primary Key:** `id` (Auto-generated)

```typescript
interface PaymentMethod {
  id: string;                     // Payment method ID (auto-generated)
  name: string;                   // Method name (e.g., "Ethereum", "Bitcoin", "Trust Wallet")
  currency: string;               // Currency code (ETH, BTC, USD)
  address: string;                // Wallet address for payments
  qrCode?: string;                // QR code image URL
  trustWalletLink?: string;       // Trust Wallet deep link
  isActive: boolean;              // Method availability status
  description?: string;           // Method description
  fees?: number;                  // Transaction fees (percentage)
  minAmount?: number;             // Minimum payment amount
  maxAmount?: number;             // Maximum payment amount
}
```

**Payment Method Example:**
```
Bank payment information
Method: ETH
Address: 0xd624DB06741B512059b6a8Cd0bbc3800A9Ecf083

Payment information
Gateway name: Ethereum
Amount: 1,000.00 USD
Charge: 0.00 USD
Conversion rate: 1 USD = 0.00063000
Total payable amount: 0.63 ETH

Trust Wallet Link: https://link.trustwallet.com/send?address=0xd624DB06741B512059b6a8Cd0bbc3800A9Ecf083&asset=c60
```

---

### **4. `transactions` Collection** (To be implemented)
**Primary Key:** `id` (Auto-generated)

```typescript
interface Transaction {
  id: string;                     // Transaction ID (auto-generated)
  userId: string;                 // User UID
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'earning';
  amount: number;                 // Transaction amount
  currency: string;               // Currency (USD, ETH, BTC)
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: string;                // Payment method used
  description: string;            // Transaction description
  createdAt: Date;                // Transaction timestamp
  updatedAt: Date;                // Last update timestamp
  
  // For transfers
  senderId?: string;              // Sender user ID
  receiverId?: string;            // Receiver user ID
  receiverEmail?: string;         // Receiver email
  receiverUserCode?: string;      // Receiver user code
  fee?: number;                   // Transaction fee
  
  // For investments
  planId?: string;                // Investment plan ID
  planName?: string;              // Investment plan name
  
  // For earnings
  source?: string;                // Earnings source
  period?: string;                // Earnings period
  
  // For deposits/withdrawals
  walletAddress?: string;         // Wallet address used
  transactionHash?: string;       // Blockchain transaction hash
  confirmationCount?: number;     // Blockchain confirmations
}
```

---

### **5. `referrals` Collection** (To be implemented)
**Primary Key:** `id` (Auto-generated)

```typescript
interface Referral {
  id: string;                     // Referral ID (auto-generated)
  referrerId: string;             // User who made the referral
  referrerUserCode: string;       // Referrer's user code
  referredId: string;             // User who was referred
  referredEmail: string;          // Referred user's email
  commissionRate: number;         // Commission percentage
  commissionAmount: number;       // Commission earned
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;                // Referral date
  paidAt?: Date;                  // Commission payment date
  investmentAmount?: number;      // Amount invested by referred user
  planName?: string;              // Plan chosen by referred user
}
```

---

## 🔐 **Security & Access Control**

### **Admin System**
- **Admin Users**: `isAdmin: true` in user document
- **Admin Access**: Full system access, user management, plan management
- **Regular Users**: `isAdmin: false` or undefined
- **Suspended Users**: `isActive: false`

### **User Code System**
- **Generation**: 8-character alphanumeric (A-Z, 0-9)
- **Uniqueness**: Checked against existing users
- **Usage**: 
  - Referral links: `https://tesla-capital.com/ref/{userCode}`
  - Money transfers: Email + userCode validation
  - User identification

### **Email Verification**
- **Required**: For investment activities
- **Status**: `emailVerified` boolean in user document
- **Enforcement**: Block investments if not verified

---

## 🔄 **Data Flow Architecture**

### **Authentication Flow**
```
Firebase Auth → onAuthStateChanged → Firestore users collection → User Profile
```

### **User Registration**
```
Signup Form → Firebase Auth → Create user document → Generate userCode → Send verification email
```

### **Investment Process**
```
Select Plan → Validate amount → Check balance → Update user.totalInvested → Create transaction → Update plan
```

### **Payment Process**
```
Choose Method → Get payment details → Generate QR/link → User pays → Update transaction status → Update user balance
```

### **Admin Operations**
```
Admin login → Load all collections → CRUD operations → Update Firestore → Refresh UI
```

---

## 📊 **Dashboard Sections & Components**

### **User Dashboard**
- **Dashboard**: Account overview, stats, quick actions
- **Investment**: Plan selection, investment calculator
- **Deposit**: Add funds via payment methods
- **Withdraw**: Request withdrawals
- **Transfer Money**: Send money to other users
- **Transaction Logs**: View all financial activities
- **Referral Log**: Track referrals and earnings
- **Profile**: Manage personal information
- **Notifications**: Account updates and alerts
- **Settings**: Security and preferences
- **Support**: Contact support team

### **Admin Dashboard**
- **Users**: Manage all users, toggle admin status, suspend accounts
- **Investment Plans**: Create, edit, delete plans
- **Payment Methods**: Configure payment gateways
- **Transactions**: View and manage all transactions

---

## 🛠️ **Implementation Status**

### **✅ Implemented**
- [x] `users` collection with full user profile
- [x] `investmentPlans` collection structure
- [x] `paymentMethods` collection structure
- [x] Admin panel with user management
- [x] User code generation and validation
- [x] Email verification system
- [x] Investment plan selection and validation
- [x] Money transfer with user code validation
- [x] Profile management with editing
- [x] Settings with password change and 2FA
- [x] Support system with contact form
- [x] Unified transaction logs
- [x] Referral system with unique codes

### **🚧 To be implemented**
- [ ] `transactions` collection for all financial activities
- [ ] `referrals` collection for referral tracking
- [ ] Real-time transaction logging
- [ ] Payment gateway integration
- [ ] Automated earnings calculation
- [ ] Email notifications system
- [ ] SMS notifications
- [ ] Advanced admin analytics
- [ ] Export functionality for data
- [ ] Backup and recovery system

---

## 📝 **Change Log**

### **Version 1.0.0** (Current)
- Initial database structure
- User authentication and profiles
- Investment plans system
- Payment methods configuration
- Admin panel implementation
- Basic transaction logging
- Referral system with unique codes

### **Future Updates**
- Add new fields to existing collections
- Implement missing collections
- Add new features and functionality
- Update security rules
- Performance optimizations

---

## 🔧 **Maintenance Guidelines**

### **When Making Changes**
1. **Update this document** with any schema changes
2. **Update TypeScript interfaces** in the codebase
3. **Update Firestore security rules** if needed
4. **Test all affected functionality**
5. **Update admin panel** if new fields are added
6. **Document breaking changes** in the change log

### **Database Migration**
- Use Firestore batch operations for bulk updates
- Implement versioning for schema changes
- Test migrations in development first
- Backup data before major changes

### **Security Considerations**
- Always validate user input
- Use Firestore security rules
- Implement rate limiting for sensitive operations
- Log all admin actions
- Regular security audits

---

**Last Updated:** [Current Date]
**Version:** 1.0.0
**Maintainer:** Development Team







