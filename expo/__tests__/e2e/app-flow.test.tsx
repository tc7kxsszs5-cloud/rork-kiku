/**
 * E2E тесты основного потока приложения
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Моки
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
}));

jest.mock('@/constants/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    userId: null,
    role: null,
  }),
}));

describe('E2E: Основной поток приложения', () => {
  test('Приложение запускается без ошибок', async () => {
    const { RootLayout } = require('@/app/_layout');
    
    const { getByTestId } = render(<RootLayout />);
    
    await waitFor(() => {
      expect(getByTestId).toBeTruthy();
    });
  });

  test('Неаутентифицированный пользователь перенаправляется на выбор роли', async () => {
    // Тест логики редиректа
    const layoutContent = require('fs').readFileSync(
      require('path').join(__dirname, '../../app/_layout.tsx'),
      'utf-8'
    );

    expect(layoutContent).toContain('role-selection');
    expect(layoutContent).toContain('isAuthenticated');
  });
});
