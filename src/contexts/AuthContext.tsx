'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

// Generate unique user code
const generateUserCode = async (): Promise<string> => {
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let code = generateCode();
  let isUnique = false;

  while (!isUnique) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      isUnique = true;
    } else {
      code = generateCode();
    }
  }

  return code;
};

interface UserProfile {
  uid: string;
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
  userCode: string; // Unique referral/transfer code
  isAdmin?: boolean;
  isActive?: boolean;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  profilePicture?: string;
  balances?: {
    main: number;
    investment: number;
    referral: number;
    total: number;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<UserCredential>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<UserCredential>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  getRememberedEmail: () => string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            // Generate userCode if missing
            let userCode = profileData.userCode;
            if (!userCode) {
              userCode = await generateUserCode();
              // Update the user document with the new userCode
              await setDoc(doc(db, 'users', user.uid), {
                userCode: userCode
              }, { merge: true });
            }

            // Extract firstName and lastName from displayName if missing
            let firstName = profileData.firstName;
            let lastName = profileData.lastName;
            
            if (!firstName && !lastName && user.displayName) {
              const nameParts = user.displayName.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
              
              // Update Firestore with extracted names
              await setDoc(doc(db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName
              }, { merge: true });
            }

            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              firstName: firstName || '',
              lastName: lastName || '',
              displayName: user.displayName || '',
              emailVerified: user.emailVerified,
              createdAt: profileData.createdAt?.toDate() || new Date(),
              lastLoginAt: profileData.lastLoginAt?.toDate() || new Date(),
              walletAddress: profileData.walletAddress,
              investmentPlan: profileData.investmentPlan,
              totalInvested: profileData.totalInvested || 0,
              userCode: userCode,
              isAdmin: profileData.isAdmin || false,
              isActive: profileData.isActive !== false, // Default to true if not set
              phone: profileData.phone,
              country: profileData.country,
              state: profileData.state,
              city: profileData.city,
              zip: profileData.zip,
              profilePicture: profileData.profilePicture,
            });
          } else {
            // If no profile exists, create a basic one
            setUserProfile({
              uid: user.uid,
              email: user.email || '',
              firstName: '',
              lastName: '',
              displayName: user.displayName || '',
              emailVerified: user.emailVerified,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              totalInvested: 0,
              userCode: '',
              isAdmin: false,
              isActive: true,
              balances: {
                main: 0,
                investment: 0,
                referral: 0,
                total: 0
              }
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set a basic profile if Firestore fails
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            firstName: '',
            lastName: '',
            displayName: user.displayName || '',
            emailVerified: user.emailVerified,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            totalInvested: 0,
            userCode: '',
            isAdmin: false,
            isActive: true,
            balances: {
              main: 0,
              investment: 0,
              referral: 0,
              total: 0
            }
          });
        }
      } else {
        setUserProfile(null);
      }
      
      // Set loading to false immediately after auth state is determined
      setLoading(false);
      if (!initialized) {
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [initialized]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Generate unique user code
      const userCode = await generateUserCode();

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        emailVerified: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        totalInvested: 0,
        userCode,
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: userProfile.createdAt,
        lastLoginAt: userProfile.lastLoginAt,
        userCode: userProfile.userCode,
      });

      // Save to MongoDB via API
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseId: user.uid,
            email: user.email,
            firstName,
            lastName,
            displayName: `${firstName} ${lastName}`,
            emailVerified: false,
            userCode,
            isAdmin: false,
            isActive: true,
            totalInvested: 0,
            currentInvestment: 0,
            totalDeposit: 0,
            totalWithdraw: 0,
            referralEarnings: 0,
            balances: {
              main: 0,
              investment: 0,
              referral: 0,
              total: 0
            }
          }),
        });

        if (!response.ok) {
          console.error('Failed to save user to MongoDB');
        }
      } catch (error) {
        console.error('Error saving user to MongoDB:', error);
      }

      // Send custom email verification
      try {
        const response = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          console.error('Failed to send custom verification email');
          // Fallback to Firebase email verification
          await sendEmailVerification(user);
        }
      } catch (error) {
        console.error('Error sending custom verification email:', error);
        // Fallback to Firebase email verification
        await sendEmailVerification(user);
      }

      // IMPORTANT: Sign out the user immediately after account creation
      // This prevents auto-authentication and keeps navigation unchanged
      // Use setTimeout to ensure Firestore operations complete first
      setTimeout(async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Error signing out after signup:', error);
        }
      }, 100);

      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Handle remember me functionality
      if (rememberMe) {
        // Store user credentials in localStorage for persistent login
        localStorage.setItem('rememberedUser', JSON.stringify({
          email,
          timestamp: Date.now()
        }));
      } else {
        // Clear remembered user if not checked
        localStorage.removeItem('rememberedUser');
      }
      
      // Update last login time (non-blocking)
      if (userCredential.user) {
        // Use setTimeout to make this non-blocking
        setTimeout(async () => {
          try {
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              lastLoginAt: new Date(),
            }, { merge: true });

            // Also update MongoDB
            try {
              await fetch('/api/users/sync-firestore', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            } catch (error) {
              console.error('Failed to sync with MongoDB:', error);
            }
          } catch (error) {
            console.error('Failed to update last login time:', error);
          }
        }, 0);
      }

      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      // Clear any cached data
      localStorage.removeItem('user');
      sessionStorage.clear();
      // User will be redirected by the component that calls logout
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        console.error('Send verification email error:', error);
        throw error;
      }
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Send password reset email error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...data,
          lastUpdated: new Date(),
        }, { merge: true });

        // Update local state
        if (userProfile) {
          setUserProfile({ ...userProfile, ...data });
        }
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  };

  const getRememberedEmail = () => {
    try {
      const rememberedUser = localStorage.getItem('rememberedUser');
      if (rememberedUser) {
        const { email, timestamp } = JSON.parse(rememberedUser);
        // Check if the remembered user is still valid (within 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        if (timestamp > thirtyDaysAgo) {
          return email;
        } else {
          // Remove expired remembered user
          localStorage.removeItem('rememberedUser');
        }
      }
    } catch (error) {
      console.error('Error getting remembered email:', error);
      localStorage.removeItem('rememberedUser');
    }
    return null;
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
    sendVerificationEmail,
    updateUserProfile,
    resetPassword,
    getRememberedEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
