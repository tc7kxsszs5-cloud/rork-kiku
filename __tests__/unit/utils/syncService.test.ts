/**
 * Тесты для syncService
 * Проверяет синхронизацию чатов, алертов и настроек
 */

import {
  chatSyncService,
  alertSyncService,
  settingsSyncService,
  SyncResult,
} from '@/utils/syncService';
import { Chat, Alert, ParentalSettings } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpcVanillaClient } from '@/lib/trpc';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@/lib/trpc', () => ({
  trpcVanillaClient: {
    sync: {
      chats: {
        sync: { mutate: jest.fn() },
        get: { query: jest.fn() },
      },
      alerts: {
        sync: { mutate: jest.fn() },
        get: { query: jest.fn() },
      },
      settings: {
        sync: { mutate: jest.fn() },
        get: { query: jest.fn() },
      },
    },
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('syncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('ChatSyncService', () => {
    const mockChat: Chat = {
      id: 'chat-1',
      participants: ['user-1', 'user-2'],
      participantNames: ['User 1', 'User 2'],
      messages: [],
      overallRisk: 'safe',
      lastActivity: Date.now(),
    };

    describe('syncChats', () => {
      it('должен успешно синхронизировать чаты', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.chats.sync.mutate as jest.Mock).mockResolvedValueOnce({
          success: true,
          chats: [mockChat],
        });

        const result = await chatSyncService.syncChats([mockChat]);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(trpcVanillaClient.sync.chats.sync.mutate).toHaveBeenCalled();
      });

      it('должен обрабатывать ошибки синхронизации', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.chats.sync.mutate as jest.Mock).mockRejectedValueOnce(
          new Error('Network error')
        );

        const result = await chatSyncService.syncChats([mockChat]);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('должен обрабатывать таймауты', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        const timeoutError = new Error('timeout');
        timeoutError.name = 'AbortError';
        (trpcVanillaClient.sync.chats.sync.mutate as jest.Mock).mockRejectedValueOnce(timeoutError);

        const result = await chatSyncService.syncChats([mockChat]);

        expect(result.success).toBe(false);
        expect(result.error).toContain('таймаута');
      });
    });

    describe('getChats', () => {
      it('должен успешно получать чаты', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.chats.get.query as jest.Mock).mockResolvedValueOnce({
          chats: [mockChat],
        });

        const result = await chatSyncService.getChats();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(trpcVanillaClient.sync.chats.get.query).toHaveBeenCalled();
      });

      it('должен обрабатывать ошибки получения', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.chats.get.query as jest.Mock).mockRejectedValueOnce(
          new Error('Network error')
        );

        const result = await chatSyncService.getChats();

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('AlertSyncService', () => {
    const mockAlert: Alert = {
      id: 'alert-1',
      chatId: 'chat-1',
      messageId: 'msg-1',
      riskLevel: 'medium',
      timestamp: Date.now(),
      reasons: ['Test reason'],
      resolved: false,
    };

    describe('syncAlerts', () => {
      it('должен успешно синхронизировать алерты', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.alerts.sync.mutate as jest.Mock).mockResolvedValueOnce({
          success: true,
          alerts: [mockAlert],
        });

        const result = await alertSyncService.syncAlerts([mockAlert]);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });

      it('должен обрабатывать ошибки', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.alerts.sync.mutate as jest.Mock).mockRejectedValueOnce(
          new Error('Network error')
        );

        const result = await alertSyncService.syncAlerts([mockAlert]);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('getAlerts', () => {
      it('должен успешно получать алерты', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.alerts.get.query as jest.Mock).mockResolvedValueOnce({
          alerts: [mockAlert],
        });

        const result = await alertSyncService.getAlerts();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });
    });
  });

  describe('SettingsSyncService', () => {
    const mockSettings: ParentalSettings = {
      contentFiltering: true,
      timeRestrictions: {
        enabled: true,
        schedule: [],
      },
      contactManagement: {
        allowNewContacts: false,
        requireApproval: true,
      },
    };

    describe('syncSettings', () => {
      it('должен успешно синхронизировать настройки', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.settings.sync.mutate as jest.Mock).mockResolvedValueOnce({
          success: true,
          settings: mockSettings,
        });

        const result = await settingsSyncService.syncSettings(mockSettings);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });

      it('должен обрабатывать ошибки', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.settings.sync.mutate as jest.Mock).mockRejectedValueOnce(
          new Error('Network error')
        );

        const result = await settingsSyncService.syncSettings(mockSettings);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('getSettings', () => {
      it('должен успешно получать настройки', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('device-123');
        (trpcVanillaClient.sync.settings.get.query as jest.Mock).mockResolvedValueOnce({
          settings: mockSettings,
        });

        const result = await settingsSyncService.getSettings();

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      });
    });
  });
});
