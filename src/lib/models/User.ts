export interface User {
  _id?: string;
  firebaseId: string; // Link to Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  walletAddress?: string;
  investmentPlan?: string;
  totalInvested?: number;
  userCode: string;
  isAdmin?: boolean;
  isActive?: boolean;
  totalDeposited?: number;
  totalWithdrawn?: number;
  accountBalance?: number;
  currentInvestment?: number;
  lastInvestmentDate?: Date;
  referralCount?: number;
  referralEarnings?: number;
  updatedAt: Date;
  updatedBy: string;
}

export interface UserCreateData {
  firebaseId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailVerified: boolean;
  userCode: string;
  createdBy: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  walletAddress?: string;
  investmentPlan?: string;
  totalInvested?: number;
  totalDeposited?: number;
  totalWithdrawn?: number;
  accountBalance?: number;
  isAdmin?: boolean;
  isActive?: boolean;
  lastLoginAt?: Date;
  updatedBy: string;
}







