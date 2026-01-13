import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricType = 'faceId' | 'touchId' | 'fingerprint' | 'none';

export interface SecuritySettings {
  biometricEnabled: boolean;
  biometricType: BiometricType;
  pinCodeEnabled: boolean;
  screenLockEnabled: boolean;
  lockTimeout: number; // в минутах
}

const SECURITY_SETTINGS_STORAGE_KEY = '@security_settings';

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  biometricEnabled: false,
  biometricType: 'none',
  pinCodeEnabled: false,
  screenLockEnabled: false,
  lockTimeout: 5, // 5 минут
};

export const [SecuritySettingsProvider, useSecuritySettings] = createContextHook(() => {
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [availableBiometrics, setAvailableBiometrics] = useState<BiometricType>('none');

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadSettings = async () => {
      try {
        let detectedBiometric: BiometricType = 'none';
        
        // Проверяем доступность биометрии
        if (Platform.OS !== 'web') {
          try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (compatible && isMounted) {
              const enrolled = await LocalAuthentication.isEnrolledAsync();
              if (enrolled) {
                const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                  detectedBiometric = 'faceId';
                } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                  detectedBiometric = Platform.OS === 'ios' ? 'touchId' : 'fingerprint';
                }
              }
            }
          } catch (error) {
            console.error('[SecuritySettingsContext] Error checking biometrics:', error);
          }
        }

        if (!isMounted) {
          return;
        }

        setAvailableBiometrics(detectedBiometric);

        // Загружаем настройки
        const stored = await AsyncStorage.getItem(SECURITY_SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({
            ...DEFAULT_SECURITY_SETTINGS,
            ...parsedSettings,
            biometricType: detectedBiometric,
          });
        } else {
          setSettings({
            ...DEFAULT_SECURITY_SETTINGS,
            biometricType: detectedBiometric,
          });
        }
      } catch (error) {
        console.error('[SecuritySettingsContext] Error loading settings:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (Platform.OS !== 'web') {
      loadSettings();
    } else {
      timer = setTimeout(loadSettings, 0);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const updateSettings = useCallback(async (updates: Partial<SecuritySettings>) => {
    try {
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SECURITY_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('[SecuritySettingsContext] Settings updated:', updates);
    } catch (error) {
      console.error('[SecuritySettingsContext] Error updating settings:', error);
    }
  }, [settings]);

  const authenticate = useCallback(async (reason?: string): Promise<boolean> => {
    if (!settings.biometricEnabled || availableBiometrics === 'none') {
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason || 'Подтвердите вашу личность',
        cancelLabel: 'Отмена',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('[SecuritySettingsContext] Authentication error:', error);
      return false;
    }
  }, [settings.biometricEnabled, availableBiometrics]);

  return {
    settings,
    isLoading,
    availableBiometrics,
    updateSettings,
    authenticate,
  };
});
