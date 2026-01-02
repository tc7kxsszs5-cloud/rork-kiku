import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import i18n from './i18n';

// Helper function to determine age group from age
export const getAgeGroup = (age: number): AgeGroup => {
  if (age >= 3 && age <= 6) return 'early-childhood';
  if (age >= 7 && age <= 9) return 'middle-childhood';
  if (age >= 10 && age <= 12) return 'pre-teen';
  return 'teen';
};

export type AgeGroup = 'early-childhood' | 'middle-childhood' | 'pre-teen' | 'teen';

export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';
  email?: string;
  avatar?: string;
  createdAt: number;
  deviceId?: string;
  language?: string;
  age?: number;
  ageGroup?: AgeGroup;
  pin?: string;
  biometricEnabled?: boolean;
  lastLoginAt?: number;
}

const USER_STORAGE_KEY = '@user_data';

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
      // Calculate age group if age is provided
      const ageGroup = userData.age ? getAgeGroup(userData.age) : undefined;
      
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        ...userData,
        ageGroup,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      console.log('User identified:', {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
        ageGroup: newUser.ageGroup,
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
      // Recalculate age group if age is updated
      const ageGroup = updates.age !== undefined ? getAgeGroup(updates.age) : user.ageGroup;
      
      const updatedUser = { 
        ...user, 
        ...updates,
        ageGroup,
        lastLoginAt: Date.now(),
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

  // Authentication methods for enhanced security
  const setPIN = useCallback(async (pin: string) => {
    if (!user) throw new Error('No user to set PIN for');
    
    try {
      const hashedPin = pin; // In production, hash this with bcrypt or similar
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(`pin_${user.id}`, hashedPin);
      }
      
      await updateUser({ pin: hashedPin });
      console.log('PIN set for user:', user.id);
    } catch (error) {
      console.error('Error setting PIN:', error);
      throw error;
    }
  }, [user, updateUser]);

  const verifyPIN = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      let storedPin = user.pin;
      
      if (Platform.OS !== 'web') {
        const securePin = await SecureStore.getItemAsync(`pin_${user.id}`);
        if (securePin) storedPin = securePin;
      }
      
      return storedPin === pin; // In production, use secure comparison
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  }, [user]);

  const enableBiometric = useCallback(async () => {
    if (!user) throw new Error('No user to enable biometric for');
    
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!compatible || !enrolled) {
        throw new Error('Biometric authentication not available');
      }
      
      await updateUser({ biometricEnabled: true });
      console.log('Biometric enabled for user:', user.id);
    } catch (error) {
      console.error('Error enabling biometric:', error);
      throw error;
    }
  }, [user, updateUser]);

  const authenticateWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!user?.biometricEnabled) return false;
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use PIN instead',
        disableDeviceFallback: false,
      });
      
      return result.success;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  }, [user]);

  const isParent = user?.role === 'parent';
  const isChild = user?.role === 'child';

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    isParent,
    isChild,
    identifyUser,
    updateUser,
    logoutUser,
    setPIN,
    verifyPIN,
    enableBiometric,
    authenticateWithBiometric,
  }), [user, isLoading, isParent, isChild, identifyUser, updateUser, logoutUser, setPIN, verifyPIN, enableBiometric, authenticateWithBiometric]);
});
