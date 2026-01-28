/**
 * Тесты для ParentalControlsContext
 * Проверяет родительский контроль, SOS, контакты, временные ограничения, синхронизацию
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { ParentalControlsProvider, useParentalControls } from '@/constants/ParentalControlsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { ParentalSettings, SOSAlert, Contact, TimeRestriction } from '@/constants/types';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@/utils/syncService', () => ({
  settingsSyncService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    syncSettings: jest.fn().mockResolvedValue({ success: true, data: null }),
    getSettings: jest.fn().mockResolvedValue({ success: true, data: null }),
  },
}));

jest.mock('@/utils/timeRestrictions', () => ({
  isTimeRestricted: jest.fn(() => false),
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    error: jest.fn(),
    success: jest.fn(),
    light: jest.fn(),
    medium: jest.fn(),
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@/utils/errorHandler', () => ({
  handleErrorSilently: jest.fn(),
  showUserFriendlyError: jest.fn(),
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
    <ParentalControlsProvider>{children}</ParentalControlsProvider>
  );
};

const mockSettings: ParentalSettings = {
  timeRestrictionsEnabled: true,
  dailyUsageLimit: 120,
  requireApprovalForNewContacts: true,
  blockUnknownContacts: false,
  imageFilteringEnabled: true,
  locationSharingEnabled: true,
  sosNotificationsEnabled: true,
  guardianEmails: ['parent@example.com'],
  guardianPhones: ['+1234567890'],
};

describe('ParentalControlsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 55.7558, longitude: 37.6173 },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с дефолтными настройками', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.settings.timeRestrictionsEnabled).toBe(false);
      expect(result.current.settings.dailyUsageLimit).toBe(180);
      expect(result.current.sosAlerts).toEqual([]);
      expect(result.current.contacts).toEqual([]);
    });

    it('должен загружать данные из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@parental_settings') {
          return Promise.resolve(JSON.stringify(mockSettings));
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.settings.dailyUsageLimit).toBe(120);
      expect(result.current.settings.guardianEmails).toContain('parent@example.com');
    });

    it('должен запускать синхронизацию при инициализации', async () => {
      const { settingsSyncService } = require('@/utils/syncService');

      renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(settingsSyncService.initialize).toHaveBeenCalled();
      });
    });
  });

  describe('Управление настройками', () => {
    it('должен обновлять настройки', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateSettings(
          { dailyUsageLimit: 60 },
          'user-123'
        );
      });

      await waitFor(() => {
        expect(result.current.settings.dailyUsageLimit).toBe(60);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен логировать изменения настроек', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateSettings(
          { imageFilteringEnabled: false },
          'user-123'
        );
      });

      await waitFor(() => {
        expect(result.current.complianceLog.length).toBeGreaterThan(0);
        const log = result.current.complianceLog[0];
        expect(log.action).toBe('settings_update');
        expect(log.userId).toBe('user-123');
      });
    });
  });

  describe('SOS функции', () => {
    it('должен создавать SOS алерт', async () => {
      const { HapticFeedback } = require('@/constants/haptics');

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let sosAlert: SOSAlert | undefined;
      await act(async () => {
        sosAlert = await result.current.triggerSOS(
          'user-123',
          'Test User',
          'chat-1',
          'Help me!'
        );
      });

      await waitFor(() => {
        expect(sosAlert).toBeDefined();
        expect(sosAlert!.userId).toBe('user-123');
        expect(sosAlert!.userName).toBe('Test User');
        expect(sosAlert!.chatId).toBe('chat-1');
        expect(sosAlert!.message).toBe('Help me!');
        expect(sosAlert!.resolved).toBe(false);
        expect(HapticFeedback.error).toHaveBeenCalled();
        expect(result.current.sosAlerts.length).toBeGreaterThan(0);
      });
    });

    it('должен получать местоположение при SOS если включено', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@parental_settings') {
          return Promise.resolve(
            JSON.stringify({ ...mockSettings, locationSharingEnabled: true })
          );
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let sosAlert: SOSAlert | undefined;
      await act(async () => {
        sosAlert = await result.current.triggerSOS('user-123', 'Test User');
      });

      await waitFor(() => {
        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
        expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
        expect(sosAlert!.location).toBeDefined();
        expect(sosAlert!.location!.lat).toBe(55.7558);
      });
    });

    it('должен разрешать SOS алерт', async () => {
      const { HapticFeedback } = require('@/constants/haptics');

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let sosAlert: SOSAlert | undefined;
      await act(async () => {
        sosAlert = await result.current.triggerSOS('user-123', 'Test User');
      });

      await waitFor(() => {
        expect(result.current.sosAlerts.length).toBeGreaterThan(0);
      });

      const sosId = sosAlert!.id;

      await act(async () => {
        await result.current.resolveSOS(sosId, 'parent-456');
      });

      await waitFor(() => {
        const resolvedAlert = result.current.sosAlerts.find((a) => a.id === sosId);
        expect(resolvedAlert?.resolved).toBe(true);
        expect(resolvedAlert?.respondedBy).toBe('parent-456');
        expect(HapticFeedback.success).toHaveBeenCalled();
      });
    });

    it('должен вычислять unresolvedSOSAlerts', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.triggerSOS('user-123', 'Test User');
        await result.current.triggerSOS('user-456', 'Another User');
      });

      await waitFor(() => {
        expect(result.current.unresolvedSOSAlerts.length).toBe(2);
      });

      const firstSOSId = result.current.sosAlerts[0].id;
      await act(async () => {
        await result.current.resolveSOS(firstSOSId, 'parent-456');
      });

      await waitFor(() => {
        expect(result.current.unresolvedSOSAlerts.length).toBe(1);
      });
    });
  });

  describe('Управление контактами', () => {
    it('должен добавлять контакт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let contact: Contact | undefined;
      await act(async () => {
        contact = await result.current.addContact(
          'John Doe',
          'user-123',
          '+1234567890',
          'john@example.com',
          true
        );
      });

      await waitFor(() => {
        expect(contact).toBeDefined();
        expect(contact!.name).toBe('John Doe');
        expect(contact!.phone).toBe('+1234567890');
        expect(contact!.email).toBe('john@example.com');
        expect(contact!.isWhitelisted).toBe(true);
        expect(result.current.contacts.length).toBe(1);
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('должен удалять контакт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let contact: Contact | undefined;
      await act(async () => {
        contact = await result.current.addContact('John Doe', 'user-123');
      });

      await waitFor(() => {
        expect(result.current.contacts.length).toBe(1);
      });

      await act(async () => {
        await result.current.removeContact(contact!.id, 'user-123');
      });

      await waitFor(() => {
        expect(result.current.contacts.length).toBe(0);
      });
    });

    it('должен переключать whitelist статус контакта', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let contact: Contact | undefined;
      await act(async () => {
        contact = await result.current.addContact('John Doe', 'user-123', undefined, undefined, true);
      });

      await waitFor(() => {
        expect(contact!.isWhitelisted).toBe(true);
      });

      await act(async () => {
        await result.current.toggleContactWhitelist(contact!.id, 'user-123');
      });

      await waitFor(() => {
        const updatedContact = result.current.contacts.find((c) => c.id === contact!.id);
        expect(updatedContact?.isWhitelisted).toBe(false);
      });
    });

    it('должен вычислять whitelistedContacts', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addContact('John Doe', 'user-123', undefined, undefined, true);
        await result.current.addContact('Jane Doe', 'user-123', undefined, undefined, false);
      });

      await waitFor(() => {
        expect(result.current.whitelistedContacts.length).toBe(1);
        expect(result.current.whitelistedContacts[0].name).toBe('John Doe');
      });
    });
  });

  describe('Временные ограничения', () => {
    it('должен добавлять временное ограничение', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let restriction: TimeRestriction | undefined;
      await act(async () => {
        restriction = await result.current.addTimeRestriction(
          'user-123',
          1, // Monday
          9, // 9:00
          0, // 0 minutes
          17, // 17:00
          0 // 0 minutes
        );
      });

      await waitFor(() => {
        expect(restriction).toBeDefined();
        expect(restriction!.dayOfWeek).toBe(1);
        expect(restriction!.startHour).toBe(9);
        expect(restriction!.endHour).toBe(17);
        expect(restriction!.enabled).toBe(true);
        expect(result.current.timeRestrictions.length).toBe(1);
      });
    });

    it('должен удалять временное ограничение', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let restriction: TimeRestriction | undefined;
      await act(async () => {
        restriction = await result.current.addTimeRestriction(
          'user-123',
          1,
          9,
          0,
          17,
          0
        );
      });

      await waitFor(() => {
        expect(result.current.timeRestrictions.length).toBe(1);
      });

      await act(async () => {
        await result.current.removeTimeRestriction(restriction!.id, 'user-123');
      });

      await waitFor(() => {
        expect(result.current.timeRestrictions.length).toBe(0);
      });
    });

    it('должен переключать статус временного ограничения', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let restriction: TimeRestriction | undefined;
      await act(async () => {
        restriction = await result.current.addTimeRestriction(
          'user-123',
          1,
          9,
          0,
          17,
          0
        );
      });

      await waitFor(() => {
        expect(restriction!.enabled).toBe(true);
      });

      await act(async () => {
        await result.current.toggleTimeRestriction(restriction!.id, 'user-123');
      });

      await waitFor(() => {
        const updated = result.current.timeRestrictions.find(
          (r) => r.id === restriction!.id
        );
        expect(updated?.enabled).toBe(false);
      });
    });

    it('должен проверять временные ограничения', async () => {
      const { isTimeRestricted } = require('@/utils/timeRestrictions');
      isTimeRestricted.mockReturnValueOnce(true);

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@parental_settings') {
          return Promise.resolve(
            JSON.stringify({ ...mockSettings, timeRestrictionsEnabled: true })
          );
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addTimeRestriction('user-123', 1, 9, 0, 17, 0);
      });

      await waitFor(() => {
        expect(result.current.isTimeRestricted()).toBe(true);
      });
    });
  });

  describe('Синхронизация', () => {
    it('должен синхронизировать настройки', async () => {
      const { settingsSyncService } = require('@/utils/syncService');
      settingsSyncService.syncSettings.mockResolvedValueOnce({
        success: true,
        data: { dailyUsageLimit: 90 },
      });

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.syncSettings();
      });

      await waitFor(() => {
        expect(settingsSyncService.syncSettings).toHaveBeenCalled();
        expect(result.current.lastSyncTimestamp).not.toBeNull();
      });
    });

    it('должен обрабатывать ошибку синхронизации', async () => {
      const { settingsSyncService } = require('@/utils/syncService');
      const { logger } = require('@/utils/logger');
      settingsSyncService.initialize.mockRejectedValueOnce(new Error('Sync error'));

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.syncSettings();
      });

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalled();
        expect(result.current.syncError).not.toBeNull();
      });
    });

    it('не должен синхронизировать если уже идет синхронизация', async () => {
      const { settingsSyncService } = require('@/utils/syncService');

      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Начинаем первую синхронизацию
      act(() => {
        result.current.syncSettings();
      });

      // Пытаемся начать вторую синхронизацию
      const initialCallCount = settingsSyncService.initialize.mock.calls.length;

      act(() => {
        result.current.syncSettings();
      });

      // Количество вызовов не должно увеличиться
      expect(settingsSyncService.initialize.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('Логирование соответствия', () => {
    it('должен логировать действия', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.logCompliance(
          'test_action',
          'user-123',
          { test: 'data' },
          true
        );
      });

      await waitFor(() => {
        expect(result.current.complianceLog.length).toBeGreaterThan(0);
        const log = result.current.complianceLog[0];
        expect(log.action).toBe('test_action');
        expect(log.userId).toBe('user-123');
        expect(log.parentalConsent).toBe(true);
      });
    });

    it('должен ограничивать размер лога до 1000 записей', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Создаем более 1000 записей
      await act(async () => {
        for (let i = 0; i < 1001; i++) {
          await result.current.logCompliance(`action_${i}`, 'user-123', {});
        }
      });

      await waitFor(() => {
        expect(result.current.complianceLog.length).toBe(1000);
      });
    });
  });
});
