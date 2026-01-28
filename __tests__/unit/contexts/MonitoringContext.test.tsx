/**
 * Тесты для MonitoringContext
 * Проверяет мониторинг сообщений, анализ рисков, создание алертов, синхронизацию
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { MonitoringProvider, useMonitoring } from '@/constants/MonitoringContext';
import { Chat, Message, Alert, RiskLevel, RiskAnalysis } from '@/constants/types';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/constants/mockData';

// Моки для зависимостей
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
    user: { id: 'user-123', name: 'Test Parent', role: 'parent' },
  })),
}));

jest.mock('@/utils/syncService', () => ({
  chatSyncService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    syncChats: jest.fn().mockResolvedValue({ success: true, data: [] }),
    getChats: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
  alertSyncService: {
    initialize: jest.fn().mockResolvedValue(undefined),
    syncAlerts: jest.fn().mockResolvedValue({ success: true, data: [] }),
    getAlerts: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

jest.mock('@/constants/AIModerationService', () => ({
  analyzeMessageWithAI: jest.fn().mockResolvedValue({
    riskLevel: 'safe' as RiskLevel,
    reasons: [],
    confidence: 0.9,
    categories: [],
  }),
  analyzeImageWithAI: jest.fn().mockResolvedValue({
    blocked: false,
    reasons: [],
  }),
}));

jest.mock('@/utils/riskEvaluation', () => ({
  evaluateMessageRisk: jest.fn((message: Message) => ({
    riskLevel: 'safe' as RiskLevel,
    reasons: [],
    confidence: 0.8,
    categories: [],
  })),
  evaluateImageRisk: jest.fn(() => ({
    blocked: false,
    reasons: [],
  })),
}));

jest.mock('@/utils/soundNotifications', () => ({
  getSoundForRiskLevel: jest.fn(() => 'default'),
  getAndroidPriorityForRiskLevel: jest.fn(() => 'default'),
  getChannelIdForRiskLevel: jest.fn(() => 'default'),
  setupNotificationChannels: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    error: jest.fn(),
    warning: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/lib/trpc', () => ({
  trpcVanillaClient: {
    notifications: {
      sendRiskAlertPush: {
        mutate: jest.fn().mockResolvedValue(undefined),
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
    <MonitoringProvider>{children}</MonitoringProvider>
  );
};

describe('MonitoringContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с MOCK_CHATS', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats).toBeDefined();
      });

      expect(result.current.chats.length).toBeGreaterThan(0);
      expect(result.current.alerts).toEqual([]);
      expect(result.current.isAnalyzing).toBe(false);
    });

    it('должен инициализировать сообщения чатов', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        const chat1 = result.current.chats.find((c) => c.id === '1');
        expect(chat1?.messages.length).toBeGreaterThan(0);
      });
    });

    it('должен запускать синхронизацию при инициализации', async () => {
      const { chatSyncService, alertSyncService } = require('@/utils/syncService');

      renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(chatSyncService.initialize).toHaveBeenCalled();
        expect(alertSyncService.initialize).toHaveBeenCalled();
      });
    });
  });

  describe('Добавление сообщений', () => {
    it('должен добавлять сообщение в чат', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;
      const initialMessageCount = result.current.chats[0].messages.length;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Test message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        const updatedChat = result.current.chats.find((c) => c.id === chatId);
        expect(updatedChat?.messages.length).toBe(initialMessageCount + 1);
        expect(updatedChat?.messages[updatedChat.messages.length - 1].text).toBe(
          'Test message'
        );
      });
    });

    it('должен обновлять lastActivity при добавлении сообщения', async () => {
      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;
      const initialLastActivity = result.current.chats[0].lastActivity;

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
        await result.current.addMessage(
          chatId,
          'Test message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        const updatedChat = result.current.chats.find((c) => c.id === chatId);
        expect(updatedChat?.lastActivity).toBeGreaterThan(initialLastActivity);
      });
    });

    it('должен анализировать сообщение после добавления', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Test message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(analyzeMessageWithAI).toHaveBeenCalled();
      });
    });

    it('должен анализировать изображение если оно присутствует', async () => {
      const { analyzeImageWithAI } = require('@/constants/AIModerationService');

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Test message',
          'sender-1',
          'Test Sender',
          'file://image.jpg'
        );
      });

      await waitFor(() => {
        expect(analyzeImageWithAI).toHaveBeenCalledWith(
          'file://image.jpg',
          expect.any(Object)
        );
      });
    });

    it('должен трекать событие отправки сообщения', async () => {
      const { useAnalytics } = require('@/constants/AnalyticsContext');
      const mockTrackEvent = jest.fn();
      useAnalytics.mockReturnValue({ trackEvent: mockTrackEvent });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Test message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('message_sent', {
          chatId,
          senderId: 'sender-1',
          hasImage: false,
        });
      });
    });
  });

  describe('Создание алертов', () => {
    it('должен создавать алерт при обнаружении риска', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'high' as RiskLevel,
        reasons: ['Inappropriate content'],
        confidence: 0.9,
        categories: ['toxicity'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Inappropriate message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBeGreaterThan(0);
        expect(result.current.unresolvedAlerts.length).toBeGreaterThan(0);
      });

      const alert = result.current.alerts[0];
      expect(alert.riskLevel).toBe('high');
      expect(alert.chatId).toBe(chatId);
      expect(alert.resolved).toBe(false);
    });

    it('должен создавать критический алерт для critical риска', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'critical' as RiskLevel,
        reasons: ['Critical threat'],
        confidence: 0.95,
        categories: ['threat'],
      });

      const { HapticFeedback } = require('@/constants/haptics');

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Critical message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(result.current.criticalAlerts.length).toBeGreaterThan(0);
        expect(HapticFeedback.error).toHaveBeenCalled();
      });
    });

    it('должен отправлять уведомление при создании алерта', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      const Notifications = require('expo-notifications');

      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'high' as RiskLevel,
        reasons: ['Inappropriate content'],
        confidence: 0.9,
        categories: ['toxicity'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Inappropriate message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
      });
    });

    it('не должен создавать алерт для safe сообщений', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'safe' as RiskLevel,
        reasons: [],
        confidence: 0.9,
        categories: [],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;
      const initialAlertCount = result.current.alerts.length;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Safe message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBe(initialAlertCount);
      });
    });
  });

  describe('Разрешение алертов', () => {
    it('должен разрешать алерт', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      const { useAnalytics } = require('@/constants/AnalyticsContext');
      const mockTrackEvent = jest.fn();
      useAnalytics.mockReturnValue({ trackEvent: mockTrackEvent });

      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'high' as RiskLevel,
        reasons: ['Inappropriate content'],
        confidence: 0.9,
        categories: ['toxicity'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Inappropriate message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(result.current.alerts.length).toBeGreaterThan(0);
      });

      const alertId = result.current.alerts[0].id;

      await act(async () => {
        result.current.resolveAlert(alertId);
      });

      await waitFor(() => {
        const resolvedAlert = result.current.alerts.find((a) => a.id === alertId);
        expect(resolvedAlert?.resolved).toBe(true);
        expect(mockTrackEvent).toHaveBeenCalledWith('alert_resolved', {
          alertId,
          chatId,
          riskLevel: 'high',
        });
      });
    });

    it('должен обновлять unresolvedAlerts после разрешения', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      analyzeMessageWithAI.mockResolvedValueOnce({
        riskLevel: 'high' as RiskLevel,
        reasons: ['Inappropriate content'],
        confidence: 0.9,
        categories: ['toxicity'],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Inappropriate message',
          'sender-1',
          'Test Sender'
        );
      });

      await waitFor(() => {
        expect(result.current.unresolvedAlerts.length).toBeGreaterThan(0);
      });

      const initialUnresolvedCount = result.current.unresolvedAlerts.length;
      const alertId = result.current.alerts[0].id;

      await act(async () => {
        result.current.resolveAlert(alertId);
      });

      await waitFor(() => {
        expect(result.current.unresolvedAlerts.length).toBe(
          initialUnresolvedCount - 1
        );
      });
    });
  });

  describe('Синхронизация данных', () => {
    it('должен синхронизировать чаты', async () => {
      const { chatSyncService } = require('@/utils/syncService');
      chatSyncService.syncChats.mockResolvedValueOnce({
        success: true,
        data: [
          {
            id: 'new-chat',
            participants: ['user1'],
            participantNames: ['New User'],
            messages: [],
            overallRisk: 'safe' as RiskLevel,
            lastActivity: Date.now(),
          },
        ],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const initialChatCount = result.current.chats.length;

      await act(async () => {
        await result.current.syncData();
      });

      await waitFor(() => {
        expect(chatSyncService.syncChats).toHaveBeenCalled();
        expect(result.current.lastSyncTimestamp).not.toBeNull();
      });
    });

    it('должен обрабатывать ошибку синхронизации', async () => {
      const { chatSyncService } = require('@/utils/syncService');
      const { logger } = require('@/utils/logger');

      chatSyncService.initialize.mockRejectedValueOnce(new Error('Sync error'));

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      await act(async () => {
        await result.current.syncData();
      });

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalled();
        expect(result.current.syncError).not.toBeNull();
      });
    });

    it('не должен синхронизировать если уже идет синхронизация', async () => {
      const { chatSyncService } = require('@/utils/syncService');

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      // Начинаем первую синхронизацию
      act(() => {
        result.current.syncData();
      });

      // Пытаемся начать вторую синхронизацию
      const initialCallCount = chatSyncService.initialize.mock.calls.length;

      act(() => {
        result.current.syncData();
      });

      // Количество вызовов не должно увеличиться
      expect(chatSyncService.initialize.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('Вычисляемые значения', () => {
    it('должен вычислять unresolvedAlerts', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      analyzeMessageWithAI.mockResolvedValue({
        riskLevel: 'high' as RiskLevel,
        reasons: ['Test'],
        confidence: 0.9,
        categories: [],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(chatId, 'Test', 'sender-1', 'Sender');
      });

      await waitFor(() => {
        expect(result.current.unresolvedAlerts.length).toBeGreaterThan(0);
      });

      // Разрешаем один алерт
      const alertId = result.current.alerts[0].id;
      await act(async () => {
        result.current.resolveAlert(alertId);
      });

      await waitFor(() => {
        const unresolvedCount = result.current.alerts.filter(
          (a) => !a.resolved
        ).length;
        expect(result.current.unresolvedAlerts.length).toBe(unresolvedCount);
      });
    });

    it('должен вычислять criticalAlerts', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');

      analyzeMessageWithAI.mockResolvedValue({
        riskLevel: 'critical' as RiskLevel,
        reasons: ['Critical'],
        confidence: 0.95,
        categories: [],
      });

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(chatId, 'Critical', 'sender-1', 'Sender');
      });

      await waitFor(() => {
        expect(result.current.criticalAlerts.length).toBeGreaterThan(0);
        expect(
          result.current.criticalAlerts.every((a) => a.riskLevel === 'critical')
        ).toBe(true);
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен использовать fallback анализ при ошибке AI', async () => {
      const { analyzeMessageWithAI } = require('@/constants/AIModerationService');
      const { evaluateMessageRisk } = require('@/utils/riskEvaluation');

      analyzeMessageWithAI.mockRejectedValueOnce(new Error('AI error'));

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(chatId, 'Test', 'sender-1', 'Sender');
      });

      await waitFor(() => {
        expect(evaluateMessageRisk).toHaveBeenCalled();
      });
    });

    it('должен обрабатывать ошибку при анализе изображения', async () => {
      const { analyzeImageWithAI } = require('@/constants/AIModerationService');
      const { evaluateImageRisk } = require('@/utils/riskEvaluation');

      analyzeImageWithAI.mockRejectedValueOnce(new Error('Image analysis error'));

      const { result } = renderHook(() => useMonitoring(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.chats.length).toBeGreaterThan(0);
      });

      const chatId = result.current.chats[0].id;

      await act(async () => {
        await result.current.addMessage(
          chatId,
          'Test',
          'sender-1',
          'Sender',
          'file://image.jpg'
        );
      });

      await waitFor(() => {
        expect(evaluateImageRisk).toHaveBeenCalled();
      });
    });
  });
});
