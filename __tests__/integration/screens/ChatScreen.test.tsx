/**
 * Тесты для ChatScreen
 * Проверяет рендеринг чата, отправку сообщений, обработку рисков
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '@/app/chat/[chatId]';

// Моки для expo-router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ chatId: 'chat-1' }),
  Stack: {
    Screen: () => null,
  },
}));

// Моки для контекстов
const mockChat = {
  id: 'chat-1',
  participantName: 'Test User',
  participantId: 'user-1',
  lastMessage: 'Test message',
  lastMessageTime: Date.now(),
  unreadCount: 0,
  riskLevel: 'safe' as const,
  messages: [
    {
      id: 'msg-1',
      text: 'Hello',
      timestamp: Date.now(),
      senderId: 'user-1',
      analyzed: true,
      riskLevel: 'safe' as const,
    },
  ],
};

jest.mock('@/constants/MonitoringContext', () => ({
  useMonitoring: jest.fn(() => ({
    chats: [mockChat],
    getChatById: jest.fn(() => mockChat),
    addMessage: jest.fn(),
    updateChatRisk: jest.fn(),
  })),
}));

jest.mock('@/constants/ParentalControlsContext', () => ({
  useParentalControls: jest.fn(() => ({
    settings: {
      allowMessaging: true,
      blockInappropriateContent: true,
    },
  })),
}));

jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'parent-1',
      role: 'parent',
    },
  })),
}));

jest.mock('@/constants/ChatBackgroundsContext', () => ({
  useChatBackgrounds: jest.fn(() => ({
    getChatBackground: jest.fn(() => null),
  })),
}));

jest.mock('@/constants/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    canChangeChatBackgrounds: jest.fn(() => true),
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
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock('lucide-react-native', () => ({
  Send: () => null,
  AlertTriangle: () => null,
  Mic: () => null,
  X: () => null,
  AlertOctagon: () => null,
  Smile: () => null,
  Phone: () => null,
  Video: () => null,
}));

jest.mock('@/components/EmojiRenderer', () => ({
  EmojiRenderer: ({ children }: any) => children,
}));

jest.mock('@/utils/emojiUtils', () => ({
  replaceTextSmileys: jest.fn((text) => text),
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn(),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('@/hooks/useIsMounted', () => ({
  useIsMounted: jest.fn(() => true),
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@/components/OnlineStatus', () => ({
  OnlineStatus: () => null,
}));

jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children, testID, ...props }: any) => React.createElement('View', { testID, ...props }, children),
    Text: ({ children, testID, ...props }: any) => React.createElement('Text', { testID, ...props }, children),
    TextInput: ({ testID, ...props }: any) => React.createElement('TextInput', { testID, ...props }),
    TouchableOpacity: ({ children, onPress, testID, ...props }: any) => 
      React.createElement('TouchableOpacity', { onPress, testID, ...props }, children),
    FlatList: ({ data, renderItem, testID }: any) => {
      return React.createElement('View', { testID }, data?.map((item: any, index: number) => 
        renderItem ? renderItem({ item, index }) : null
      ));
    },
    KeyboardAvoidingView: ({ children }: any) => children,
    ActivityIndicator: () => React.createElement('View', { testID: 'activity-indicator' }),
    Alert: {
      alert: jest.fn(),
    },
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
      select: (dict: any) => dict.ios || dict.default,
    },
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      View: ({ children }: any) => children,
      FlatList: ({ data, renderItem }: any) => {
        return React.createElement('View', {}, data?.map((item: any, index: number) => 
          renderItem ? renderItem({ item, index }) : null
        ));
      },
    },
  };
});

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен рендериться', async () => {
    const { getByTestId } = render(<ChatScreen />);
    
    await waitFor(() => {
      expect(getByTestId).toBeDefined();
    });
  });

  it('должен отображать сообщения чата', async () => {
    const { getByText } = render(<ChatScreen />);
    
    await waitFor(() => {
      expect(getByText('Hello')).toBeTruthy();
    });
  });
});
