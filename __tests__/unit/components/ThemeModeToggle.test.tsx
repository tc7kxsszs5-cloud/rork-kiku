/**
 * Тесты для ThemeModeToggle
 * Проверяет переключение темы, варианты отображения, иконки
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeModeToggle } from '@/components/ThemeModeToggle';

// Моки
jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    themeMode: 'sunrise',
    toggleThemeMode: jest.fn(),
    theme: {
      chipBackground: '#ffffff',
      chipText: '#000000',
      accentPrimary: '#4A90E2',
    },
  })),
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    selection: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => ({
  Sun: () => null,
  Moon: () => null,
}));

describe('ThemeModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать компонент переключения темы', () => {
      const { getByTestId } = render(<ThemeModeToggle />);
      expect(getByTestId('theme-toggle-button')).toBeTruthy();
    });

    it('должен использовать кастомный testID', () => {
      const { getByTestId } = render(<ThemeModeToggle testID="custom-toggle" />);
      expect(getByTestId('custom-toggle')).toBeTruthy();
    });

    it('должен показывать "День" в compact режиме для sunrise темы', () => {
      const { getByText } = render(<ThemeModeToggle variant="compact" />);
      expect(getByText('День')).toBeTruthy();
    });

    it('должен показывать "Светлый режим" в expanded режиме для sunrise темы', () => {
      const { getByText } = render(<ThemeModeToggle variant="expanded" />);
      expect(getByText('Светлый режим')).toBeTruthy();
    });

    it('должен показывать "Ночь" в compact режиме для midnight темы', () => {
      const { useThemeMode } = require('@/constants/ThemeContext');
      useThemeMode.mockReturnValue({
        themeMode: 'midnight',
        toggleThemeMode: jest.fn(),
        theme: {
          chipBackground: '#000000',
          chipText: '#ffffff',
          accentPrimary: '#4A90E2',
        },
      });

      const { getByText } = render(<ThemeModeToggle variant="compact" />);
      expect(getByText('Ночь')).toBeTruthy();
    });

    it('должен показывать "Ночной режим" в expanded режиме для midnight темы', () => {
      const { useThemeMode } = require('@/constants/ThemeContext');
      useThemeMode.mockReturnValue({
        themeMode: 'midnight',
        toggleThemeMode: jest.fn(),
        theme: {
          chipBackground: '#000000',
          chipText: '#ffffff',
          accentPrimary: '#4A90E2',
        },
      });

      const { getByText } = render(<ThemeModeToggle variant="expanded" />);
      expect(getByText('Ночной режим')).toBeTruthy();
    });
  });

  describe('Переключение темы', () => {
    it('должен вызывать toggleThemeMode при нажатии', () => {
      const { useThemeMode } = require('@/constants/ThemeContext');
      const mockToggle = jest.fn();
      useThemeMode.mockReturnValue({
        themeMode: 'sunrise',
        toggleThemeMode: mockToggle,
        theme: {
          chipBackground: '#ffffff',
          chipText: '#000000',
          accentPrimary: '#4A90E2',
        },
      });

      const { getByTestId } = render(<ThemeModeToggle />);
      fireEvent.press(getByTestId('theme-toggle-button'));

      expect(mockToggle).toHaveBeenCalled();
    });

    it('должен вызывать HapticFeedback при переключении', () => {
      const { HapticFeedback } = require('@/constants/haptics');
      const { getByTestId } = render(<ThemeModeToggle />);
      
      fireEvent.press(getByTestId('theme-toggle-button'));

      expect(HapticFeedback.selection).toHaveBeenCalled();
    });
  });

  describe('Варианты отображения', () => {
    it('должен применять compact стили для variant="compact"', () => {
      const { getByTestId } = render(<ThemeModeToggle variant="compact" />);
      const button = getByTestId('theme-toggle-button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({
          paddingHorizontal: 12,
          paddingVertical: 6,
        })
      );
    });

    it('должен применять expanded стили для variant="expanded"', () => {
      const { getByTestId } = render(<ThemeModeToggle variant="expanded" />);
      const button = getByTestId('theme-toggle-button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({
          paddingHorizontal: 18,
          paddingVertical: 10,
        })
      );
    });

    it('должен использовать compact по умолчанию', () => {
      const { getByTestId } = render(<ThemeModeToggle />);
      const button = getByTestId('theme-toggle-button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({
          paddingHorizontal: 12,
          paddingVertical: 6,
        })
      );
    });
  });

  describe('Стилизация', () => {
    it('должен применять переданный style', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(<ThemeModeToggle style={customStyle} />);
      const button = getByTestId('theme-toggle-button');
      expect(button.props.style).toContainEqual(customStyle);
    });

    it('должен использовать цвета из темы', () => {
      const { getByTestId } = render(<ThemeModeToggle />);
      const button = getByTestId('theme-toggle-button');
      expect(button.props.style).toContainEqual(
        expect.objectContaining({
          backgroundColor: '#ffffff',
          borderColor: '#4A90E2',
        })
      );
    });
  });
});
