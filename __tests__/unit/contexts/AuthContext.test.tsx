/**
 * Тесты для AuthContext
 * Проверяет аутентификацию, PIN, переключение ролей
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/constants/AuthContext';
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
    it('должен инициализироваться с isAuthenticated=false', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    it('должен загружать состояние из AsyncStorage', async () => {
      const mockAuthState = {
        isAuthenticated: true,
        userId: 'user-1',
        role: 'parent',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAuthState));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.userId).toBe('user-1');
        expect(result.current.role).toBe('parent');
      });
    });

    it('должен обрабатывать ошибку при загрузке', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('Login', () => {
    it('должен устанавливать состояние при логине', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      await act(async () => {
        await result.current.login('user-1', 'parent');
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.userId).toBe('user-1');
        expect(result.current.role).toBe('parent');
      });
    });

    it('должен сохранять состояние в AsyncStorage', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('user-1', 'parent');
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@auth_state',
          expect.stringContaining('user-1')
        );
      });
    });

    it('должен сохранять PIN в SecureStore', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('user-1', 'parent', '1234');
      });

      await waitFor(() => {
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('@auth_pin', '1234');
      });
    });
  });

  describe('Logout', () => {
    it('должен очищать состояние при логауте', async () => {
      const mockAuthState = {
        isAuthenticated: true,
        userId: 'user-1',
        role: 'parent',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAuthState));

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
      });
    });

    it('должен удалять данные из хранилищ', async () => {
      const mockAuthState = {
        isAuthenticated: true,
        userId: 'user-1',
        role: 'parent',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockAuthState));

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
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_state');
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('@auth_pin');
      });
    });
  });

  describe('Verify PIN', () => {
    it('должен возвращать true для правильного PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let isValid = false;
      await act(async () => {
        isValid = await result.current.verifyPin('1234');
      });

      expect(isValid).toBe(true);
    });

    it('должен возвращать false для неправильного PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let isValid = true;
      await act(async () => {
        isValid = await result.current.verifyPin('9999');
      });

      expect(isValid).toBe(false);
    });

    it('должен возвращать false при ошибке', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('SecureStore error'));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let isValid = true;
      await act(async () => {
        isValid = await result.current.verifyPin('1234');
      });

      expect(isValid).toBe(false);
    });
  });

  describe('Child Mode', () => {
    it('должен переключаться в режим ребенка', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('parent-1', 'parent');
      });

      await waitFor(() => {
        expect(result.current.role).toBe('parent');
      });

      let switched = false;
      await act(async () => {
        switched = await result.current.switchToChildMode('child-1');
      });

      expect(switched).toBe(true);
      await waitFor(() => {
        expect(result.current.role).toBe('child');
        expect(result.current.userId).toBe('child-1');
      });
    });

    it('не должен переключаться если уже ребенок', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('child-1', 'child');
      });

      let switched = true;
      await act(async () => {
        switched = await result.current.switchToChildMode('child-2');
      });

      expect(switched).toBe(false);
    });
  });

  describe('Permissions', () => {
    it('родитель может менять фоны чатов', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('parent-1', 'parent');
      });

      await waitFor(() => {
        expect(result.current.canChangeChatBackgrounds()).toBe(true);
      });
    });

    it('ребенок не может менять фоны чатов', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.login('child-1', 'child');
      });

      await waitFor(() => {
        expect(result.current.canChangeChatBackgrounds()).toBe(false);
      });
    });

    it('неаутентифицированный пользователь не может менять фоны', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.canChangeChatBackgrounds()).toBe(false);
      });
    });
  });

  describe('Create Child Profile', () => {
    it('должен создавать профиль ребенка', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      let profile: any;
      await act(async () => {
        profile = await result.current.createChildProfile({ name: 'Test Child' });
      });

      expect(profile).toBeDefined();
      expect(profile.name).toBe('Test Child');
      expect(profile.id).toContain('child_');
    });
  });
});
