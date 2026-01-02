import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface AuthUser {
  id: string;
  name: string;
  role: 'parent' | 'child';
  email?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  parentId?: string; // For child accounts, links to parent
  childIds?: string[]; // For parent accounts, links to children
  verificationStatus: 'pending' | 'verified' | 'rejected';
  emailVerified: boolean;
  phoneVerified: boolean;
  parentalConsentGiven: boolean;
  parentalConsentDate?: number;
  createdAt: number;
  lastLoginAt?: number;
  deviceId?: string;
  language?: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
}

export interface VerificationCode {
  code: string;
  type: 'email' | 'phone';
  expiresAt: number;
  attempts: number;
}

const AUTH_USER_STORAGE_KEY = '@auth_user_data';
const VERIFICATION_CODE_STORAGE_KEY = '@verification_codes';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationCodes, setVerificationCodes] = useState<Map<string, VerificationCode>>(new Map());

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
        if (!isMounted) {
          return;
        }
        if (stored) {
          const userData = JSON.parse(stored) as AuthUser;
          setUser(userData);
        }
      } catch (error) {
        console.error('[AuthContext] Error loading user:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (Platform.OS !== 'web') {
      loadUser();
    } else {
      timer = setTimeout(loadUser, 0);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Age verification for child users
  const calculateAge = useCallback((dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Generate verification code (simulated for demo)
  const generateVerificationCode = useCallback(async (identifier: string, type: 'email' | 'phone'): Promise<string> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationData: VerificationCode = {
      code,
      type,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
    };

    const newCodes = new Map(verificationCodes);
    newCodes.set(identifier, verificationData);
    setVerificationCodes(newCodes);

    console.log(`[AuthContext] Verification code generated for ${identifier}: ${code}`);
    // In production, this would send an email/SMS
    return code;
  }, [verificationCodes]);

  // Verify code
  const verifyCode = useCallback(async (identifier: string, code: string): Promise<boolean> => {
    const verificationData = verificationCodes.get(identifier);
    
    if (!verificationData) {
      console.log('[AuthContext] No verification code found');
      return false;
    }

    if (Date.now() > verificationData.expiresAt) {
      console.log('[AuthContext] Verification code expired');
      return false;
    }

    if (verificationData.attempts >= 3) {
      console.log('[AuthContext] Too many verification attempts');
      return false;
    }

    if (verificationData.code === code) {
      const newCodes = new Map(verificationCodes);
      newCodes.delete(identifier);
      setVerificationCodes(newCodes);
      return true;
    }

    verificationData.attempts++;
    return false;
  }, [verificationCodes]);

  // Register new user with proper validation
  const registerUser = useCallback(async (userData: {
    name: string;
    role: 'parent' | 'child';
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    parentId?: string;
  }): Promise<AuthUser> => {
    try {
      // Validate required fields
      if (!userData.name || !userData.role) {
        throw new Error('Name and role are required');
      }

      // For child accounts, require age verification
      if (userData.role === 'child') {
        if (!userData.dateOfBirth) {
          throw new Error('Date of birth is required for child accounts');
        }
        const age = calculateAge(userData.dateOfBirth);
        if (age >= 18) {
          throw new Error('Child accounts must be under 18 years old');
        }
        if (!userData.parentId) {
          throw new Error('Child accounts must be linked to a parent');
        }
      }

      // For parent accounts, require contact information
      if (userData.role === 'parent') {
        if (!userData.email && !userData.phoneNumber) {
          throw new Error('Email or phone number is required for parent accounts');
        }
      }

      const newUser: AuthUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name,
        role: userData.role,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        age: userData.dateOfBirth ? calculateAge(userData.dateOfBirth) : undefined,
        dateOfBirth: userData.dateOfBirth,
        parentId: userData.parentId,
        childIds: [],
        verificationStatus: 'pending',
        emailVerified: false,
        phoneVerified: false,
        parentalConsentGiven: userData.role === 'parent', // Parents give consent for themselves
        parentalConsentDate: userData.role === 'parent' ? Date.now() : undefined,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      console.log('[AuthContext] User registered:', {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      });

      return newUser;
    } catch (error) {
      console.error('[AuthContext] Error registering user:', error);
      throw error;
    }
  }, [calculateAge]);

  // Login with verification
  const loginUser = useCallback(async (userId: string): Promise<AuthUser> => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
      if (!stored) {
        throw new Error('User not found');
      }

      const userData = JSON.parse(stored) as AuthUser;
      if (userData.id !== userId) {
        throw new Error('Invalid user ID');
      }

      const updatedUser = {
        ...userData,
        lastLoginAt: Date.now(),
      };

      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[AuthContext] User logged in:', userId);
      return updatedUser;
    } catch (error) {
      console.error('[AuthContext] Error logging in:', error);
      throw error;
    }
  }, []);

  // Update user profile
  const updateUser = useCallback(async (updates: Partial<Omit<AuthUser, 'id' | 'createdAt' | 'role'>>): Promise<AuthUser> => {
    if (!user) {
      throw new Error('No user to update');
    }

    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[AuthContext] User updated:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('[AuthContext] Error updating user:', error);
      throw error;
    }
  }, [user]);

  // Link child to parent
  const linkChildToParent = useCallback(async (childId: string, parentId: string): Promise<void> => {
    if (!user || user.id !== parentId) {
      throw new Error('Only the parent can link a child');
    }

    try {
      const updatedUser = {
        ...user,
        childIds: [...(user.childIds || []), childId],
      };

      await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('[AuthContext] Child linked to parent:', { childId, parentId });
    } catch (error) {
      console.error('[AuthContext] Error linking child:', error);
      throw error;
    }
  }, [user]);

  // Give parental consent
  const giveParentalConsent = useCallback(async (childId: string): Promise<void> => {
    if (!user || user.role !== 'parent') {
      throw new Error('Only parents can give consent');
    }

    // In production, this would record detailed consent information
    console.log('[AuthContext] Parental consent given for child:', childId);
  }, [user]);

  // Logout
  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY);
      setUser(null);
      console.log('[AuthContext] User logged out');
    } catch (error) {
      console.error('[AuthContext] Error logging out:', error);
      throw error;
    }
  }, []);

  // Helper computed properties
  const isAuthenticated = !!user;
  const isParent = user?.role === 'parent';
  const isChild = user?.role === 'child';
  const isVerified = user?.verificationStatus === 'verified';
  const hasParentalConsent = user?.parentalConsentGiven || false;
  const requiresVerification = user && !user.emailVerified && !user.phoneVerified;

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    isParent,
    isChild,
    isVerified,
    hasParentalConsent,
    requiresVerification,
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    linkChildToParent,
    giveParentalConsent,
    generateVerificationCode,
    verifyCode,
    calculateAge,
  }), [
    user,
    isLoading,
    isAuthenticated,
    isParent,
    isChild,
    isVerified,
    hasParentalConsent,
    requiresVerification,
    registerUser,
    loginUser,
    updateUser,
    logoutUser,
    linkChildToParent,
    giveParentalConsent,
    generateVerificationCode,
    verifyCode,
    calculateAge,
  ]);
});
