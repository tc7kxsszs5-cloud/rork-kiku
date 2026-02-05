/**
 * Тесты для UserContext
 * Проверяет загрузку пользователя, управление детьми, сохранение в AsyncStorage
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { UserProvider, useUser, User, ChildProfile } from '@/constants/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@/constants/i18n', () => ({
  default: {
    changeLanguage: jest.fn(),
    language: 'en',
  },
  detectDeviceLanguage: jest.fn(() => Promise.resolve('en')),
}));

jest.mock('@/utils/errorHandler', () => ({
  handleErrorSilently: jest.fn(),
  showUserFriendlyError: jest.fn(),
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
    <UserProvider>{children}</UserProvider>
  );
};

const mockUser: User = {
  id: 'user-1',
  name: 'Test Parent',
  email: 'test@example.com',
  role: 'parent',
  createdAt: Date.now(),
  children: [],
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с null пользователем', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('должен загружать пользователя из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.user).not.toBeNull();
      });

      expect(result.current.user?.id).toBe('user-1');
      expect(result.current.user?.name).toBe('Test Parent');
    });

    it('должен обрабатывать ошибку при загрузке из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Должен остаться null при ошибке
      expect(result.current.user).toBeNull();
    });
  });

  describe('Управление пользователем', () => {
    it('должен устанавливать пользователя', async () => {
      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.setUser(mockUser);
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
        expect(result.current.user?.id).toBe('user-1');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен обновлять пользователя', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      const updatedUser = { ...mockUser, name: 'Updated Name' };

      await act(async () => {
        await result.current.setUser(updatedUser);
      });

      await waitFor(() => {
        expect(result.current.user?.name).toBe('Updated Name');
      });
    });

    it('должен очищать пользователя', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.clearUser();
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(AsyncStorage.removeItem).toHaveBeenCalled();
      });
    });
  });

  describe('Управление детьми', () => {
    const mockChild: ChildProfile = {
      id: 'child-1',
      name: 'Test Child',
      age: 10,
      addedAt: Date.now(),
    };

    it('должен добавлять ребенка', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
      });

      await act(async () => {
        await result.current.addChild(mockChild);
      });

      await waitFor(() => {
        expect(result.current.user?.children).toHaveLength(1);
        expect(result.current.user?.children[0].id).toBe('child-1');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен удалять ребенка', async () => {
      const userWithChild = {
        ...mockUser,
        children: [mockChild],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithChild));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user?.children).toHaveLength(1);
      });

      await act(async () => {
        await result.current.removeChild('child-1');
      });

      await waitFor(() => {
        expect(result.current.user?.children).toHaveLength(0);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен обновлять ребенка', async () => {
      const userWithChild = {
        ...mockUser,
        children: [mockChild],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithChild));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user?.children).toHaveLength(1);
      });

      const updatedChild = { ...mockChild, name: 'Updated Child Name' };

      await act(async () => {
        await result.current.updateChild('child-1', updatedChild);
      });

      await waitFor(() => {
        expect(result.current.user?.children[0].name).toBe('Updated Child Name');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен устанавливать активного ребенка', async () => {
      const userWithChild = {
        ...mockUser,
        children: [mockChild],
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithChild));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user?.children).toHaveLength(1);
      });

      await act(async () => {
        await result.current.setActiveChild('child-1');
      });

      await waitFor(() => {
        expect(result.current.user?.activeChildId).toBe('child-1');
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });
  });

  describe('Миграция данных', () => {
    it('должен устанавливать role="parent" по умолчанию если отсутствует', async () => {
      const userWithoutRole = {
        id: 'user-1',
        name: 'Test',
        createdAt: Date.now(),
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithoutRole));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
        expect(result.current.user?.role).toBe('parent');
      });
    });

    it('должен обеспечивать наличие children массива', async () => {
      const userWithoutChildren = {
        id: 'user-1',
        name: 'Test',
        role: 'parent',
        createdAt: Date.now(),
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithoutChildren));

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.user).not.toBeNull();
        expect(result.current.user?.children).toEqual([]);
      });
    });
  });

  describe('Язык', () => {
    it('должен загружать пользователя с языком и вызывать changeLanguage', async () => {
      const userWithLanguage = {
        ...mockUser,
        language: 'ru',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userWithLanguage));

      const i18nModule = require('@/constants/i18n');
      const i18n = i18nModule.default;

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
          expect(result.current.user?.language).toBe('ru');
        },
        { timeout: 3000 }
      );
      // При загрузке пользователя с language контекст вызывает i18n.changeLanguage в loadUser
      expect(i18n.changeLanguage).toHaveBeenCalledWith('ru');
    });
  });
});
