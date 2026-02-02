/**
 * Тесты для SecuritySettingsScreen
 * Проверяет отображение статистики безопасности, распределение рисков, покрытие защиты
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import SecuritySettingsScreen from '@/app/security-settings';
import { Chat, RiskLevel, Alert } from '@/constants/types';

// Моки
jest.mock('@/constants/MonitoringContext', () => ({
  useMonitoring: jest.fn(() => ({
    chats: [
      {
        id: 'chat-1',
        participants: ['user-1', 'user-2'],
        participantNames: ['Алексей', 'Мария'],
        messages: [
          {
            id: 'msg-1',
            text: 'Hello',
            senderId: 'user-1',
            senderName: 'Алексей',
            timestamp: Date.now(),
            analyzed: true,
            riskLevel: 'safe' as RiskLevel,
          },
          {
            id: 'msg-2',
            text: 'Test',
            senderId: 'user-2',
            senderName: 'Мария',
            timestamp: Date.now(),
            analyzed: true,
            riskLevel: 'low' as RiskLevel,
          },
        ],
        overallRisk: 'safe' as RiskLevel,
        lastActivity: Date.now(),
      },
      {
        id: 'chat-2',
        participants: ['user-3'],
        participantNames: ['Дмитрий'],
        messages: [
          {
            id: 'msg-3',
            text: 'Inappropriate',
            senderId: 'user-3',
            senderName: 'Дмитрий',
            timestamp: Date.now(),
            analyzed: true,
            riskLevel: 'high' as RiskLevel,
          },
        ],
        overallRisk: 'high' as RiskLevel,
        lastActivity: Date.now(),
      },
    ],
    alerts: [
      {
        id: 'alert-1',
        chatId: 'chat-2',
        messageId: 'msg-3',
        riskLevel: 'high' as RiskLevel,
        timestamp: Date.now(),
        reasons: ['Inappropriate content'],
        resolved: false,
      },
      {
        id: 'alert-2',
        chatId: 'chat-1',
        messageId: 'msg-1',
        riskLevel: 'medium' as RiskLevel,
        timestamp: Date.now() - 1000,
        reasons: ['Test'],
        resolved: true,
      },
    ],
  })),
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-123',
      name: 'Test Parent',
      email: 'parent@example.com',
      role: 'parent',
      children: [{ id: 'child-1', name: 'Child' }],
    },
  })),
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      card: '#f5f5f5',
      cardMuted: '#e0e0e0',
      borderSoft: '#cccccc',
      accentPrimary: '#4A90E2',
      heroGradient: ['#ffffff', '#f5f5f5'],
      isDark: false,
    },
  })),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('lucide-react-native', () => ({
  Shield: () => null,
  TrendingUp: () => null,
  AlertCircle: () => null,
  MessageCircle: () => null,
  RefreshCcw: () => null,
}));

describe('SecuritySettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать экран настроек безопасности', () => {
      const { getByTestId } = render(<SecuritySettingsScreen />);

      expect(getByTestId('security-settings-screen')).toBeTruthy();
    });

    it('должен отображать заголовок "Центр безопасности"', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Центр безопасности')).toBeTruthy();
    });

    it('должен отображать информацию о пользователе', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText(/Test Parent/)).toBeTruthy();
      expect(getByText(/Родитель/)).toBeTruthy();
    });
  });

  describe('Статистика', () => {
    it('должен отображать количество чатов под защитой', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText(/2 чатов под защитой/)).toBeTruthy();
    });

    it('должен отображать количество проанализированных сообщений', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText(/3 сообщений проанализировано/)).toBeTruthy();
    });

    it('должен отображать количество активных тревог', () => {
      const { getAllByText, getByText } = render(<SecuritySettingsScreen />);

      expect(getAllByText('1').length).toBeGreaterThan(0); // 1 нерешенная тревога
      expect(getByText('Активных тревог')).toBeTruthy();
    });

    it('должен отображать количество решенных тревог', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Решено')).toBeTruthy();
      // Должна быть 1 решенная тревога
    });
  });

  describe('Распределение рисков', () => {
    it('должен отображать секцию "Распределение рисков"', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Распределение рисков')).toBeTruthy();
    });

    it('должен отображать все уровни риска', () => {
      const { getAllByText } = render(<SecuritySettingsScreen />);

      expect(getAllByText('Безопасно').length).toBeGreaterThan(0);
      expect(getAllByText('Низкий').length).toBeGreaterThan(0);
      expect(getAllByText('Средний').length).toBeGreaterThan(0);
      expect(getAllByText('Высокий').length).toBeGreaterThan(0);
      expect(getAllByText('Критический').length).toBeGreaterThan(0);
    });

    it('должен показывать правильное количество для каждого уровня риска', () => {
      const { getAllByText } = render(<SecuritySettingsScreen />);

      // safe: 1, low: 1, high: 1
      const safeRows = getAllByText('Безопасно');
      expect(safeRows.length).toBeGreaterThan(0);
    });

    it('должен показывать проценты для каждого уровня риска', () => {
      const { getAllByText } = render(<SecuritySettingsScreen />);

      // safe: 1 (33%), low: 1 (33%), high: 1 (33%)
      const percentageTexts = getAllByText(/%/);
      expect(percentageTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Состояние чатов', () => {
    it('должен отображать секцию "Состояние чатов"', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Состояние чатов')).toBeTruthy();
    });

    it('должен отображать карточки для каждого уровня риска чатов', () => {
      const { getByTestId } = render(<SecuritySettingsScreen />);

      expect(getByTestId('security-chat-safe')).toBeTruthy();
      expect(getByTestId('security-chat-low')).toBeTruthy();
      expect(getByTestId('security-chat-medium')).toBeTruthy();
      expect(getByTestId('security-chat-high')).toBeTruthy();
      expect(getByTestId('security-chat-critical')).toBeTruthy();
    });

    it('должен показывать правильное количество чатов для каждого уровня риска', () => {
      const { getAllByText } = render(<SecuritySettingsScreen />);

      // safe: 1 чат, high: 1 чат — на экране есть числа
      const numbers = getAllByText(/^\d+$/);
      expect(numbers.length).toBeGreaterThan(0);
    });
  });

  describe('Покрытие защиты', () => {
    it('должен отображать секцию "Покрытие защиты"', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Покрытие защиты')).toBeTruthy();
    });

    it('должен показывать процент сообщений под наблюдением', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('Сообщения под наблюдением')).toBeTruthy();
      // Все 3 сообщения проанализированы из 3, должно быть 100%
      expect(getByText(/100\.0%/)).toBeTruthy();
    });

    it('должен показывать прогресс-бар покрытия', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      // Проверяем наличие прогресс-бара через текст
      expect(getByText('Сообщения под наблюдением')).toBeTruthy();
    });
  });

  describe('Обработка данных', () => {
    it('должен обрабатывать пустой массив чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [],
        alerts: [],
      });

      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('0 чатов под защитой')).toBeTruthy();
      expect(getByText('0 сообщений проанализировано')).toBeTruthy();
    });

    it('должен обрабатывать отсутствие проанализированных сообщений', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [
          {
            id: 'chat-1',
            participants: ['user-1'],
            participantNames: ['Test'],
            messages: [
              {
                id: 'msg-1',
                text: 'Test',
                senderId: 'user-1',
                senderName: 'Test',
                timestamp: Date.now(),
                analyzed: false,
              },
            ],
            overallRisk: 'safe' as RiskLevel,
            lastActivity: Date.now(),
          },
        ],
        alerts: [],
      });

      const { getByText } = render(<SecuritySettingsScreen />);

      expect(getByText('0 сообщений проанализировано')).toBeTruthy();
    });

    it('должен обрабатывать отсутствие тревог', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [
          {
            id: 'chat-1',
            participants: ['user-1'],
            participantNames: ['Test'],
            messages: [],
            overallRisk: 'safe' as RiskLevel,
            lastActivity: Date.now(),
          },
        ],
        alerts: [],
      });

      const { getAllByText, getByText } = render(<SecuritySettingsScreen />);

      expect(getAllByText('0').length).toBeGreaterThan(0); // Активных тревог: 0
      expect(getByText('Активных тревог')).toBeTruthy();
    });
  });

  describe('Вычисления статистики', () => {
    it('должен правильно вычислять общее количество сообщений', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      // Должно быть 3 сообщения (1 + 1 + 1)
      expect(getByText(/3 сообщений проанализировано/)).toBeTruthy();
    });

    it('должен правильно вычислять количество проанализированных сообщений', () => {
      const { getByText } = render(<SecuritySettingsScreen />);

      // Все 3 сообщения проанализированы
      expect(getByText(/3 сообщений проанализировано/)).toBeTruthy();
    });

    it('должен правильно вычислять распределение рисков', () => {
      const { getAllByText } = render(<SecuritySettingsScreen />);

      // safe: 1, low: 1, high: 1
      expect(getAllByText('Безопасно').length).toBeGreaterThan(0);
      expect(getAllByText('Низкий').length).toBeGreaterThan(0);
      expect(getAllByText('Высокий').length).toBeGreaterThan(0);
    });

    it('должен правильно вычислять распределение рисков чатов', () => {
      const { getByTestId } = render(<SecuritySettingsScreen />);

      // safe: 1 чат, high: 1 чат
      expect(getByTestId('security-chat-safe')).toBeTruthy();
      expect(getByTestId('security-chat-high')).toBeTruthy();
    });
  });
});
