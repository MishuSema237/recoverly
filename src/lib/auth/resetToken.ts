import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import crypto from 'crypto';

// Generate a secure reset token
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Store reset token in Firestore with expiration
export const storeResetToken = async (
  email: string, 
  token: string, 
  expirationTime: number
): Promise<void> => {
  try {
    const resetTokenRef = doc(db, 'resetTokens', token);
    const expiresAt = new Date(Date.now() + expirationTime);
    
    await setDoc(resetTokenRef, {
      email,
      token,
      expiresAt,
      createdAt: new Date(),
      used: false
    });
  } catch (error) {
    console.error('Error storing reset token:', error);
    throw new Error('Failed to store reset token');
  }
};

// Verify and get reset token
export const getResetToken = async (token: string): Promise<{
  email: string;
  valid: boolean;
  expired: boolean;
} | null> => {
  try {
    const resetTokenRef = doc(db, 'resetTokens', token);
    const tokenDoc = await getDoc(resetTokenRef);
    
    if (!tokenDoc.exists()) {
      return null;
    }
    
    const tokenData = tokenDoc.data();
    const now = new Date();
    const expiresAt = tokenData.expiresAt.toDate();
    
    return {
      email: tokenData.email,
      valid: !tokenData.used,
      expired: now > expiresAt
    };
  } catch (error) {
    console.error('Error getting reset token:', error);
    return null;
  }
};

// Mark reset token as used
export const markResetTokenAsUsed = async (token: string): Promise<void> => {
  try {
    const resetTokenRef = doc(db, 'resetTokens', token);
    await setDoc(resetTokenRef, { used: true }, { merge: true });
  } catch (error) {
    console.error('Error marking reset token as used:', error);
    throw new Error('Failed to mark reset token as used');
  }
};

// Clean up expired tokens (can be called periodically)
export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    // This would require a more complex query in a real implementation
    // For now, we'll rely on the client-side expiration check
    console.log('Cleanup expired tokens - implement with Firestore query if needed');
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};





