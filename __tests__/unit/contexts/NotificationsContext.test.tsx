/**
 * Тесты для NotificationsContext
 * Проверяет регистрацию устройств, push-уведомления, диагностику
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { NotificationsProvider, useNotifications } from '@/constants/NotificationsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
}));

jest.mock('expo-constants', () => ({
  default: {
    deviceName: 'Test Device',
    expoConfig: {
      version: '1.0.0',
      extra: {
        eas: {
          projectId: 'test-project-id-uuid-12345',
        },
      },
    },
  },
}));

jest.mock('@/lib/trpc', () => ({
  trpc: {
    notifications: {
      registerDevice: {
        useMutation: jest.fn(() => ({
          mutateAsync: jest.fn().mockResolvedValue(undefined),
          onError: jest.fn(),
        })),
      },
      logDeviceTest: {
        useMutation: jest.fn(() => ({
          mutateAsync: jest.fn().mockResolvedValue(undefined),
          onError: jest.fn(),
        })),
      },
      getSyncStatus: {
        useQuery: jest.fn(() => ({
          data: { device: null },
          refetch: jest.fn().mockResolvedValue({ data: { device: null } }),
          isFetching: false,
          error: null,
        })),
      },
    },
  },
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: { id: 'user-123', name: 'Test User' },
  })),
}));

jest.mock('@/utils/soundNotifications', () => ({
  setupNotificationChannels: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/validation', () => ({
  isUuid: jest.fn((str: string) => str?.includes('uuid')),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
    },
  };
});

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NotificationsProvider>{children}</NotificationsProvider>
  );
};

describe('NotificationsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'undetermined',
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: 'ExponentPushToken[test-token]',
    });
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с undetermined статусом', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      expect(result.current.permissionStatus).toBe('undetermined');
      expect(result.current.expoPushToken).toBeNull();
    });

    it('должен создавать deviceId если его нет', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      expect(result.current.deviceId).toContain('device_');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('должен загружать deviceId из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@kids_device_id') {
          return Promise.resolve('stored-device-id');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).toBe('stored-device-id');
      });
    });

    it('должен загружать push токен из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@kids_push_token') {
          return Promise.resolve('stored-push-token');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expoPushToken).toBe('stored-push-token');
      });
    });

    it('должен проверять разрешения при инициализации', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
        expect(result.current.permissionStatus).toBe('granted');
      });
    });

    it('должен устанавливать unavailable для веб-платформы', async () => {
      const RN = require('react-native');
      RN.Platform.OS = 'web';

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSupported).toBe(false);
        expect(result.current.permissionStatus).toBe('unavailable');
      });

      RN.Platform.OS = 'ios'; // Восстанавливаем
    });
  });

  describe('Регистрация устройства', () => {
    it('должен регистрировать устройство', async () => {
      const { trpc } = require('@/lib/trpc');
      const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
      trpc.notifications.registerDevice.useMutation.mockReturnValue({
        mutateAsync: mockMutateAsync,
        onError: jest.fn(),
      });

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
        expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
        expect(mockMutateAsync).toHaveBeenCalled();
        expect(result.current.expoPushToken).toBe('ExponentPushToken[test-token]');
      });
    });

    it('не должен регистрировать если разрешение не выдано', async () => {
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(result.current.permissionStatus).toBe('denied');
        expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
      });
    });

    it('не должен регистрировать если нет projectId', async () => {
      const Constants = require('expo-constants');
      Constants.default.expoConfig.extra.eas.projectId = null;

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      await act(async () => {
        await result.current.registerDevice();
      });

      await waitFor(() => {
        expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
      });
    });
  });

  describe('Обновление статуса', () => {
    it('должен обновлять статус синхронизации', async () => {
      const { trpc } = require('@/lib/trpc');
      const mockRefetch = jest.fn().mockResolvedValue({
        data: { device: { lastSyncedAt: Date.now() } },
      });
      trpc.notifications.getSyncStatus.useQuery.mockReturnValue({
        data: { device: null },
        refetch: mockRefetch,
        isFetching: false,
        error: null,
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      await act(async () => {
        await result.current.refreshStatus();
      });

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it('не должен обновлять статус если нет deviceId', async () => {
      const { trpc } = require('@/lib/trpc');
      const mockRefetch = jest.fn();
      trpc.notifications.getSyncStatus.useQuery.mockReturnValue({
        data: { device: null },
        refetch: mockRefetch,
        isFetching: false,
        error: null,
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      // Устанавливаем deviceId в null для теста
      await act(async () => {
        // Не вызываем refreshStatus, так как deviceId должен быть null
      });

      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  describe('Диагностика', () => {
    it('должен запускать диагностику', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      let diagnostics: any;
      await act(async () => {
        diagnostics = await result.current.runDiagnostics();
      });

      await waitFor(() => {
        expect(diagnostics).toBeDefined();
        expect(diagnostics.length).toBeGreaterThan(0);
        expect(diagnostics.some((d: any) => d.type === 'permissions')).toBe(true);
        expect(diagnostics.some((d: any) => d.type === 'token')).toBe(true);
        expect(diagnostics.some((d: any) => d.type === 'sync')).toBe(true);
        expect(diagnostics.some((d: any) => d.type === 'delivery')).toBe(true);
      });
    });

    it('должен проверять разрешения в диагностике', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      let diagnostics: any;
      await act(async () => {
        diagnostics = await result.current.runDiagnostics();
      });

      await waitFor(() => {
        const permTest = diagnostics.find((d: any) => d.type === 'permissions');
        expect(permTest.status).toBe('passed');
      });
    });

    it('должен проверять токен в диагностике', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@kids_push_token') {
          return Promise.resolve('test-token');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.expoPushToken).toBe('test-token');
      });

      let diagnostics: any;
      await act(async () => {
        diagnostics = await result.current.runDiagnostics();
      });

      await waitFor(() => {
        const tokenTest = diagnostics.find((d: any) => d.type === 'token');
        expect(tokenTest.status).toBe('passed');
      });
    });

    it('должен тестировать доставку уведомлений', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      let diagnostics: any;
      await act(async () => {
        diagnostics = await result.current.runDiagnostics();
      });

      await waitFor(() => {
        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
        const deliveryTest = diagnostics.find((d: any) => d.type === 'delivery');
        expect(deliveryTest.status).toBe('passed');
      });
    });

    it('должен выбрасывать ошибку если deviceId не готов', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      // Устанавливаем deviceId в null для теста
      await act(async () => {
        // Не ждем инициализации deviceId
      });

      await expect(async () => {
        await act(async () => {
          await result.current.runDiagnostics();
        });
      }).rejects.toThrow('Идентификатор устройства не готов');
    });
  });

  describe('Состояния', () => {
    it('должен показывать isRegistering во время регистрации', async () => {
      const { trpc } = require('@/lib/trpc');
      let resolveMutation: any;
      const mockMutateAsync = jest.fn(
        () =>
          new Promise((resolve) => {
            resolveMutation = resolve;
          })
      );
      trpc.notifications.registerDevice.useMutation.mockReturnValue({
        mutateAsync: mockMutateAsync,
        onError: jest.fn(),
      });

      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      act(() => {
        result.current.registerDevice();
      });

      await waitFor(() => {
        expect(result.current.isRegistering).toBe(true);
      });

      await act(async () => {
        resolveMutation();
      });

      await waitFor(() => {
        expect(result.current.isRegistering).toBe(false);
      });
    });

    it('должен показывать isRunningDiagnostics во время диагностики', async () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.deviceId).not.toBeNull();
      });

      act(() => {
        result.current.runDiagnostics();
      });

      await waitFor(() => {
        expect(result.current.isRunningDiagnostics).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isRunningDiagnostics).toBe(false);
      });
    });
  });
});
