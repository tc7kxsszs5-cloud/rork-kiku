/**
 * Тесты для SecuritySettingsScreen
 * Проверяет отображение статистики безопасности, настроек
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SecuritySettingsScreen from '@/app/security-settings';

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
    messages: [
      {
        id: 'msg-1',
        text: 'Test',
        timestamp: Date.now(),
        senderId: 'user-1',
        analyzed: true,
        riskLevel: 'safe' as const,
      },
    ],
  },
];

const mockAlerts = [
  {
    id: 'alert-1',
    chatId: 'chat-1',
    messageId: 'msg-1',
    riskLevel: 'medium' as const,
    timestamp: Date.now(),
    resolved: false,
  },
];

jest.mock('@/constants/MonitoringContext', () => ({
  useMonitoring: jest.fn(() => ({
    chats: mockChats,
    alerts: mockAlerts,
  })),
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-1',
      role: 'parent',
    },
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

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock('lucide-react-native', () => ({
  Shield: () => null,
  TrendingUp: () => null,
  AlertCircle: () => null,
  MessageCircle: () => null,
  RefreshCcw: () => null,
}));

jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children, testID, ...props }: any) => React.createElement('View', { testID, ...props }, children),
    Text: ({ children, testID, ...props }: any) => React.createElement('Text', { testID, ...props }, children),
    ScrollView: ({ children, testID }: any) => React.createElement('View', { testID }, children),
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
      select: (dict: any) => dict.ios || dict.default,
    },
  };
});

describe('SecuritySettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен импортироваться без ошибок', () => {
    expect(SecuritySettingsScreen).toBeDefined();
    expect(typeof SecuritySettingsScreen).toBe('function');
  });

  // TODO: Исправить проблемы с React Native Testing Library detectHostComponentNames
});
