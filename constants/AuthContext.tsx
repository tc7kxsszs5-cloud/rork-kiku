/**
 * Auth Context
 * Manages authentication state
 */

import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { logger } from '@/utils/logger';

export interface AuthState {
  isAuthenticated: boolean;
  userId?: string;
  role?: 'parent' | 'child';
}

const AUTH_STORAGE_KEY = '@auth_state';
const PIN_STORAGE_KEY = '@auth_pin';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const state = JSON.parse(stored);
          setAuthState(state);
        }
      } catch (error) {
        logger.error('Failed to load auth state', error instanceof Error ? error : new Error(String(error)), { context: 'AuthContext', action: 'loadAuthState' });
      }
    };

    loadAuthState();
  }, []);

  const login = useCallback(async (userId: string, role: 'parent' | 'child', pin?: string) => {
    const newState: AuthState = {
      isAuthenticated: true,
      userId,
      role,
    };

    setAuthState(newState);

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      if (pin) {
        await SecureStore.setItemAsync(PIN_STORAGE_KEY, pin);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to save auth state:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState({
      isAuthenticated: false,
    });

    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await SecureStore.deleteItemAsync(PIN_STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear auth state', error instanceof Error ? error : new Error(String(error)), { context: 'AuthContext', action: 'logout' });
    }
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_STORAGE_KEY);
      return storedPin === pin;
    } catch (error) {
      logger.error('Failed to verify PIN', error instanceof Error ? error : new Error(String(error)), { context: 'AuthContext', action: 'verifyPin' });
      return false;
    }
  }, []);

  const createChildProfile = useCallback(async (profile: { name: string; permissions?: any }) => {
    // Создание профиля ребенка
    // В реальном приложении здесь будет логика создания профиля
    logger.info('Creating child profile', { context: 'AuthContext', action: 'createChildProfile', childName: profile.name });
    return { id: `child_${Date.now()}`, name: profile.name };
  }, []);

  const switchToChildMode = useCallback(async (childId: string): Promise<boolean> => {
    if (authState.role === 'parent') {
      await login(childId, 'child');
      return true;
    }
    return false;
  }, [authState.role, login]);

  const canChangeChatBackgrounds = useCallback((): boolean => {
    // Родители могут менять фоны чатов
    return authState.role === 'parent' && authState.isAuthenticated;
  }, [authState.role, authState.isAuthenticated]);

  return {
    ...authState,
    login,
    logout,
    verifyPin,
    createChildProfile,
    switchToChildMode,
    canChangeChatBackgrounds,
  };
});
