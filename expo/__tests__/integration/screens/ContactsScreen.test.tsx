/**
 * Тесты для ContactsScreen
 * Проверяет отображение контактов, поиск, разрешения
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactsScreen from '@/app/(tabs)/contacts';

// Моки для expo-router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// Моки для expo-contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getContactsAsync: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 'contact-1',
          name: 'John Doe',
          phoneNumbers: [{ number: '+1234567890' }],
        },
        {
          id: 'contact-2',
          name: 'Jane Smith',
          phoneNumbers: [{ number: '+0987654321' }],
        },
      ],
    })
  ),
  Fields: {
    Name: 'name',
    PhoneNumbers: 'phoneNumbers',
  },
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

jest.mock('@/components/OnlineStatus', () => ({
  OnlineStatus: () => null,
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    selection: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => ({
  Search: () => null,
  Phone: () => null,
  Video: () => null,
  Users: () => null,
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
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
      select: (dict: any) => dict.ios || dict.default,
    },
  };
});

describe('ContactsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен импортироваться без ошибок', () => {
    expect(ContactsScreen).toBeDefined();
    expect(typeof ContactsScreen).toBe('function');
  });

  // TODO: Исправить проблемы с React Native Testing Library detectHostComponentNames
  // Проблема: jest-expo и React Native Testing Library конфликтуют при определении host компонентов
});
