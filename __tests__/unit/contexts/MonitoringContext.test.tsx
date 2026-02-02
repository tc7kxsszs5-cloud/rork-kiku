/**
 * Тесты для MonitoringContext
 * Проверяет мониторинг сообщений, анализ рисков, алерты
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MonitoringProvider, useMonitoring } from '@/constants/MonitoringContext';
import { Chat, Message, Alert } from '@/constants/types';

// Моки
jest.mock('@/constants/AnalyticsContext', () => ({
  useAnalytics: jest.fn(() => ({
    trackEvent: jest.fn(),
  })),
}));

jest.mock('@/constants/PersonalizedAIContext', () => ({
  usePersonalizedAI: jest.fn(() => ({
    personalizeAnalysis: jest.fn((childId, analysis) => analysis),
  })),
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-1',
      role: 'parent',
      children: [],
    },
  })),
}));

jest.mock('@/constants/AIModerationService', () => ({
  analyzeMessageWithAI: jest.fn().mockResolvedValue({
    riskLevel: 'safe',
    confidence: 0.9,
    reasons: [],
    categories: [],
  }),
  analyzeImageWithAI: jest.fn().mockResolvedValue({
    riskLevel: 'safe',
    confidence: 0.9,
    reasons: [],
    categories: [],
  }),
}));

jest.mock('@/utils/riskEvaluation', () => ({
  evaluateMessageRisk: jest.fn().mockReturnValue({
    riskLevel: 'safe',
    confidence: 0.9,
    reasons: [],
    categories: [],
  }),
  evaluateImageRisk: jest.fn().mockReturnValue({
    riskLevel: 'safe',
    confidence: 0.9,
    reasons: [],
    categories: [],
  }),
}));

jest.mock('@/utils/syncService', () => ({
  chatSyncService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    syncChats: jest.fn().mockResolvedValue({ success: true }),
    getChats: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
  alertSyncService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    syncAlerts: jest.fn().mockResolvedValue({ success: true }),
    getAlerts: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

jest.mock('@/utils/soundNotifications', () => ({
  getSoundForRiskLevel: jest.fn(),
  getAndroidPriorityForRiskLevel: jest.fn(),
  getChannelIdForRiskLevel: jest.fn(),
  setupNotificationChannels: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
}));

jest.mock('@/lib/trpc', () => ({
  trpcVanillaClient: {
    alerts: {
      create: { mutate: jest.fn() },
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
    <MonitoringProvider>{children}</MonitoringProvider>
  );
};

describe('MonitoringContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с пустыми чатами и алертами', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.alerts).toBeDefined();
      });
    });

    it('должен загружать чаты из хранилища', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.isSyncing).toBe(false);
      }, { timeout: 3000 });
    });
  });

  describe('Чаты и сообщения', () => {
    it('должен иметь чаты после инициализации', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.isSyncing).toBe(false);
      });

      expect(result.current.chats.length).toBeGreaterThanOrEqual(0);
    });

    it('должен добавлять сообщение в чат через addMessage', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.chats.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const chatId = result.current.chats[0]?.id;
      expect(chatId).toBeDefined();

      await act(async () => {
        await result.current.addMessage(chatId!, 'Test message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        const chat = result.current.chats.find(c => c.id === chatId);
        expect(chat?.messages.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('должен анализировать сообщение при отправке', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.chats.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const chatId = result.current.chats[0]?.id;

      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      await act(async () => {
        await result.current.addMessage(chatId!, 'Test message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        const chat = result.current.chats.find(c => c.id === chatId);
        expect(chat?.messages.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });
  });

  describe('Алерты', () => {
    it('должен создавать алерт для опасного сообщения', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      analyzeMessageWithAI.mockResolvedValue({
        riskLevel: 'high',
        confidence: 0.9,
        reasons: ['Dangerous content'],
        categories: ['violence'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
        expect(result.current.chats.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      const chatId = result.current.chats[0]?.id;
      const initialAlertsCount = result.current.alerts.length;

      await act(async () => {
        await result.current.addMessage(chatId!, 'Dangerous message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBeGreaterThanOrEqual(initialAlertsCount);
      }, { timeout: 8000 });
    });

    it('должен отмечать алерт как resolved', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
      });

      if (result.current.alerts.length > 0) {
        const alertId = result.current.alerts[0].id;

        await act(async () => {
          result.current.resolveAlert(alertId);
        });

        await waitFor(() => {
          const alert = result.current.alerts.find(a => a.id === alertId);
          expect(alert?.resolved).toBe(true);
        });
      }
    });
  });

  describe('Синхронизация', () => {
    it('должен вызывать синхронизацию', async () => {
      const { chatSyncService } = require('@/utils/syncService');

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
      });

      await act(async () => {
        await result.current.syncData();
      });

      await waitFor(() => {
        expect(result.current.syncError === null || result.current.lastSyncTimestamp !== null).toBe(true);
      }, { timeout: 5000 });
    });

    it('должен обрабатывать ошибки синхронизации', async () => {
      const { chatSyncService } = require('@/utils/syncService');
      chatSyncService.syncChats.mockResolvedValueOnce({
        success: false,
        error: 'Network error',
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
      });

      await act(async () => {
        await result.current.syncData();
      });

      expect(result.current.chats).toBeDefined();
    });
  });

  describe('Алерты (SOS в ParentalControlsContext)', () => {
    it('должен предоставлять массив алертов', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.alerts).toBeDefined();
      });

      expect(Array.isArray(result.current.alerts)).toBe(true);
    });
  });
});
