import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import i18n from './i18n';

export type AgeGroup = 'toddler' | 'early-child' | 'preteen' | 'teen';

export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';
  email?: string;
  avatar?: string;
  createdAt: number;
  deviceId?: string;
  language?: string;
  dateOfBirth?: number;
  ageGroup?: AgeGroup;
  parentalConsentGiven?: boolean;
  parentalConsentDate?: number;
  linkedParentId?: string;
  biometricEnabled?: boolean;
  lastAuthenticationTime?: number;
}

const USER_STORAGE_KEY = '@user_data';
const DEVICE_SESSIONS_KEY = '@device_sessions';

/**
 * Calculate age from date of birth timestamp
 */
const calculateAge = (dateOfBirth: number): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Determine age group from date of birth
 */
const determineAgeGroup = (dateOfBirth: number): AgeGroup => {
  const age = calculateAge(dateOfBirth);
  if (age <= 5) return 'toddler';
  if (age <= 9) return 'early-child';
  if (age <= 12) return 'preteen';
  return 'teen';
};

/**
 * Verify if user requires parental consent (under 13 in US/COPPA)
 */
const requiresParentalConsent = (dateOfBirth: number): boolean => {
  return calculateAge(dateOfBirth) < 13;
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (!isMounted) {
          return;
        }
        if (stored) {
          const userData = JSON.parse(stored);
          setUser(userData);
          if (userData.language) {
            i18n.changeLanguage(userData.language);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
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

  const identifyUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      // Calculate age group if date of birth is provided
      let ageGroup: AgeGroup | undefined;
      let parentalConsentGiven: boolean | undefined;
      let parentalConsentDate: number | undefined;

      if (userData.dateOfBirth) {
        ageGroup = determineAgeGroup(userData.dateOfBirth);
        
        // For children under 13, verify parental consent is provided
        if (userData.role === 'child' && requiresParentalConsent(userData.dateOfBirth)) {
          if (!userData.parentalConsentGiven) {
            throw new Error('Parental consent required for users under 13');
          }
          parentalConsentGiven = true;
          parentalConsentDate = Date.now();
        }
      }

      // Generate secure random ID
      // NOTE: In production, use expo-crypto's getRandomBytes or uuid library
      const timestamp = Date.now();
      const random = Math.random().toString(36).substr(2, 9);
      const random2 = Math.random().toString(36).substr(2, 9);

      const newUser: User = {
        id: `user_${timestamp}_${random}_${random2}`,
        createdAt: Date.now(),
        lastAuthenticationTime: Date.now(),
        ...userData,
        ageGroup,
        parentalConsentGiven,
        parentalConsentDate,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      console.log('User identified:', {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        ageGroup: newUser.ageGroup,
        requiresConsent: newUser.dateOfBirth ? requiresParentalConsent(newUser.dateOfBirth) : false,
      });

      return newUser;
    } catch (error) {
      console.error('Error identifying user:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!user) {
      throw new Error('No user to update');
    }

    try {
      // Recalculate age group if date of birth is updated
      let ageGroup = user.ageGroup;
      if (updates.dateOfBirth) {
        ageGroup = determineAgeGroup(updates.dateOfBirth);
      }

      const updatedUser = { 
        ...user, 
        ...updates, 
        ageGroup,
        lastAuthenticationTime: Date.now(),
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (updates.language) {
        i18n.changeLanguage(updates.language);
      }

      console.log('User updated:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [user]);

  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }, []);

  /**
   * Enable biometric authentication for the current user
   */
  const enableBiometric = useCallback(async () => {
    if (!user) {
      throw new Error('No user to enable biometric for');
    }
    await updateUser({ biometricEnabled: true });
    console.log('Biometric authentication enabled');
  }, [user, updateUser]);

  /**
   * Disable biometric authentication for the current user
   */
  const disableBiometric = useCallback(async () => {
    if (!user) {
      throw new Error('No user to disable biometric for');
    }
    await updateUser({ biometricEnabled: false });
    console.log('Biometric authentication disabled');
  }, [user, updateUser]);

  /**
   * Update last authentication time
   */
  const refreshAuthenticationTime = useCallback(async () => {
    if (!user) {
      return;
    }
    await updateUser({ lastAuthenticationTime: Date.now() });
  }, [user, updateUser]);

  const isParent = user?.role === 'parent';
  const isChild = user?.role === 'child';
  const userAge = user?.dateOfBirth ? calculateAge(user.dateOfBirth) : null;
  const needsParentalConsent = user?.dateOfBirth ? requiresParentalConsent(user.dateOfBirth) : false;

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isParent,
    isChild,
    userAge,
    needsParentalConsent,
    identifyUser,
    updateUser,
    logoutUser,
    enableBiometric,
    disableBiometric,
    refreshAuthenticationTime,
  }), [user, isLoading, isParent, isChild, userAge, needsParentalConsent, identifyUser, updateUser, logoutUser, enableBiometric, disableBiometric, refreshAuthenticationTime]);
});
