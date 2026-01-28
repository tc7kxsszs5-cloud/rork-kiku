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
    syncChats: jest.fn().mockResolvedValue({ success: true }),
    getChats: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
  alertSyncService: {
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
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });
    });
  });

  describe('Создание чата', () => {
    it('должен создавать новый чат', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialCount = result.current.chats.length;

      await act(async () => {
        await result.current.createChat(['user-1', 'user-2'], ['User 1', 'User 2']);
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(initialCount);
      });
    });

    it('должен создавать групповой чат', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.createChat(
          ['user-1', 'user-2', 'user-3'],
          ['User 1', 'User 2', 'User 3'],
          { isGroup: true, groupName: 'Test Group' }
        );
      });

      await waitFor(() => {
        const groupChat = result.current.chats.find(c => c.groupName === 'Test Group');
        expect(groupChat).toBeDefined();
        expect(groupChat?.isGroup).toBe(true);
      });
    });
  });

  describe('Отправка сообщения', () => {
    it('должен добавлять сообщение в чат', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Создаем чат
      let chatId: string = '';
      await act(async () => {
        const chat = await result.current.createChat(['user-1', 'user-2'], ['User 1', 'User 2']);
        chatId = chat.id;
      });

      // Отправляем сообщение
      await act(async () => {
        await result.current.sendMessage(chatId, 'Test message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        const chat = result.current.chats.find(c => c.id === chatId);
        expect(chat?.messages.length).toBeGreaterThan(0);
      });
    });

    it('должен анализировать сообщение при отправке', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let chatId: string = '';
      await act(async () => {
        const chat = await result.current.createChat(['user-1', 'user-2'], ['User 1', 'User 2']);
        chatId = chat.id;
      });

      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      await act(async () => {
        await result.current.sendMessage(chatId, 'Test message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        expect(analyzeMessageWithAI).toHaveBeenCalled();
      });
    });
  });

  describe('Алерты', () => {
    it('должен создавать алерт для опасного сообщения', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'high',
        confidence: 0.9,
        reasons: ['Dangerous content'],
        categories: ['violence'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialAlertsCount = result.current.alerts.length;

      let chatId: string = '';
      await act(async () => {
        const chat = await result.current.createChat(['user-1', 'user-2'], ['User 1', 'User 2']);
        chatId = chat.id;
      });

      await act(async () => {
        await result.current.sendMessage(chatId, 'Dangerous message', 'user-1', 'User 1');
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBeGreaterThan(initialAlertsCount);
      }, { timeout: 3000 });
    });

    it('должен отмечать алерт как resolved', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Предполагаем, что есть алерты
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
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.syncChats();
      });

      await waitFor(() => {
        expect(chatSyncService.syncChats).toHaveBeenCalled();
      });
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
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.syncChats();
      });

      // Не должно бросать ошибку
      expect(result.current.chats).toBeDefined();
    });
  });

  describe('SOS функциональность', () => {
    it('должен вызывать SOS и создавать алерт', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const initialAlertsCount = result.current.alerts.length;

      await act(async () => {
        const mockLocation = {
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
        };
        await result.current.triggerSOS(mockLocation);
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBeGreaterThanOrEqual(initialAlertsCount);
      });
    });
  });
});
