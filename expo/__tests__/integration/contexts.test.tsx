/**
 * Тесты основных контекстов
 * Проверяет что контексты инициализируются без ошибок
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider, useThemeMode } from '@/constants/ThemeContext';
import { UserProvider, useUser } from '@/constants/UserContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Контексты', () => {
  test('ThemeContext инициализируется без ошибок', async () => {
    const TestComponent = () => {
      const theme = useThemeMode();
      return <Text>Test - {theme ? 'Hook loaded' : 'Hook empty'}</Text>;
    };

    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test -/)).toBeTruthy();
    }, { timeout: 5000 });
  });

  test('UserContext инициализируется без ошибок', async () => {
    const TestComponent = () => {
      const user = useUser();
      return <Text>Test - {user ? 'Hook loaded' : 'Hook empty'}</Text>;
    };

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(getByText(/Test -/)).toBeTruthy();
    }, { timeout: 5000 });
  });
});
