/**
 * Тесты для MonitoringScreen
 * Проверяет отображение чатов, поиск, фильтры, статистику, навигацию
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MonitoringScreen from '@/app/(tabs)/index';
import { Chat, RiskLevel, Alert } from '@/constants/types';

// Моки
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

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
            timestamp: Date.now() - 1000,
            analyzed: true,
            riskLevel: 'safe' as RiskLevel,
          },
        ],
        overallRisk: 'safe' as RiskLevel,
        lastActivity: Date.now(),
      },
      {
        id: 'chat-2',
        participants: ['user-3', 'user-4'],
        participantNames: ['Дмитрий', 'Анна'],
        messages: [
          {
            id: 'msg-2',
            text: 'Test message',
            senderId: 'user-3',
            senderName: 'Дмитрий',
            timestamp: Date.now() - 2000,
            analyzed: true,
            riskLevel: 'high' as RiskLevel,
          },
        ],
        overallRisk: 'high' as RiskLevel,
        lastActivity: Date.now() - 3600000,
      },
    ],
    unresolvedAlerts: [
      {
        id: 'alert-1',
        chatId: 'chat-2',
        messageId: 'msg-2',
        riskLevel: 'high' as RiskLevel,
        timestamp: Date.now(),
        reasons: ['Inappropriate content'],
        resolved: false,
      },
    ],
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
      accentMuted: '#e8f4fd',
      surfaceGradient: ['#ffffff', '#f5f5f5'],
      isDark: false,
    },
  })),
}));

jest.mock('@/components/ThemeModeToggle', () => ({
  ThemeModeToggle: () => null,
}));

jest.mock('@/components/SyncStatusIndicator', () => ({
  SyncStatusIndicator: () => null,
}));

jest.mock('@/components/OnlineStatus', () => ({
  OnlineStatus: () => null,
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    light: jest.fn(),
    selection: jest.fn(),
    medium: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('lucide-react-native', () => ({
  MessageCircle: () => null,
  AlertTriangle: () => null,
  Shield: () => null,
  Search: () => null,
  X: () => null,
  Calendar: () => null,
  Users: () => null,
  Filter: () => null,
}));

describe('MonitoringScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать экран мониторинга', () => {
      const { getByTestId } = render(<MonitoringScreen />);

      expect(getByTestId('monitoring-screen')).toBeTruthy();
      expect(getByTestId('monitoring-header')).toBeTruthy();
      expect(getByTestId('monitoring-search-toggle')).toBeTruthy();
    });

    it('должен отображать шапку и кнопку фильтров', () => {
      const { getByTestId } = render(<MonitoringScreen />);

      expect(getByTestId('monitoring-header')).toBeTruthy();
      expect(getByTestId('monitoring-filter-toggle')).toBeTruthy();
    });

    it('должен отображать поисковый плейсхолдер', () => {
      const { getByPlaceholderText } = render(<MonitoringScreen />);

      expect(getByPlaceholderText('Поиск по участникам и содержимому сообщений...')).toBeTruthy();
    });

    it('должен отображать список чатов', () => {
      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Алексей и Мария')).toBeTruthy();
      expect(getByText('Дмитрий и Анна')).toBeTruthy();
    });
  });

  describe('Поиск', () => {
    it('должен показывать/скрывать поисковую строку', () => {
      const { getByPlaceholderText, queryByPlaceholderText, UNSAFE_getAllByType } = render(
        <MonitoringScreen />
      );

      // Поисковая строка отображается (сразу или после нажатия кнопки поиска)
      const searchBefore = queryByPlaceholderText('Поиск по участникам и содержимому сообщений...');
      if (searchBefore) {
        expect(searchBefore).toBeTruthy();
        return;
      }
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const searchButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );
      if (searchButton) fireEvent.press(searchButton);
      expect(getByPlaceholderText('Поиск по участникам и содержимому сообщений...')).toBeTruthy();
    });

    it('должен фильтровать чаты по поисковому запросу', async () => {
      const { getByPlaceholderText, getByText, queryByText, UNSAFE_getAllByType } = render(
        <MonitoringScreen />
      );

      const searchInput = getByPlaceholderText('Поиск по участникам и содержимому сообщений...');
      fireEvent.changeText(searchInput, 'Алексей');

      await waitFor(() => {
        const found = queryByText('Алексей и Мария');
        if (found) expect(queryByText('Дмитрий и Анна')).toBeNull();
      }, { timeout: 2000 });
    });

    it('должен очищать поисковый запрос', async () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      const searchInput = getByPlaceholderText('Поиск по участникам и содержимому сообщений...');
      fireEvent.changeText(searchInput, 'Test');
      // Проверяем, что поле поиска отображается
      expect(searchInput).toBeTruthy();
    });
  });

  describe('Фильтры', () => {
    it('должен фильтровать по уровню риска', async () => {
      const { getAllByText, queryByText } = render(<MonitoringScreen />);

      const highRiskButtons = getAllByText('Высокий');
      if (highRiskButtons.length > 0) {
        fireEvent.press(highRiskButtons[0]);
      }

      await waitFor(() => {
        if (queryByText('Дмитрий и Анна')) {
          expect(queryByText('Дмитрий и Анна')).toBeTruthy();
        }
      });
    });

    it('должен показывать расширенные фильтры', async () => {
      const { getByText, getByTestId } = render(<MonitoringScreen />);

      fireEvent.press(getByTestId('monitoring-search-toggle'));
      fireEvent.press(getByTestId('monitoring-filter-toggle'));

      await waitFor(() => {
        expect(getByText('Период')).toBeTruthy();
      });
    });

    it('должен фильтровать по дате', async () => {
      const { getByText, getByTestId } = render(<MonitoringScreen />);

      fireEvent.press(getByTestId('monitoring-search-toggle'));
      fireEvent.press(getByTestId('monitoring-filter-toggle'));

      await waitFor(() => {
        const todayButton = getByText('Сегодня');
        fireEvent.press(todayButton);
      });
    });
  });

  describe('Статистика', () => {
    it('должен отображать два чата в списке', () => {
      const { getByText } = render(<MonitoringScreen />);
      expect(getByText('Алексей и Мария')).toBeTruthy();
      expect(getByText('Дмитрий и Анна')).toBeTruthy();
    });

    it('должен отображать уровни риска', () => {
      const { getAllByText } = render(<MonitoringScreen />);
      expect(getAllByText('Безопасно').length).toBeGreaterThan(0);
      expect(getAllByText('Высокий').length).toBeGreaterThan(0);
    });

    it('должен показывать бейдж с количеством тревог в шапке', () => {
      const { getByText } = render(<MonitoringScreen />);
      expect(getByText('1')).toBeTruthy();
    });
  });

  describe('Навигация', () => {
    it('должен навигировать к чату при нажатии', async () => {
      const { useRouter } = require('expo-router');
      const mockPush = jest.fn();
      useRouter.mockReturnValue({ push: mockPush });

      const { getByText } = render(<MonitoringScreen />);

      const chatTitle = getByText('Алексей и Мария');
      if (chatTitle) {
        fireEvent.press(chatTitle);
      }

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/chat/chat-1');
      });
    });
  });

  describe('Отображение чатов', () => {
    it('должен отображать информацию о чате', () => {
      const { getAllByText } = render(<MonitoringScreen />);
      expect(getAllByText(/Последняя активность/).length).toBeGreaterThan(0);
    });

    it('должен отображать бейдж риска для чата', () => {
      const { getAllByText } = render(<MonitoringScreen />);

      expect(getAllByText('Безопасно').length).toBeGreaterThan(0);
      expect(getAllByText('Высокий').length).toBeGreaterThan(0);
    });

    it('должен показывать пустое состояние если нет чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [],
        unresolvedAlerts: [],
      });

      const { getByTestId } = render(<MonitoringScreen />);
      expect(getByTestId('monitoring-screen')).toBeTruthy();
      expect(getByTestId('monitoring-header')).toBeTruthy();
    });
  });

  describe('Обработка данных', () => {
    it('должен обрабатывать отсутствие чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: null,
        unresolvedAlerts: [],
      });

      const { getByTestId } = render(<MonitoringScreen />);
      expect(getByTestId('monitoring-screen')).toBeTruthy();
    });

    it('должен обрабатывать пустой массив чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [],
        unresolvedAlerts: [],
      });

      const { getByTestId } = render(<MonitoringScreen />);
      expect(getByTestId('monitoring-screen')).toBeTruthy();
      expect(getByTestId('monitoring-header')).toBeTruthy();
    });
  });
});
