/**
 * Тесты для AuthContext
 * Проверяет аутентификацию, управление PIN, переключение режимов
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth, AuthState } from '@/constants/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );
};

const mockAuthState: AuthState = {
  isAuthenticated: true,
  userId: 'user-123',
  role: 'parent',
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с неаутентифицированным состоянием', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(result.current.userId).toBeUndefined();
      expect(result.current.role).toBeUndefined();
    });

    it('должен загружать состояние из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockAuthState)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.userId).toBe('user-123');
      expect(result.current.role).toBe('parent');
    });

    it('должен обрабатывать ошибку при загрузке из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const { logger } = require('@/utils/logger');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('должен обрабатывать некорректные данные из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid json');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Логин', () => {
    it('должен устанавливать аутентифицированное состояние', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      await act(async () => {
        await result.current.login('user-123', 'parent');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.userId).toBe('user-123');
        expect(result.current.role).toBe('parent');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@auth_state',
          JSON.stringify({
            isAuthenticated: true,
            userId: 'user-123',
            role: 'parent',
          })
        );
      });
    });

    it('должен сохранять PIN при логине', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      await act(async () => {
        await result.current.login('user-123', 'parent', '1234');
      });

      await waitFor(() => {
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          '@auth_pin',
          '1234'
        );
      });
    });

    it('должен обрабатывать ошибку при сохранении состояния', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Save error')
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      await act(async () => {
        await result.current.login('user-123', 'parent');
      });

      // Состояние должно быть установлено даже при ошибке сохранения
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it('должен логиниться как ребенок', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('child-456', 'child');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.userId).toBe('child-456');
        expect(result.current.role).toBe('child');
      });
    });
  });

  describe('Выход', () => {
    it('должен очищать состояние аутентификации', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockAuthState)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.userId).toBeUndefined();
        expect(result.current.role).toBeUndefined();
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_state');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@auth_pin');
      });
    });

    it('должен обрабатывать ошибку при очистке', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockAuthState)
      );
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
        new Error('Remove error')
      );

      const { logger } = require('@/utils/logger');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(logger.error).toHaveBeenCalled();
      });
    });
  });

  describe('Проверка PIN', () => {
    it('должен возвращать true при правильном PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let verifyResult: boolean;
      await act(async () => {
        verifyResult = await result.current.verifyPin('1234');
      });

      await waitFor(() => {
        expect(verifyResult!).toBe(true);
      });
    });

    it('должен возвращать false при неправильном PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let verifyResult: boolean;
      await act(async () => {
        verifyResult = await result.current.verifyPin('5678');
      });

      await waitFor(() => {
        expect(verifyResult!).toBe(false);
      });
    });

    it('должен возвращать false если PIN не установлен', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let verifyResult: boolean;
      await act(async () => {
        verifyResult = await result.current.verifyPin('1234');
      });

      await waitFor(() => {
        expect(verifyResult!).toBe(false);
      });
    });

    it('должен обрабатывать ошибку при проверке PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
        new Error('SecureStore error')
      );

      const { logger } = require('@/utils/logger');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let verifyResult: boolean;
      await act(async () => {
        verifyResult = await result.current.verifyPin('1234');
      });

      await waitFor(() => {
        expect(verifyResult!).toBe(false);
        expect(logger.error).toHaveBeenCalled();
      });
    });
  });

  describe('Создание профиля ребенка', () => {
    it('должен создавать профиль ребенка', async () => {
      const { logger } = require('@/utils/logger');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let profile: any;
      await act(async () => {
        profile = await result.current.createChildProfile({
          name: 'Test Child',
        });
      });

      await waitFor(() => {
        expect(profile).toBeDefined();
        expect(profile.name).toBe('Test Child');
        expect(profile.id).toContain('child_');
        expect(logger.info).toHaveBeenCalledWith(
          'Creating child profile',
          expect.objectContaining({
            context: 'AuthContext',
            action: 'createChildProfile',
            childName: 'Test Child',
          })
        );
      });
    });

    it('должен создавать профиль с permissions', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let profile: any;
      await act(async () => {
        profile = await result.current.createChildProfile({
          name: 'Test Child',
          permissions: { canSendMessages: true },
        });
      });

      await waitFor(() => {
        expect(profile).toBeDefined();
        expect(profile.name).toBe('Test Child');
      });
    });
  });

  describe('Переключение в режим ребенка', () => {
    it('должен переключаться в режим ребенка для родителя', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ ...mockAuthState, role: 'parent' })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.role).toBe('parent');
      });

      let switchResult: boolean;
      await act(async () => {
        switchResult = await result.current.switchToChildMode('child-789');
      });

      await waitFor(() => {
        expect(switchResult!).toBe(true);
        expect(result.current.userId).toBe('child-789');
        expect(result.current.role).toBe('child');
      });
    });

    it('должен возвращать false если текущий пользователь не родитель', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          isAuthenticated: true,
          userId: 'child-456',
          role: 'child',
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.role).toBe('child');
      });

      let switchResult: boolean;
      await act(async () => {
        switchResult = await result.current.switchToChildMode('child-789');
      });

      await waitFor(() => {
        expect(switchResult!).toBe(false);
        // userId не должен измениться
        expect(result.current.userId).toBe('child-456');
      });
    });

    it('должен возвращать false если пользователь не аутентифицирован', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      let switchResult: boolean;
      await act(async () => {
        switchResult = await result.current.switchToChildMode('child-789');
      });

      await waitFor(() => {
        expect(switchResult!).toBe(false);
      });
    });
  });

  describe('Права на изменение фонов чатов', () => {
    it('должен возвращать true для аутентифицированного родителя', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockAuthState)
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.role).toBe('parent');
      });

      expect(result.current.canChangeChatBackgrounds()).toBe(true);
    });

    it('должен возвращать false для ребенка', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          isAuthenticated: true,
          userId: 'child-456',
          role: 'child',
        })
      );

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.role).toBe('child');
      });

      expect(result.current.canChangeChatBackgrounds()).toBe(false);
    });

    it('должен возвращать false для неаутентифицированного пользователя', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(result.current.canChangeChatBackgrounds()).toBe(false);
    });
  });
});
