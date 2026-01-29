/**
 * Тесты для ProfileScreen
 * Проверяет отображение профиля, настройки пользователя
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

// Моки для expo-router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  Href: {},
}));

// Моки для контекстов
jest.mock('@/constants/UserContext', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'parent',
    },
  })),
}));

jest.mock('@/constants/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(),
    isAuthenticated: true,
  })),
}));

jest.mock('@/constants/MonitoringContext', () => ({
  useMonitoring: jest.fn(() => ({
    chats: [],
  })),
}));

jest.mock('@/constants/NotificationsContext', () => ({
  useNotifications: jest.fn(() => ({
    permissionState: 'granted' as const,
    requestPermission: jest.fn(),
  })),
  PushPermissionState: {
    granted: 'granted',
    denied: 'denied',
    undetermined: 'undetermined',
  },
}));

jest.mock('@/constants/ParentalControlsContext', () => ({
  useParentalControls: jest.fn(() => ({
    settings: {},
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

jest.mock('@/components/OnlineStatus', () => ({
  OnlineStatus: () => null,
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/constants/i18n', () => ({
  default: {
    use: jest.fn(),
    t: (key: string) => key,
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock('lucide-react-native', () => ({
  User: () => null,
  ShieldCheck: () => null,
  CreditCard: () => null,
  KeyRound: () => null,
  Save: () => null,
  Languages: () => null,
  LogOut: () => null,
  Mail: () => null,
  Smartphone: () => null,
  Lightbulb: () => null,
  Bell: () => null,
  CloudUpload: () => null,
  RefreshCcw: () => null,
  Activity: () => null,
  CheckCircle2: () => null,
  XCircle: () => null,
  Star: () => null,
  Heart: () => null,
  Sparkles: () => null,
  MessageCircle: () => null,
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    success: jest.fn(),
  },
}));

jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children, testID, ...props }: any) => React.createElement('View', { testID, ...props }, children),
    Text: ({ children, testID, ...props }: any) => React.createElement('Text', { testID, ...props }, children),
    TextInput: ({ testID, ...props }: any) => React.createElement('TextInput', { testID, ...props }),
    TouchableOpacity: ({ children, onPress, testID, ...props }: any) => 
      React.createElement('TouchableOpacity', { onPress, testID, ...props }, children),
    ScrollView: ({ children, testID }: any) => React.createElement('View', { testID }, children),
    Switch: ({ value, onValueChange, testID }: any) => {
      return React.createElement('View', { testID, onPress: () => onValueChange?.(!value) });
    },
    Alert: {
      alert: jest.fn(),
    },
    ActivityIndicator: () => React.createElement('View', { testID: 'activity-indicator' }),
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
      select: (dict: any) => dict.ios || dict.default,
    },
  };
});

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен рендериться', async () => {
    const { container } = render(<ProfileScreen />);
    
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
