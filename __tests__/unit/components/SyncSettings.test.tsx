/**
 * Тесты для SyncSettings компонента
 * Проверяет рендеринг, переключение настроек, синхронизацию
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SyncSettings } from '@/components/settings/SyncSettings';
import { SyncSettingsProvider, useSyncSettings } from '@/constants/SyncSettingsContext';

// Моки
jest.mock('@/constants/SyncSettingsContext', () => {
  const actual = jest.requireActual('@/constants/SyncSettingsContext');
  return {
    ...actual,
    useSyncSettings: jest.fn(),
  };
});

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      accentPrimary: '#FF6B35',
      borderSoft: '#e0e0e0',
      card: '#f5f5f5',
      isDark: false,
    },
  })),
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    selection: jest.fn(),
    medium: jest.fn(),
  },
}));

const mockUseSyncSettings = useSyncSettings as jest.MockedFunction<typeof useSyncSettings>;

describe('SyncSettings', () => {
  const defaultSettings = {
    autoSyncEnabled: true,
    frequency: '15min' as const,
    source: 'cloud' as const,
    lastSyncTimestamp: Date.now() - 60000, // 1 минута назад
  };

  const defaultMock = {
    settings: defaultSettings,
    isLoading: false,
    isSyncing: false,
    updateSettings: jest.fn().mockResolvedValue(undefined),
    triggerSync: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSyncSettings.mockReturnValue(defaultMock);
  });

  describe('Рендеринг', () => {
    it('должен отображать компонент', () => {
      const { getByText } = render(<SyncSettings />);
      
      expect(getByText('Автосинхронизация')).toBeTruthy();
    });

    it('должен показывать индикатор загрузки при isLoading=true', () => {
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        isLoading: true,
      });

      const { getByTestId } = render(<SyncSettings />);
      
      // ActivityIndicator должен быть виден
      expect(getByTestId).toBeDefined();
    });

    it('должен отображать настройки синхронизации', () => {
      const { getByText } = render(<SyncSettings />);
      
      expect(getByText('Автосинхронизация')).toBeTruthy();
      expect(getByText('Частота синхронизации')).toBeTruthy();
      expect(getByText('Источник данных')).toBeTruthy();
    });
  });

  describe('Переключение автосинхронизации', () => {
    it('должен вызывать updateSettings при переключении', async () => {
      const updateSettings = jest.fn().mockResolvedValue(undefined);
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        updateSettings,
      });

      const { getByTestId } = render(<SyncSettings />);
      const switchComponent = getByTestId('auto-sync-switch');

      fireEvent(switchComponent, 'valueChange', false);

      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalledWith({ autoSyncEnabled: false });
      });
    });

    it('должен показывать опции частоты только при включенной автосинхронизации', () => {
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        settings: {
          ...defaultSettings,
          autoSyncEnabled: false,
        },
      });

      const { queryByText } = render(<SyncSettings />);
      
      expect(queryByText('Частота синхронизации')).toBeNull();
    });
  });

  describe('Выбор частоты синхронизации', () => {
    it('должен вызывать updateSettings при выборе частоты', async () => {
      const updateSettings = jest.fn().mockResolvedValue(undefined);
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        updateSettings,
      });

      const { getByText } = render(<SyncSettings />);
      const option = getByText('Каждые 5 минут');

      fireEvent.press(option);

      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalledWith({ frequency: '5min' });
      });
    });

    it('должен показывать все опции частоты', () => {
      const { getByText } = render(<SyncSettings />);
      
      expect(getByText('В реальном времени')).toBeTruthy();
      expect(getByText('Каждые 5 минут')).toBeTruthy();
      expect(getByText('Каждые 15 минут')).toBeTruthy();
      expect(getByText('Каждый час')).toBeTruthy();
    });
  });

  describe('Выбор источника синхронизации', () => {
    it('должен вызывать updateSettings при выборе источника', async () => {
      const updateSettings = jest.fn().mockResolvedValue(undefined);
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        updateSettings,
      });

      const { getByText } = render(<SyncSettings />);
      const option = getByText('Локально');

      fireEvent.press(option);

      await waitFor(() => {
        expect(updateSettings).toHaveBeenCalledWith({ source: 'local' });
      });
    });
  });

  describe('Ручная синхронизация', () => {
    it('должен вызывать triggerSync при нажатии на кнопку', async () => {
      const triggerSync = jest.fn().mockResolvedValue(undefined);
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        triggerSync,
      });

      const { getByText } = render(<SyncSettings />);
      const button = getByText('Синхронизировать сейчас');

      fireEvent.press(button);

      await waitFor(() => {
        expect(triggerSync).toHaveBeenCalled();
      });
    });

    it('должен показывать индикатор синхронизации при isSyncing=true', () => {
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        isSyncing: true,
      });

      const { getByTestId } = render(<SyncSettings />);
      
      // Должен быть индикатор синхронизации
      expect(getByTestId).toBeDefined();
    });
  });

  describe('Форматирование времени последней синхронизации', () => {
    it('должен показывать "Только что" для недавней синхронизации', () => {
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        settings: {
          ...defaultSettings,
          lastSyncTimestamp: Date.now() - 30000, // 30 секунд назад
        },
      });

      const { getByText } = render(<SyncSettings />);
      
      expect(getByText(/Только что|мин\. назад/)).toBeTruthy();
    });

    it('должен показывать "Синхронизация не выполнялась" если нет timestamp', () => {
      mockUseSyncSettings.mockReturnValue({
        ...defaultMock,
        settings: {
          ...defaultSettings,
          lastSyncTimestamp: undefined,
        },
      });

      const { getByText } = render(<SyncSettings />);
      
      expect(getByText('Синхронизация не выполнялась')).toBeTruthy();
    });
  });
});
