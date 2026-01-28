/**
 * Тесты для ParentalControlsContext
 * Проверяет родительский контроль, настройки, SOS алерты
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { ParentalControlsProvider, useParentalControls } from '@/constants/ParentalControlsContext';
import { ParentalSettings, Contact, TimeRestriction } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: null,
      accuracy: 10,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  }),
}));

jest.mock('@/utils/timeRestrictions', () => ({
  isTimeRestricted: jest.fn().mockReturnValue(false),
}));

jest.mock('@/utils/syncService', () => ({
  settingsSyncService: {
    initialize: jest.fn(),
    syncSettings: jest.fn().mockResolvedValue({ success: true }),
    getSettings: jest.fn().mockResolvedValue({ success: true, data: {} }),
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

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ParentalControlsProvider>{children}</ParentalControlsProvider>
  );
};

describe('ParentalControlsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с настройками по умолчанию', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      expect(result.current.settings).toBeDefined();
      expect(result.current.settings.imageFilteringEnabled).toBeDefined();
    });

    it('должен загружать настройки из AsyncStorage', async () => {
      const mockSettings: ParentalSettings = {
        timeRestrictionsEnabled: true,
        dailyUsageLimit: 120,
        requireApprovalForNewContacts: true,
        blockUnknownContacts: false,
        imageFilteringEnabled: true,
        locationSharingEnabled: true,
        sosNotificationsEnabled: true,
        guardianEmails: ['test@example.com'],
        guardianPhones: ['+1234567890'],
      };

      (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
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
        expect(result.current.settings.dailyUsageLimit).toBe(120);
      }, { timeout: 3000 });
    });
  });

  describe('Обновление настроек', () => {
    it('должен обновлять настройки', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateSettings({ dailyUsageLimit: 90 });
      });

      await waitFor(() => {
        expect(result.current.settings.dailyUsageLimit).toBe(90);
      });
    });

    it('должен сохранять настройки в AsyncStorage', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.updateSettings({ dailyUsageLimit: 90 });
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@parental_settings',
          expect.any(String)
        );
      });
    });
  });

  describe('Управление контактами', () => {
    const mockContact: Contact = {
      id: 'contact-1',
      name: 'Test Contact',
      approved: false,
      addedAt: Date.now(),
    };

    it('должен добавлять контакт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addContact(mockContact);
      });

      await waitFor(() => {
        expect(result.current.contacts.length).toBeGreaterThan(0);
      });
    });

    it('должен одобрять контакт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addContact(mockContact);
      });

      await act(async () => {
        result.current.approveContact('contact-1');
      });

      await waitFor(() => {
        const contact = result.current.contacts.find(c => c.id === 'contact-1');
        expect(contact?.approved).toBe(true);
      });
    });

    it('должен удалять контакт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.addContact(mockContact);
      });

      const initialCount = result.current.contacts.length;

      await act(async () => {
        result.current.removeContact('contact-1');
      });

      await waitFor(() => {
        expect(result.current.contacts.length).toBeLessThan(initialCount);
      });
    });
  });

  describe('Временные ограничения', () => {
    const mockRestriction: TimeRestriction = {
      id: 'restriction-1',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      enabled: true,
    };

    it('должен добавлять временное ограничение', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        result.current.addTimeRestriction(mockRestriction);
      });

      await waitFor(() => {
        expect(result.current.timeRestrictions.length).toBeGreaterThan(0);
      });
    });

    it('должен проверять временные ограничения', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const isRestricted = result.current.isTimeRestricted();
      expect(typeof isRestricted).toBe('boolean');
    });
  });

  describe('SOS Alert', () => {
    it('должен создавать SOS алерт', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.triggerSOS();
      });

      await waitFor(() => {
        expect(result.current.sosAlerts.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('должен отмечать SOS как resolved', async () => {
      const { result } = renderHook(() => useParentalControls(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.triggerSOS();
      });

      await waitFor(() => {
        expect(result.current.sosAlerts.length).toBeGreaterThan(0);
      }, { timeout: 5000 });

      const alertId = result.current.sosAlerts[0]?.id;
      if (alertId) {
        await act(async () => {
          result.current.resolveSOS(alertId);
        });

        await waitFor(() => {
          const alert = result.current.sosAlerts.find(a => a.id === alertId);
          expect(alert?.resolved).toBe(true);
        });
      }
    });
  });

  describe('Синхронизация', () => {
    it('должен синхронизировать настройки', async () => {
      const { settingsSyncService } = require('@/utils/syncService');

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
      });
    });

    it('должен обрабатывать ошибки синхронизации', async () => {
      const { settingsSyncService } = require('@/utils/syncService');
      settingsSyncService.syncSettings.mockResolvedValueOnce({
        success: false,
        error: 'Network error',
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

      // Не должно бросать ошибку
      expect(result.current.settings).toBeDefined();
    });
  });
});
