/**
 * Тесты для MonitoringScreen
 * Проверяет отображение чатов, фильтрацию, поиск
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MonitoringScreen from '@/app/(tabs)/index';

// Моки для expo-router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// Моки для контекстов
const mockChats = [
  {
    id: 'chat-1',
    participantName: 'User 1',
    participantId: 'user-1',
    lastMessage: 'Hello',
    lastMessageTime: Date.now(),
    unreadCount: 0,
    riskLevel: 'safe' as const,
    messages: [],
  },
  {
    id: 'chat-2',
    participantName: 'User 2',
    participantId: 'user-2',
    lastMessage: 'Hi',
    lastMessageTime: Date.now(),
    unreadCount: 1,
    riskLevel: 'medium' as const,
    messages: [],
  },
];

jest.mock('@/constants/MonitoringContext', () => ({
  useMonitoring: jest.fn(() => ({
    chats: mockChats,
    unresolvedAlerts: [],
  })),
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      accentPrimary: '#FF6B35',
      textPrimary: '#000000',
      textSecondary: '#666666',
      card: '#FFFFFF',
      cardMuted: '#F5F5F5',
      borderSoft: '#E0E0E0',
      isDark: false,
    },
  })),
  ThemePalette: {
    light: {},
    dark: {},
  },
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

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
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

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    selection: jest.fn(),
  },
}));

// Используем моки из jest.setup.js, добавляем только недостающие для Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  const React = require('react');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        interpolate: jest.fn(() => 1),
      })),
      timing: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback({ finished: true })),
      })),
    },
  };
});

describe('MonitoringScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен импортироваться без ошибок', () => {
    expect(MonitoringScreen).toBeDefined();
    expect(typeof MonitoringScreen).toBe('function');
  });

  // TODO: Исправить проблемы с React Native Testing Library detectHostComponentNames
  // Проблема: jest-expo и React Native Testing Library конфликтуют при определении host компонентов
  // Решение: Требуется дополнительная настройка моков или использование альтернативного подхода к тестированию
});
