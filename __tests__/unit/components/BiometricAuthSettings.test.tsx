/**
 * Тесты для BiometricAuthSettings
 * Проверяет настройки биометрии, аутентификацию, обработку ошибок
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, ActivityIndicator } from 'react-native';
import { BiometricAuthSettings } from '@/components/settings/BiometricAuthSettings';

// Моки
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

jest.mock('@/constants/SecuritySettingsContext', () => ({
  useSecuritySettings: jest.fn(() => ({
    settings: {
      biometricEnabled: false,
    },
    isLoading: false,
    availableBiometrics: 'faceId' as const,
    updateSettings: jest.fn().mockResolvedValue(undefined),
    authenticate: jest.fn().mockResolvedValue(true),
  })),
  BiometricType: {
    faceId: 'faceId',
    touchId: 'touchId',
    fingerprint: 'fingerprint',
    none: 'none',
  },
}));

jest.mock('@/constants/ThemeContext', () => ({
  useThemeMode: jest.fn(() => ({
    theme: {
      backgroundPrimary: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      accentPrimary: '#4A90E2',
    },
  })),
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
  ScanFace: () => null,
  Fingerprint: () => null,
  Shield: () => null,
  ShieldOff: () => null,
}));

describe('BiometricAuthSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендеринг', () => {
    it('должен отображать компонент настроек биометрии', () => {
      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText(/Биометрическая аутентификация/)).toBeTruthy();
    });

    it('должен показывать индикатор загрузки когда isLoading=true', () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      useSecuritySettings.mockReturnValue({
        settings: {},
        isLoading: true,
        availableBiometrics: 'faceId',
        updateSettings: jest.fn(),
        authenticate: jest.fn(),
      });

      const { UNSAFE_getByType } = render(<BiometricAuthSettings />);
      const indicator = UNSAFE_getByType(ActivityIndicator);
      expect(indicator).toBeTruthy();
    });

    it('должен показывать название биометрии когда доступна', () => {
      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Face ID')).toBeTruthy();
    });

    it('должен показывать "Недоступно" когда биометрия не доступна', () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'none' as const,
        updateSettings: jest.fn(),
        authenticate: jest.fn(),
      });

      const { getByText } = render(<BiometricAuthSettings />);
      expect(getByText('Недоступно')).toBeTruthy();
    });
  });

  describe('Переключение биометрии', () => {
    it('должен включать биометрию при переключении switch', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockUpdateSettings = jest.fn().mockResolvedValue(undefined);
      const mockAuthenticate = jest.fn().mockResolvedValue(true);
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: mockUpdateSettings,
        authenticate: mockAuthenticate,
      });

      const { UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const switches = UNSAFE_getAllByType('Switch');
      const biometricSwitch = switches[0];

      fireEvent(biometricSwitch, 'valueChange', true);

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledWith('Включить биометрическую аутентификацию');
        expect(mockUpdateSettings).toHaveBeenCalledWith({ biometricEnabled: true });
      });
    });

    it('должен выключать биометрию без аутентификации', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockUpdateSettings = jest.fn().mockResolvedValue(undefined);
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: mockUpdateSettings,
        authenticate: jest.fn(),
      });

      const { UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const switches = UNSAFE_getAllByType('Switch');
      const biometricSwitch = switches[0];

      fireEvent(biometricSwitch, 'valueChange', false);

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({ biometricEnabled: false });
      });
    });

    it('должен показывать Alert если биометрия недоступна', () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'none' as const,
        updateSettings: jest.fn(),
        authenticate: jest.fn(),
      });

      const { UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const switches = UNSAFE_getAllByType('Switch');
      const biometricSwitch = switches[0];

      fireEvent(biometricSwitch, 'valueChange', true);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Биометрия недоступна',
        expect.stringContaining('На вашем устройстве не настроена')
      );
    });

    it('должен показывать ошибку если аутентификация не удалась', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockAuthenticate = jest.fn().mockResolvedValue(false);
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: jest.fn(),
        authenticate: mockAuthenticate,
      });

      const { UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const switches = UNSAFE_getAllByType('Switch');
      const biometricSwitch = switches[0];

      fireEvent(biometricSwitch, 'valueChange', true);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Не удалось подтвердить вашу личность');
      });
    });
  });

  describe('Тест аутентификации', () => {
    it('должен выполнять тест аутентификации', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockAuthenticate = jest.fn().mockResolvedValue(true);
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: jest.fn(),
        authenticate: mockAuthenticate,
      });

      const { getByText, UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const testButton = touchables.find((btn: any) =>
        btn.props.children && getByText(/Тест/)
      );

      if (testButton) {
        fireEvent.press(testButton);
      }

      await waitFor(() => {
        expect(mockAuthenticate).toHaveBeenCalledWith('Тест биометрической аутентификации');
        expect(Alert.alert).toHaveBeenCalledWith('Успешно', 'Биометрическая аутентификация работает корректно');
      });
    });

    it('должен показывать ошибку если тест не удался', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockAuthenticate = jest.fn().mockResolvedValue(false);
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: true },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: jest.fn(),
        authenticate: mockAuthenticate,
      });

      const { getByText, UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const touchables = UNSAFE_getAllByType('TouchableOpacity');
      const testButton = touchables.find((btn: any) =>
        btn.props.children && getByText(/Тест/)
      );

      if (testButton) {
        fireEvent.press(testButton);
      }

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Аутентификация не прошла');
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен обрабатывать ошибки при включении биометрии', async () => {
      const { useSecuritySettings } = require('@/constants/SecuritySettingsContext');
      const mockAuthenticate = jest.fn().mockRejectedValue(new Error('Auth failed'));
      
      useSecuritySettings.mockReturnValue({
        settings: { biometricEnabled: false },
        isLoading: false,
        availableBiometrics: 'faceId' as const,
        updateSettings: jest.fn(),
        authenticate: mockAuthenticate,
      });

      const { UNSAFE_getAllByType } = render(<BiometricAuthSettings />);
      const switches = UNSAFE_getAllByType('Switch');
      const biometricSwitch = switches[0];

      fireEvent(biometricSwitch, 'valueChange', true);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Не удалось включить биометрию');
      });
    });
  });
});
