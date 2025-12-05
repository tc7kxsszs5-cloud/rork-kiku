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
}

const USER_STORAGE_KEY = '@user_data';

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      loadUser();
    } else {
      const timer = setTimeout(() => {
        loadUser();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
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
      setIsLoading(false);
    }
  };

  const identifyUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        ...userData,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      console.log('User identified:', {
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
  }), [user, isLoading, isParent, isChild, identifyUser, updateUser, logoutUser]);
});
