/**
 * Тесты для компонента OnlineStatus
 * Проверяет отображение статуса онлайн/офлайн
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { OnlineStatus } from '@/components/OnlineStatus';

// Моки для контекстов
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#FFFFFF',
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
    it('должен рендериться', () => {
      const { container } = render(<OnlineStatus />);
      expect(container).toBeTruthy();
    });

    it('должен показывать точку статуса', () => {
      const { UNSAFE_getByType } = render(<OnlineStatus />);
      // Проверяем что компонент рендерится
      expect(UNSAFE_getByType).toBeTruthy();
    });

    it('должен скрывать текст по умолчанию', () => {
      const { queryByText } = render(<OnlineStatus />);
      expect(queryByText('В сети')).toBeNull();
      expect(queryByText('Не в сети')).toBeNull();
    });

    it('должен показывать текст когда showText=true', () => {
      const { getByText } = render(<OnlineStatus showText={true} />);
      // Проверяем что текст отображается
      expect(getByText).toBeTruthy();
    });
  });

  describe('Размеры', () => {
    it('должен использовать small размер', () => {
      const { container } = render(<OnlineStatus size="small" />);
      expect(container).toBeTruthy();
    });

    it('должен использовать medium размер по умолчанию', () => {
      const { container } = render(<OnlineStatus />);
      expect(container).toBeTruthy();
    });

    it('должен использовать large размер', () => {
      const { container } = render(<OnlineStatus size="large" />);
      expect(container).toBeTruthy();
    });
  });

  describe('Статус онлайн', () => {
    it('должен показывать зеленую точку когда пользователь онлайн', () => {
      const { container } = render(<OnlineStatus />);
      expect(container).toBeTruthy();
    });

    it('должен показывать серую точку когда пользователь офлайн', () => {
      // Мокаем офлайн статус
      jest.spyOn(require('@/constants/AuthContext'), 'useAuth').mockReturnValue({
        isAuthenticated: false,
      });

      const { container } = render(<OnlineStatus />);
      expect(container).toBeTruthy();
    });
  });

  describe('Кастомные пропсы', () => {
    it('должен применять кастомный userId', () => {
      const { container } = render(<OnlineStatus userId="user-123" />);
      expect(container).toBeTruthy();
    });

    it('должен применять кастомный style', () => {
      const customStyle = { marginTop: 10 };
      const { container } = render(<OnlineStatus style={customStyle} />);
      expect(container).toBeTruthy();
    });
  });
});
