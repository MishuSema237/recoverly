import { User } from '@/lib/models/User';

/**
 * Check if a user has admin privileges
 * @param userProfile - The user profile object
 * @returns boolean - true if user is admin, false otherwise
 */
export const isAdmin = (userProfile: User | null): boolean => {
  return userProfile?.isAdmin === true;
};

/**
 * Check if a user account is active
 * @param userProfile - The user profile object
 * @returns boolean - true if user is active, false otherwise
 */
export const isActiveUser = (userProfile: User | null): boolean => {
  return userProfile?.isActive !== false; // Default to true if not set
};

/**
 * Check if a user can access admin features
 * @param userProfile - The user profile object
 * @returns boolean - true if user can access admin features
 */
export const canAccessAdmin = (userProfile: User | null): boolean => {
  return isAdmin(userProfile) && isActiveUser(userProfile);
};

/**
 * Get user role display name
 * @param userProfile - The user profile object
 * @returns string - User role display name
 */
export const getUserRole = (userProfile: User | null): string => {
  if (!userProfile) return 'Guest';
  if (isAdmin(userProfile)) return 'Admin';
  return 'Investor';
};

/**
 * Check if user needs email verification
 * @param userProfile - The user profile object
 * @returns boolean - true if email verification is needed
 */
export const needsEmailVerification = (userProfile: User | null): boolean => {
  return userProfile?.emailVerified === false;
};

/**
 * Check if user can make investments
 * @param userProfile - The user profile object
 * @returns boolean - true if user can invest
 */
export const canInvest = (userProfile: User | null): boolean => {
  return isActiveUser(userProfile) && !needsEmailVerification(userProfile);
};





