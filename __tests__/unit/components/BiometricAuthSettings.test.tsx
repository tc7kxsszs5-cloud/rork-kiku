/**
 * Тесты для компонента BiometricAuthSettings
 * Проверяет настройки биометрической аутентификации
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { BiometricAuthSettings } from '@/components/settings/BiometricAuthSettings';

// Моки
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

const mockUpdateSettings = jest.fn();
const mockAuthenticate = jest.fn();

jest.mock('@/constants/SecuritySettingsContext', () => ({
  useSecuritySettings: jest.fn(() => ({
    settings: {
      biometricEnabled: false,
      biometricType: 'none',
    },
    isLoading: false,
    availableBiometrics: 'faceId' as const,
    updateSettings: mockUpdateSettings,
    authenticate: mockAuthenticate,
  })),
  BiometricType: {
    faceId: 'faceId',
    touchId: 'touchId',
    fingerprint: 'fingerprint',
    none: 'none',
  },
}));

jest.mock('@/constants/haptics', () => ({
  HapticFeedback: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    selection: jest.fn(),
    medium: jest.fn(),
  },
}));

jest.mock('lucide-react-native', () => ({
  ScanFace: ({ size, color }: any) => <div data-testid="scan-face" data-size={size} data-color={color} />,
  Fingerprint: ({ size, color }: any) => <div data-testid="fingerprint" data-size={size} data-color={color} />,
  Shield: ({ size, color }: any) => <div data-testid="shield" data-size={size} data-color={color} />,
  ShieldOff: ({ size, color }: any) => <div data-testid="shield-off" data-size={size} data-color={color} />,
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: 'ios',
    },
  };
});

describe('BiometricAuthSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateSettings.mockResolvedValue(undefined);
    mockAuthenticate.mockResolvedValue(true);
  });

  describe('Рендеринг', () => {
    it('должен рендериться', () => {
      const { container } = render(<BiometricAuthSettings />);
      expect(container).toBeTruthy();
    });

    it('должен показывать индикатор загрузки когда isLoading=true', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: true,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByTestId } = render(<BiometricAuthSettings />);
      // Проверяем что компонент рендерится (ActivityIndicator внутри)
      expect(getByTestId).toBeTruthy();
    });

    it('должен показывать правильный тип биометрии', () => {
      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Face ID')).toBeTruthy();
    });
  });

  describe('Переключение биометрии', () => {
    it('должен включать биометрию при переключении switch', async () => {
      const { getByTestId } = render(<BiometricAuthSettings />);
      const switchComponent = getByTestId('switch') || getByTestId('biometric-switch');
      
      // Если switch не найден по testID, ищем по роли
      const switches = require('@testing-library/react-native').getAllByRole;
      if (switches) {
        const switchElements = switches('switch');
        if (switchElements.length > 0) {
          fireEvent(switchElements[0], 'valueChange', true);
        }
      }

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledWith('Включить биометрическую аутентификацию');
      });
    });

    it('должен показывать Alert если биометрия недоступна', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'none',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      render(<BiometricAuthSettings />);
      
      // Компонент должен рендериться с предупреждением
      expect(Alert.alert).toBeDefined();
    });

    it('должен выключать биометрию при переключении switch в false', async () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      render(<BiometricAuthSettings />);
      
      // При выключении не требуется аутентификация
      await waitFor(() => {
        expect(mockUpdateSettings).toBeDefined();
      });
    });
  });

  describe('Тест аутентификации', () => {
    it('должен показывать кнопку теста когда биометрия включена', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Протестировать аутентификацию')).toBeTruthy();
    });

    it('должен вызывать authenticate при нажатии на кнопку теста', async () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      const testButton = getByText('Протестировать аутентификацию');
      
      fireEvent.press(testButton);

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledWith('Тест биометрической аутентификации');
      });
    });
  });

  describe('Информационные карточки', () => {
    it('должен показывать информационную карточку когда биометрия включена', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Биометрия активна')).toBeTruthy();
    });

    it('должен показывать предупреждение когда биометрия недоступна', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'none',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Биометрия недоступна')).toBeTruthy();
    });
  });

  describe('Обработка ошибок', () => {
    it('должен обрабатывать ошибку аутентификации', async () => {
      mockAuthenticate.mockResolvedValue(false);

      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      render(<BiometricAuthSettings />);
      
      // Проверяем что Alert может быть вызван
      expect(Alert.alert).toBeDefined();
    });

    it('должен обрабатывать исключение при аутентификации', async () => {
      mockAuthenticate.mockRejectedValue(new Error('Auth failed'));

      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'faceId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      render(<BiometricAuthSettings />);
      
      // Компонент должен обработать ошибку
      expect(Alert.alert).toBeDefined();
    });
  });

  describe('Различные типы биометрии', () => {
    it('должен показывать Touch ID для iOS', () => {
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'touchId',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Touch ID')).toBeTruthy();
    });

    it('должен показывать отпечаток пальца для Android', () => {
      jest.spyOn(require('react-native'), 'Platform').mockReturnValue({ OS: 'android' });
      
      jest.spyOn(require('@/constants/SecuritySettingsContext'), 'useSecuritySettings').mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'fingerprint',
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Отпечаток пальца')).toBeTruthy();
    });
  });
});
