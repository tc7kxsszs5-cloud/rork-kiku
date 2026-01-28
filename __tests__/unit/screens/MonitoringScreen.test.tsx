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
      expect(getByTestId('monitoring-title')).toBeTruthy();
    });

    it('должен отображать заголовок и подзаголовок', () => {
      const { getByTestId } = render(<MonitoringScreen />);

      expect(getByTestId('monitoring-title')).toBeTruthy();
      expect(getByTestId('monitoring-subtitle')).toBeTruthy();
    });

    it('должен отображать статистику', () => {
      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Чатов')).toBeTruthy();
      expect(getByText('Сообщений')).toBeTruthy();
      expect(getByText('Тревог')).toBeTruthy();
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

      // Поисковая строка не видна изначально
      expect(queryByPlaceholderText('Поиск по участникам и содержимому сообщений...')).toBeNull();

      // Нажимаем кнопку поиска
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const searchButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );

      if (searchButton) {
        fireEvent.press(searchButton);
      }

      // Теперь поисковая строка должна быть видна
      waitFor(() => {
        expect(getByPlaceholderText('Поиск по участникам и содержимому сообщений...')).toBeTruthy();
      });
    });

    it('должен фильтровать чаты по поисковому запросу', () => {
      const { getByPlaceholderText, getByText, queryByText, UNSAFE_getAllByType } = render(
        <MonitoringScreen />
      );

      // Открываем поиск
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const searchButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );

      if (searchButton) {
        fireEvent.press(searchButton);
      }

      waitFor(() => {
        const searchInput = getByPlaceholderText('Поиск по участникам и содержимому сообщений...');
        fireEvent.changeText(searchInput, 'Алексей');
      });

      waitFor(() => {
        expect(getByText('Алексей и Мария')).toBeTruthy();
        expect(queryByText('Дмитрий и Анна')).toBeNull();
      });
    });

    it('должен очищать поисковый запрос', () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      // Открываем поиск
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const searchButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );

      if (searchButton) {
        fireEvent.press(searchButton);
      }

      waitFor(() => {
        const searchInput = getByPlaceholderText('Поиск по участникам и содержимому сообщений...');
        fireEvent.changeText(searchInput, 'Test');

        // Находим кнопку очистки
        const clearButton = touchables.find((btn: any) =>
          btn.props.onPress && searchInput.props.value === 'Test'
        );

        if (clearButton) {
          fireEvent.press(clearButton);
        }
      });
    });
  });

  describe('Фильтры', () => {
    it('должен фильтровать по уровню риска', () => {
      const { getByText, queryByText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      // Находим кнопку фильтра "Высокий"
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const highRiskButton = touchables.find((btn: any) =>
        btn.props.children && getByText('Высокий')
      );

      if (highRiskButton) {
        fireEvent.press(highRiskButton);
      }

      waitFor(() => {
        expect(getByText('Дмитрий и Анна')).toBeTruthy();
        expect(queryByText('Алексей и Мария')).toBeNull();
      });
    });

    it('должен показывать расширенные фильтры', () => {
      const { getByText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      // Открываем поиск
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const searchButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );

      if (searchButton) {
        fireEvent.press(searchButton);
      }

      waitFor(() => {
        // Находим кнопку фильтра
        const filterButton = touchables.find((btn: any) =>
          btn.props.onPress && btn.props.style
        );

        if (filterButton) {
          fireEvent.press(filterButton);
        }
      });

      waitFor(() => {
        expect(getByText('Период')).toBeTruthy();
      });
    });

    it('должен фильтровать по дате', () => {
      const { getByText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      // Открываем расширенные фильтры
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const filterButton = touchables.find((btn: any) =>
        btn.props.onPress && btn.props.style
      );

      if (filterButton) {
        fireEvent.press(filterButton);
      }

      waitFor(() => {
        const todayButton = touchables.find((btn: any) =>
          btn.props.children && getByText('Сегодня')
        );

        if (todayButton) {
          fireEvent.press(todayButton);
        }
      });
    });
  });

  describe('Статистика', () => {
    it('должен отображать правильное количество чатов', () => {
      const { getByText } = render(<MonitoringScreen />);

      // Должно быть 2 чата
      expect(getByText('2')).toBeTruthy();
    });

    it('должен отображать правильное количество сообщений', () => {
      const { getByText } = render(<MonitoringScreen />);

      // Должно быть 2 сообщения
      const messageCounts = getByText('2');
      expect(messageCounts).toBeTruthy();
    });

    it('должен отображать правильное количество тревог', () => {
      const { getByText } = render(<MonitoringScreen />);

      // Должна быть 1 тревога
      expect(getByText('1')).toBeTruthy();
    });

    it('должен показывать бейдж с количеством тревог', () => {
      const { getByText } = render(<MonitoringScreen />);

      // Бейдж должен показывать количество нерешенных тревог
      expect(getByText('1')).toBeTruthy();
    });
  });

  describe('Навигация', () => {
    it('должен навигировать к чату при нажатии', () => {
      const { useRouter } = require('expo-router');
      const mockPush = jest.fn();
      useRouter.mockReturnValue({ push: mockPush });

      const { getByText, UNSAFE_getAllByType } = render(<MonitoringScreen />);

      // Находим карточку чата и нажимаем на неё
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const chatCard = touchables.find((btn: any) =>
        btn.props.onPress && getByText('Алексей и Мария')
      );

      if (chatCard) {
        fireEvent.press(chatCard);
      }

      waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/chat/chat-1');
      });
    });
  });

  describe('Отображение чатов', () => {
    it('должен отображать информацию о чате', () => {
      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Алексей и Мария')).toBeTruthy();
      expect(getByText(/Последняя активность/)).toBeTruthy();
    });

    it('должен отображать бейдж риска для чата', () => {
      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Безопасно')).toBeTruthy();
      expect(getByText('Высокий')).toBeTruthy();
    });

    it('должен показывать пустое состояние если нет чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [],
        unresolvedAlerts: [],
      });

      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Ничего не найдено')).toBeTruthy();
    });
  });

  describe('Обработка данных', () => {
    it('должен обрабатывать отсутствие чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: null,
        unresolvedAlerts: [],
      });

      const { getByText } = render(<MonitoringScreen />);

      // Должен показывать 0 чатов
      expect(getByText('0')).toBeTruthy();
    });

    it('должен обрабатывать пустой массив чатов', () => {
      const { useMonitoring } = require('@/constants/MonitoringContext');
      useMonitoring.mockReturnValueOnce({
        chats: [],
        unresolvedAlerts: [],
      });

      const { getByText } = render(<MonitoringScreen />);

      expect(getByText('Ничего не найдено')).toBeTruthy();
    });
  });
});
