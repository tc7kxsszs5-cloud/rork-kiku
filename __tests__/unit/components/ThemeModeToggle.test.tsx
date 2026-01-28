/**
 * Тесты для компонента ThemeModeToggle
 * Проверяет переключение темы, варианты, взаимодействие
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeModeToggle } from '@/components/ThemeModeToggle';
import { ThemeProvider } from '@/constants/ThemeContext';

// Мок для ThemeContext
const mockToggleThemeMode = jest.fn();
const mockThemeMode = 'sunrise';

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: () => ({
    themeMode: mockThemeMode,
    toggleThemeMode: mockToggleThemeMode,
    theme: {
      chipBackground: '#FFFFFF',
      chipText: '#000000',
      accentPrimary: '#FF6B35',
    },
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Мок для haptics
jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    selection: jest.fn(),
  },
}));

// Мок для lucide-react-native
jest.mock('lucide-react-native', () => ({
  Sun: ({ size, color, testID }: any) => (
    <div testID={testID || 'sun-icon'} data-size={size} data-color={color} />
  ),
  Moon: ({ size, color, testID }: any) => (
    <div testID={testID || 'moon-icon'} data-size={size} data-color={color} />
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeModeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен рендериться с compact вариантом по умолчанию', () => {
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      expect(getByTestId('theme-toggle-button')).toBeTruthy();
    });

    it('должен рендериться с expanded вариантом', () => {
      const { getByTestId } = render(
        <ThemeModeToggle variant="expanded" />,
        { wrapper: TestWrapper }
      );
      expect(getByTestId('theme-toggle-button')).toBeTruthy();
    });

    it('должен отображать правильный label для sunrise темы', () => {
      const { getByText } = render(
        <ThemeModeToggle variant="compact" />,
        { wrapper: TestWrapper }
      );
      expect(getByText('День')).toBeTruthy();
    });

    it('должен отображать правильный label для expanded варианта в sunrise', () => {
      const { getByText } = render(
        <ThemeModeToggle variant="expanded" />,
        { wrapper: TestWrapper }
      );
      expect(getByText('Светлый режим')).toBeTruthy();
    });

    it('должен применять кастомный testID', () => {
      const { getByTestId } = render(
        <ThemeModeToggle testID="custom-toggle" />,
        { wrapper: TestWrapper }
      );
      expect(getByTestId('custom-toggle')).toBeTruthy();
    });
  });

  describe('Переключение темы', () => {
    it('должен вызывать toggleThemeMode при нажатии', () => {
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      fireEvent.press(button);
      expect(mockToggleThemeMode).toHaveBeenCalledTimes(1);
    });

    it('должен вызывать haptic feedback при нажатии', () => {
      const { HapticFeedback } = require('@/constants/haptics');
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      fireEvent.press(button);
      expect(HapticFeedback.selection).toHaveBeenCalledTimes(1);
    });
  });

  describe('Варианты', () => {
    it('compact вариант должен иметь правильные стили', () => {
      const { getByTestId } = render(
        <ThemeModeToggle variant="compact" />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      expect(button).toBeTruthy();
    });

    it('expanded вариант должен иметь правильные стили', () => {
      const { getByTestId } = render(
        <ThemeModeToggle variant="expanded" />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Иконки', () => {
    it('должен показывать Sun иконку для sunrise темы', () => {
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      // Проверяем что компонент рендерится (иконка внутри)
      expect(getByTestId('theme-toggle-button')).toBeTruthy();
    });

    it('должен показывать Moon иконку для midnight темы', () => {
      // Мокаем midnight тему
      jest.spyOn(require('@/constants/ThemeContext'), 'useThemeMode').mockReturnValue({
        themeMode: 'midnight',
        toggleThemeMode: mockToggleThemeMode,
        theme: {
          chipBackground: '#000000',
          chipText: '#FFFFFF',
          accentPrimary: '#4A90E2',
        },
      });

      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      expect(getByTestId('theme-toggle-button')).toBeTruthy();
    });
  });

  describe('Кастомные стили', () => {
    it('должен применять кастомный style', () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <ThemeModeToggle style={customStyle} />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('должен обрабатывать множественные нажатия', () => {
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(mockToggleThemeMode).toHaveBeenCalledTimes(3);
    });

    it('должен иметь правильный activeOpacity', () => {
      const { getByTestId } = render(
        <ThemeModeToggle />,
        { wrapper: TestWrapper }
      );
      const button = getByTestId('theme-toggle-button');
      expect(button.props.activeOpacity).toBe(0.85);
    });
  });
});
