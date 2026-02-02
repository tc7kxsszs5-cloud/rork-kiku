import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import i18n from './i18n';
import { logger } from '@/utils/logger';

import { UserRole, ParentGender } from './types';
import { handleErrorSilently, showUserFriendlyError } from '@/utils/errorHandler';

export interface ChildProfile {
  id: string;
  name: string;
  age?: number;
  avatar?: string;
  deviceId?: string;
  addedAt: number;
  parentId?: string; // ID родителя-владельца
  pin?: string; // PIN для входа ребенка (опционально)
  permissions?: {
    canChangeChatBackgrounds?: boolean;
    canChangeNotificationSounds?: boolean;
    canAddContacts?: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: number;
  deviceId?: string;
  language?: string;
  role?: UserRole; // 'parent' | 'child' (опционально для обратной совместимости)
  parentId?: string; // Если role='child', указывает на родителя
  parentPin?: string; // PIN родителя для аутентификации
  parentGender?: ParentGender; // Пол родителя (для локализации)
  country?: string; // Страна (для локализации)
  children: ChildProfile[]; // Массив детей родителя
  activeChildId?: string; // ID активного (выбранного) ребенка для просмотра
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
          // Миграция: если нет role, устанавливаем 'parent' по умолчанию
          const migratedUser: User = {
            ...userData,
            role: userData.role || 'parent', // По умолчанию родитель
            children: userData.children || [], // Обеспечиваем наличие children
          };
          setUser(migratedUser);
          if (migratedUser.language) {
            i18n.changeLanguage(migratedUser.language);
          }
        } else {
          // Первый запуск - определяем язык устройства автоматически
          const { detectDeviceLanguage } = await import('@/constants/i18n');
          const detectedLang = await detectDeviceLanguage();
          if (detectedLang && detectedLang !== i18n.language) {
            i18n.changeLanguage(detectedLang);
            logger.info('Auto-detected language', { context: 'UserContext', language: detectedLang });
          }
        }
      } catch (error) {
        handleErrorSilently(error, 'UserContext', { action: 'loadUser' });
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

  const identifyUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'children'> & { children?: ChildProfile[] }) => {
    try {
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        children: userData.children || [],
        ...userData,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      logger.info('User identified', { context: 'UserContext', userId: newUser.id, userName: newUser.name, childrenCount: newUser.children.length });

      return newUser;
    } catch (error) {
      logger.error('Error identifying user', error instanceof Error ? error : new Error(String(error)), { context: 'UserContext', action: 'identifyUser' });
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

      logger.info('User updated', { context: 'UserContext', userId: updatedUser.id, action: 'updateUser' });
      return updatedUser;
    } catch (error) {
      handleErrorSilently(error, 'UserContext', { action: 'updateUser' });
      await showUserFriendlyError(error, 'UserContext', { action: 'updateUser' });
      throw error;
    }
  }, [user]);

  const addChild = useCallback(async (childData: Omit<ChildProfile, 'id' | 'addedAt' | 'parentId'>) => {
    if (!user) {
      throw new Error('No user to add child to');
    }

    // Проверка: только родитель может добавлять детей
    if (user.role === 'child') {
      throw new Error('Only parent can add children');
    }

    try {
      const newChild: ChildProfile = {
        id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: Date.now(),
        parentId: user.id,
        permissions: {
          canChangeChatBackgrounds: true,
          canChangeNotificationSounds: true,
          canAddContacts: false, // По умолчанию только родитель
          ...childData.permissions,
        },
        ...childData,
      };

      const updatedUser = {
        ...user,
        children: [...user.children, newChild],
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log('Child added:', newChild.id);
      return newChild;
    } catch (error) {
      console.error('Error adding child:', error);
      throw error;
    }
  }, [user]);

  const removeChild = useCallback(async (childId: string) => {
    if (!user) {
      throw new Error('No user to remove child from');
    }

    try {
      const updatedChildren = user.children.filter(child => child.id !== childId);
      const updatedUser = {
        ...user,
        children: updatedChildren,
        activeChildId: user.activeChildId === childId ? undefined : user.activeChildId,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      logger.info('Child removed', { context: 'UserContext', childId, action: 'removeChild' });
    } catch (error) {
      logger.error('Error removing child', error instanceof Error ? error : new Error(String(error)), { context: 'UserContext', action: 'removeChild' });
      throw error;
    }
  }, [user]);

  const updateChild = useCallback(async (childId: string, updates: Partial<ChildProfile>) => {
    if (!user) {
      throw new Error('No user to update child in');
    }

    try {
      const updatedChildren = user.children.map((child) =>
        child.id === childId ? { ...child, ...updates } : child
      );
      const updatedUser = { ...user, children: updatedChildren };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
      logger.info('Child updated', { context: 'UserContext', childId, action: 'updateChild' });
    } catch (error) {
      logger.error('Error updating child', error instanceof Error ? error : new Error(String(error)), { context: 'UserContext', action: 'updateChild' });
      throw error;
    }
  }, [user]);

  const setActiveChild = useCallback(async (childId: string | undefined) => {
    if (!user) {
      throw new Error('No user to update');
    }

    try {
      const updatedUser = { ...user, activeChildId: childId };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      logger.info('Active child set', { context: 'UserContext', childId, action: 'setActiveChild' });
    } catch (error) {
      handleErrorSilently(error, 'UserContext', { action: 'setActiveChild' });
      await showUserFriendlyError(error, 'UserContext', { action: 'setActiveChild' });
      throw error;
    }
  }, [user]);

  const logoutUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      logger.info('User logged out', { context: 'UserContext', action: 'logoutUser' });
    } catch (error) {
      handleErrorSilently(error, 'UserContext', { action: 'logoutUser' });
      await showUserFriendlyError(error, 'UserContext', { action: 'logoutUser' });
      throw error;
    }
  }, []);

  /** Установить пользователя (для тестов и восстановления из хранилища). */
  const setUserAndPersist = useCallback(async (userData: User | null) => {
    if (userData === null) {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      return;
    }
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      if (userData.language) {
        i18n.changeLanguage(userData.language);
      }
    } catch (error) {
      handleErrorSilently(error, 'UserContext', { action: 'setUser' });
      throw error;
    }
  }, []);

  const activeChild = useMemo(() => {
    if (!user || !user.activeChildId) return null;
    return user.children.find(child => child.id === user.activeChildId) || null;
  }, [user]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    activeChild,
    children: user?.children || [],
    identifyUser,
    updateUser,
    addChild,
    removeChild,
    updateChild,
    setActiveChild,
    logoutUser,
    setUser: setUserAndPersist,
    clearUser: logoutUser,
  }), [user, isLoading, activeChild, identifyUser, updateUser, addChild, removeChild, updateChild, setActiveChild, logoutUser, setUserAndPersist]);
});
