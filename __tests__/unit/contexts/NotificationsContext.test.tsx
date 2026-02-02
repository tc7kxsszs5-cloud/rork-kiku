/**
 * Тесты для NotificationsContext
 * Проверяет push-уведомления, регистрацию устройств, диагностику
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { NotificationsProvider, useNotifications } from '@/constants/NotificationsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'ExponentPushToken[test]' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
}));

jest.mock('expo-constants', () => ({
  default: {
    deviceName: 'Test Device',
    expoConfig: {
      extra: {
        eas: {
<<<<<<< HEAD
          projectId: '00000000-0000-0000-0000-000000000000',
        },
        projectId: '00000000-0000-0000-0000-000000000000',
      },
      version: '1.0.0',
=======
          projectId: 'test-project-id',
        },
      },
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
    },
  },
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-1',
      name: 'Test User',
    },
  })),
}));

jest.mock('@/lib/trpc', () => ({
  trpc: {
    notifications: {
      registerDevice: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          mutateAsync: jest.fn().mockResolvedValue({}),
        })),
      },
      logDeviceTest: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          mutateAsync: jest.fn().mockResolvedValue({}),
        })),
      },
      getSyncStatus: {
        useQuery: jest.fn(() => ({
          data: null,
          refetch: jest.fn(),
          isFetching: false,
          error: null,
        })),
      },
    },
  },
}));

jest.mock('@/utils/soundNotifications', () => ({
  setupNotificationChannels: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/validation', () => ({
  isUuid: jest.fn(() => true),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NotificationsProvider>{children}</NotificationsProvider>
  );
};

describe('NotificationsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
<<<<<<< HEAD
    process.env.EXPO_PUBLIC_PROJECT_ID = '00000000-0000-0000-0000-000000000000';
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@kids_device_id') return Promise.resolve('device-123');
      if (key === '@kids_push_token') return Promise.resolve(null);
      return Promise.resolve(null);
    });
=======
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Инициализация', () => {
    it('должен инициализироваться', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    it('должен загружать deviceId из хранилища', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === '@kids_device_id') {
          return Promise.resolve('device-123');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).toBe('device-123');
      }, { timeout: 3000 });
    });
  });

  describe('Регистрация устройства', () => {
    it('должен регистрировать устройство', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(result.current.isRegistering).toBe(false);
      }, { timeout: 5000 });
    });

    it('должен запрашивать разрешения', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('должен получать push token', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(result.current.expoPushToken).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('Обновление статуса', () => {
    it('должен обновлять статус', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.refreshStatus();
      });

      // Не должно бросать ошибку
      expect(result.current).toBeDefined();
    });
  });

  describe('Диагностика', () => {
    it('должен запускать диагностику', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

<<<<<<< HEAD
      await waitFor(() => {
        expect(result.current.deviceId).toBeTruthy();
      }, { timeout: 3000 });

=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
      let diagnostics: any[] = [];
      await act(async () => {
        diagnostics = await result.current.runDiagnostics();
      });

      expect(Array.isArray(diagnostics)).toBe(true);
    });

    it('должен сохранять результаты диагностики', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

<<<<<<< HEAD
      await waitFor(() => {
        expect(result.current.deviceId).toBeTruthy();
      }, { timeout: 3000 });

=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
      await act(async () => {
        await result.current.runDiagnostics();
      });

      await waitFor(() => {
        expect(result.current.lastDiagnostics).toBeDefined();
      });
    });
  });

  describe('Поддержка платформы', () => {
    it('должен определять поддержку платформы', () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.isSupported).toBe('boolean');
    });

    it('должен быть поддержан на iOS', () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSupported).toBe(true);
    });
  });
});
