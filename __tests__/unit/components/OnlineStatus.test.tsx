/**
 * Тесты для OnlineStatus
 * Проверяет отображение статуса онлайн/офлайн, размеры, текст
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { OnlineStatus } from '@/components/OnlineStatus';

// Моки
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#ffffff',
      textSecondary: '#666666',
    },
  })),
}));

jest.mock('@/constants/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: true,
  })),
}));

describe('OnlineStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать компонент статуса', () => {
      const { UNSAFE_getByType } = render(<OnlineStatus />);
      const view = UNSAFE_getByType('View');
      expect(view).toBeTruthy();
    });

    it('должен показывать зеленый кружок когда пользователь онлайн', () => {
      const { useAuth } = require('@/constants/AuthContext');
      useAuth.mockReturnValue({ isAuthenticated: true });

      const { UNSAFE_getByType } = render(<OnlineStatus />);
      const dot = UNSAFE_getByType('View').props.children.find(
        (child: any) => child?.props?.style?.backgroundColor === '#22c55e'
      );
      expect(dot).toBeTruthy();
    });

    it('должен показывать серый кружок когда пользователь офлайн', () => {
      const { useAuth } = require('@/constants/AuthContext');
      useAuth.mockReturnValue({ isAuthenticated: false });

      const { UNSAFE_getByType } = render(<OnlineStatus />);
      const dot = UNSAFE_getByType('View').props.children.find(
        (child: any) => child?.props?.style?.backgroundColor === '#9ca3af'
      );
      expect(dot).toBeTruthy();
    });
  });

  describe('Размеры', () => {
    it('должен использовать размер small', () => {
      const { UNSAFE_getByType } = render(<OnlineStatus size="small" />);
      const dot = UNSAFE_getByType('View').props.children.find(
        (child: any) => child?.props?.style?.width === 8
      );
      expect(dot).toBeTruthy();
    });

    it('должен использовать размер medium по умолчанию', () => {
      const { UNSAFE_getByType } = render(<OnlineStatus />);
      const dot = UNSAFE_getByType('View').props.children.find(
        (child: any) => child?.props?.style?.width === 12
      );
      expect(dot).toBeTruthy();
    });

    it('должен использовать размер large', () => {
      const { UNSAFE_getByType } = render(<OnlineStatus size="large" />);
      const dot = UNSAFE_getByType('View').props.children.find(
        (child: any) => child?.props?.style?.width === 16
      );
      expect(dot).toBeTruthy();
    });
  });

  describe('Текст статуса', () => {
    it('не должен показывать текст по умолчанию', () => {
      const { queryByText } = render(<OnlineStatus />);
      expect(queryByText('В сети')).toBeNull();
      expect(queryByText('Не в сети')).toBeNull();
    });

    it('должен показывать текст "В сети" когда showText=true и пользователь онлайн', () => {
      const { useAuth } = require('@/constants/AuthContext');
      useAuth.mockReturnValue({ isAuthenticated: true });

      const { getByText } = render(<OnlineStatus showText={true} />);
      expect(getByText('В сети')).toBeTruthy();
    });

    it('должен показывать текст "Не в сети" когда showText=true и пользователь офлайн', () => {
      const { useAuth } = require('@/constants/AuthContext');
      useAuth.mockReturnValue({ isAuthenticated: false });

      const { getByText } = render(<OnlineStatus showText={true} />);
      expect(getByText('Не в сети')).toBeTruthy();
    });
  });

  describe('Стилизация', () => {
    it('должен применять переданный style', () => {
      const customStyle = { marginTop: 10 };
      const { UNSAFE_getByType } = render(<OnlineStatus style={customStyle} />);
      const container = UNSAFE_getByType('View');
      expect(container.props.style).toContainEqual(customStyle);
    });
  });
});
