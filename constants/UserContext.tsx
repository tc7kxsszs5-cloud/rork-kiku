import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import i18n from './i18n';

export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';
  email?: string;
  avatar?: string;
  createdAt: number;
  deviceId?: string;
  language?: string;
  // Age verification and child safety fields
  dateOfBirth?: string; // ISO date string for age calculation
  age?: number; // Calculated age in years
  ageVerified?: boolean; // Whether age has been verified
  parentId?: string; // For child accounts, links to parent account
  childIds?: string[]; // For parent accounts, links to child accounts
  // Consent tracking for compliance
  parentalConsentDate?: number; // Timestamp when parental consent was given
  parentalConsentVersion?: string; // Version of terms consented to
  // Additional safety fields
  restricted?: boolean; // Whether account has restrictions applied
  contentFilterLevel?: 'strict' | 'moderate' | 'minimal'; // Age-appropriate content filtering
}

const USER_STORAGE_KEY = '@user_data';
const USERS_REGISTRY_KEY = '@users_registry'; // Store all users for parent-child linking

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Helper function to determine content filter level based on age
function getContentFilterLevel(age: number): 'strict' | 'moderate' | 'minimal' {
  if (age < 13) return 'strict'; // COPPA compliance - strict filtering for under 13
  if (age < 16) return 'moderate'; // Moderate filtering for teens under 16
  return 'minimal'; // Minimal filtering for 16+
}

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
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        ...userData,
      };

      // Save to individual user storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      // Add to users registry for parent-child linking
      const registryData = await AsyncStorage.getItem(USERS_REGISTRY_KEY);
      const registry: Record<string, User> = registryData ? JSON.parse(registryData) : {};
      registry[newUser.id] = newUser;
      await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
      
      setUser(newUser);

      console.log('User identified and added to registry:', {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
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
      const updatedUser = { ...user, ...updates };
      
      // Update individual user storage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Update user in registry to keep it in sync
      const registryData = await AsyncStorage.getItem(USERS_REGISTRY_KEY);
      if (registryData) {
        const registry: Record<string, User> = JSON.parse(registryData);
        registry[user.id] = updatedUser;
        await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
      }
      
      setUser(updatedUser);

      if (updates.language) {
        i18n.changeLanguage(updates.language);
      }

      console.log('User updated and synced with registry:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [user]);

  const logoutUser = useCallback(async () => {
    try {
      const userId = user?.id;
      
      // Remove individual user data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      // Note: We intentionally keep the user in the registry to maintain
      // parent-child relationships. If the user logs back in or if another
      // family member accesses their linked accounts, the relationship data
      // remains intact. To completely remove a user and all relationships,
      // use a separate deleteAccount method.
      
      setUser(null);
      console.log('User logged out', userId ? `(ID: ${userId})` : '');
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }, [user]);

  // New method: Completely delete account and all data
  const deleteAccount = useCallback(async () => {
    if (!user) {
      throw new Error('No user to delete');
    }

    try {
      const userId = user.id;
      
      // Load registry
      const registryData = await AsyncStorage.getItem(USERS_REGISTRY_KEY);
      const registry: Record<string, User> = registryData ? JSON.parse(registryData) : {};
      
      // If this is a parent account, warn about child accounts
      if (user.role === 'parent' && user.childIds && user.childIds.length > 0) {
        console.warn('Deleting parent account with linked children:', user.childIds);
        // Remove parent reference from children
        for (const childId of user.childIds) {
          if (registry[childId]) {
            delete registry[childId].parentId;
          }
        }
      }
      
      // If this is a child account, remove from parent's list
      if (user.role === 'child' && user.parentId && registry[user.parentId]) {
        const parentUser = registry[user.parentId];
        if (parentUser.childIds) {
          parentUser.childIds = parentUser.childIds.filter(id => id !== userId);
          registry[user.parentId] = parentUser;
        }
      }
      
      // Remove user from registry
      delete registry[userId];
      await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
      
      // Remove individual user data
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      
      setUser(null);
      console.log('Account completely deleted:', userId);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }, [user]);

  // New method: Verify age and set content filtering
  const verifyAge = useCallback(async (dateOfBirth: string) => {
    if (!user) {
      throw new Error('No user to verify age for');
    }

    try {
      const age = calculateAge(dateOfBirth);
      const contentFilterLevel = getContentFilterLevel(age);
      
      const updates = {
        dateOfBirth,
        age,
        ageVerified: true,
        contentFilterLevel,
      };

      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('Age verified:', { age, contentFilterLevel });
      return { age, contentFilterLevel };
    } catch (error) {
      console.error('Error verifying age:', error);
      throw error;
    }
  }, [user]);

  // New method: Link child account to parent
  const linkChildToParent = useCallback(async (childId: string, parentId: string) => {
    try {
      // Load current user registry
      const registryData = await AsyncStorage.getItem(USERS_REGISTRY_KEY);
      const registry: Record<string, User> = registryData ? JSON.parse(registryData) : {};

      // Get parent and child users
      const parentUser = registry[parentId];
      const childUser = registry[childId];

      if (!parentUser || parentUser.role !== 'parent') {
        throw new Error(`Parent user with ID ${parentId} not found or has invalid role. Expected 'parent', got '${parentUser?.role || 'undefined'}'`);
      }
      if (!childUser || childUser.role !== 'child') {
        throw new Error(`Child user with ID ${childId} not found or has invalid role. Expected 'child', got '${childUser?.role || 'undefined'}'`);
      }

      // Update child to link to parent
      childUser.parentId = parentId;

      // Update parent to link to child
      if (!parentUser.childIds) {
        parentUser.childIds = [];
      }
      if (!parentUser.childIds.includes(childId)) {
        parentUser.childIds.push(childId);
      }

      // Save updated registry
      registry[parentId] = parentUser;
      registry[childId] = childUser;
      await AsyncStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));

      // If current user is being updated, update the state
      if (user && (user.id === parentId || user.id === childId)) {
        const updatedCurrentUser = registry[user.id];
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
        setUser(updatedCurrentUser);
      }

      console.log('Child linked to parent:', { childId, parentId });
      return { parentUser, childUser };
    } catch (error) {
      console.error('Error linking child to parent:', error);
      throw error;
    }
  }, [user]);

  // New method: Record parental consent for compliance
  const recordParentalConsent = useCallback(async (consentVersion: string) => {
    if (!user) {
      throw new Error('No user to record consent for');
    }

    try {
      const updates = {
        parentalConsentDate: Date.now(),
        parentalConsentVersion: consentVersion,
      };

      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('Parental consent recorded:', { 
        userId: user.id, 
        consentVersion,
        timestamp: updates.parentalConsentDate 
      });
      return updatedUser;
    } catch (error) {
      console.error('Error recording parental consent:', error);
      throw error;
    }
  }, [user]);

  // New method: Check if user requires parental consent (COPPA compliance)
  const requiresParentalConsent = useCallback(() => {
    if (!user) return false;
    
    // Children under 13 require parental consent per COPPA
    if (user.age !== undefined && user.age < 13) {
      return !user.parentalConsentDate;
    }
    
    // Child accounts that are properly linked don't need additional consent check
    // Child accounts without a parent may be in setup phase, so we check consent
    if (user.role === 'child' && !user.parentId) {
      // If account is newly created (less than 24 hours old), allow grace period
      const accountAge = Date.now() - user.createdAt;
      const SETUP_GRACE_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
      
      if (accountAge < SETUP_GRACE_PERIOD) {
        // During grace period, consent is not strictly required
        return false;
      }
      
      // After grace period, unlinked child accounts need consent
      return !user.parentalConsentDate;
    }
    
    return false;
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
    deleteAccount,
    // New methods for enhanced authentication and safety
    verifyAge,
    linkChildToParent,
    recordParentalConsent,
    requiresParentalConsent,
  }), [user, isLoading, isParent, isChild, identifyUser, updateUser, logoutUser, deleteAccount, verifyAge, linkChildToParent, recordParentalConsent, requiresParentalConsent]);
});
