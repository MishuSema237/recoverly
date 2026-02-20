export interface User {
  _id?: string;
  email: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  accountType: string;
  transactionPin?: string;
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
  email: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  accountType: string;
  emailVerified: boolean;
  userCode: string;
  createdBy: string;
}

export interface UserUpdateData {
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  displayName?: string;
  accountType?: string;
  transactionPin?: string;
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











