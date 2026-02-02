/**
 * Тесты для ThemeContext
 * Проверяет переключение тем, сохранение в AsyncStorage, инициализацию
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { ThemeProvider, useThemeMode } from '@/constants/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мок для AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мок для logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Инициализация', () => {
    it('должен инициализироваться с темой по умолчанию (sunrise)', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
        expect(result.current.theme).toBeDefined();
      });
    });

    it('должен загружать сохраненную тему из AsyncStorage', async () => {
<<<<<<< HEAD
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('midnight');
=======
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify('midnight'));
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('@theme_mode_preference');
      });
    });

    it('должен обрабатывать ошибку при загрузке из AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        // Должен использовать тему по умолчанию при ошибке
        expect(result.current.themeMode).toBe('sunrise');
      });
    });
  });

  describe('Переключение темы', () => {
    it('должен переключать тему через setThemeMode', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });

      await act(async () => {
        result.current.setThemeMode('midnight');
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('midnight');
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@theme_mode_preference',
<<<<<<< HEAD
          'midnight'
=======
          JSON.stringify('midnight')
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
        );
      });
    });

    it('должен переключать тему через toggleThemeMode', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });

      await act(async () => {
        result.current.toggleThemeMode();
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('midnight');
      });

      await act(async () => {
        result.current.toggleThemeMode();
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });
    });
  });

  describe('Тема', () => {
    it('должен возвращать правильную палитру для sunrise', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
        expect(result.current.theme.isDark).toBe(false);
        expect(result.current.theme.backgroundPrimary).toBeDefined();
        expect(result.current.theme.textPrimary).toBeDefined();
      });
    });

    it('должен возвращать правильную палитру для midnight', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });

      await act(async () => {
        result.current.setThemeMode('midnight');
      });

      await waitFor(() => {
        expect(result.current.theme.isDark).toBe(true);
        expect(result.current.theme.backgroundPrimary).toBeDefined();
        expect(result.current.theme.textPrimary).toBeDefined();
      });
    });

    it('должен предоставлять все необходимые цвета', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        const theme = result.current.theme;
        expect(theme.backgroundPrimary).toBeDefined();
        expect(theme.backgroundSecondary).toBeDefined();
        expect(theme.card).toBeDefined();
        expect(theme.textPrimary).toBeDefined();
        expect(theme.textSecondary).toBeDefined();
        expect(theme.accentPrimary).toBeDefined();
        expect(theme.primary).toBeDefined();
        expect(theme.success).toBeDefined();
        expect(theme.warning).toBeDefined();
        expect(theme.danger).toBeDefined();
      });
    });
  });

  describe('Theme options', () => {
    it('должен предоставлять список опций тем', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeOptions).toBeDefined();
        expect(result.current.themeOptions.length).toBe(2);
        expect(result.current.themeOptions[0].value).toBe('sunrise');
        expect(result.current.themeOptions[1].value).toBe('midnight');
      });
    });

    it('должен предоставлять описания для каждой темы', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        const sunriseOption = result.current.themeOptions.find(opt => opt.value === 'sunrise');
        const midnightOption = result.current.themeOptions.find(opt => opt.value === 'midnight');
        
        expect(sunriseOption?.label).toBe('Теплый день');
        expect(sunriseOption?.description).toBeDefined();
        expect(midnightOption?.label).toBe('Ночной режим');
        expect(midnightOption?.description).toBeDefined();
      });
    });
  });

  describe('Сохранение в AsyncStorage', () => {
    it('должен сохранять тему в AsyncStorage при изменении', async () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });

      await act(async () => {
        result.current.setThemeMode('midnight');
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@theme_mode_preference',
<<<<<<< HEAD
          'midnight'
=======
          JSON.stringify('midnight')
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
        );
      });
    });

    it('должен обрабатывать ошибку при сохранении в AsyncStorage', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useThemeMode(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.themeMode).toBe('sunrise');
      });

      await act(async () => {
        result.current.setThemeMode('midnight');
      });

      // Тема должна измениться даже при ошибке сохранения
      await waitFor(() => {
        expect(result.current.themeMode).toBe('midnight');
      });
    });
  });
});
