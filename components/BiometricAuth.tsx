import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Fingerprint, ShieldCheck } from 'lucide-react-native';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onCancel,
  title = 'Биометрическая аутентификация',
  description = 'Используйте Touch ID или Face ID для подтверждения',
}) => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'iris' | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { theme } = useThemeMode();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (Platform.OS === 'web') {
      setIsBiometricAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        setIsBiometricAvailable(false);
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        setIsBiometricAvailable(false);
        return;
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        setBiometricType('iris');
      }

      setIsBiometricAvailable(true);
    } catch (error) {
      console.error('[BiometricAuth] Error checking availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const authenticate = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        'Недоступно',
        'Биометрическая аутентификация недоступна на этом устройстве'
      );
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: title,
        cancelLabel: 'Отмена',
        disableDeviceFallback: false,
        fallbackLabel: 'Использовать PIN-код',
      });

      if (result.success) {
        console.log('[BiometricAuth] Authentication successful');
        onSuccess();
      } else {
        console.log('[BiometricAuth] Authentication failed or cancelled');
        if (result.error === 'user_cancel' || result.error === 'system_cancel') {
          onCancel?.();
        } else {
          Alert.alert(
            'Аутентификация не удалась',
            'Попробуйте снова или используйте другой метод входа'
          );
        }
      }
    } catch (error) {
      console.error('[BiometricAuth] Authentication error:', error);
      Alert.alert('Ошибка', 'Не удалось выполнить биометрическую аутентификацию');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!isBiometricAvailable) {
    return null;
  }

  const getBiometricLabel = (): string => {
    switch (biometricType) {
      case 'face':
        return 'Face ID';
      case 'fingerprint':
        return 'Touch ID';
      case 'iris':
        return 'Iris';
      default:
        return 'Биометрия';
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={authenticate}
        disabled={isAuthenticating}
        testID="biometric-auth-button"
      >
        <View style={styles.iconWrapper}>
          {biometricType === 'face' ? (
            <ShieldCheck size={24} color={theme.accentPrimary} />
          ) : (
            <Fingerprint size={24} color={theme.accentPrimary} />
          )}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{description}</Text>
          <Text style={styles.subtitle}>
            {isAuthenticating ? 'Проверка...' : `Нажмите для использования ${getBiometricLabel()}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    container: {
      marginVertical: 12,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: theme.accentPrimary,
      shadowColor: theme.accentPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    iconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.isDark ? 'rgba(250,204,21,0.15)' : 'rgba(250,204,21,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    textWrapper: {
      flex: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });

/**
 * Hook to check biometric availability
 */
export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'iris' | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS === 'web') {
      setIsAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('iris');
        }
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('[useBiometric] Error checking availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    if (!isAvailable) {
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Подтвердите вашу личность',
        cancelLabel: 'Отмена',
        disableDeviceFallback: false,
        fallbackLabel: 'Использовать PIN-код',
      });

      return result.success;
    } catch (error) {
      console.error('[useBiometric] Authentication error:', error);
      return false;
    }
  };

  return {
    isAvailable,
    biometricType,
    authenticate,
    checkAvailability,
  };
};
