import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { ScanFace, Fingerprint, Shield, ShieldOff } from 'lucide-react-native';
import { useSecuritySettings, BiometricType } from '@/constants/SecuritySettingsContext';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

const BIOMETRIC_LABELS: Record<BiometricType, string> = {
  faceId: 'Face ID',
  touchId: 'Touch ID',
  fingerprint: 'Отпечаток пальца',
  none: 'Недоступно',
};

export function BiometricAuthSettings() {
  const { theme } = useThemeMode();
  const { settings, isLoading, availableBiometrics, updateSettings, authenticate } = useSecuritySettings();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleToggleBiometric = async (value: boolean) => {
    if (value && availableBiometrics === 'none') {
      Alert.alert(
        'Биометрия недоступна',
        'На вашем устройстве не настроена биометрическая аутентификация. Пожалуйста, настройте Face ID или Touch ID в настройках устройства.',
      );
      return;
    }

    if (value) {
      // При включении требуем аутентификацию
      setIsAuthenticating(true);
      try {
        const success = await authenticate('Включить биометрическую аутентификацию');
        if (success) {
          HapticFeedback.success();
          await updateSettings({ biometricEnabled: true });
        } else {
          HapticFeedback.warning();
          Alert.alert('Ошибка', 'Не удалось подтвердить вашу личность');
        }
      } catch (error) {
        console.error('[BiometricAuthSettings] Authentication error:', error);
        HapticFeedback.error();
        Alert.alert('Ошибка', 'Не удалось включить биометрию');
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      HapticFeedback.selection();
      await updateSettings({ biometricEnabled: false });
    }
  };

  const handleTestAuth = async () => {
    setIsAuthenticating(true);
    HapticFeedback.medium();
    try {
      const success = await authenticate('Тест биометрической аутентификации');
      if (success) {
        HapticFeedback.success();
        Alert.alert('Успешно', 'Биометрическая аутентификация работает корректно');
      } else {
        HapticFeedback.warning();
        Alert.alert('Ошибка', 'Аутентификация не прошла');
      }
    } catch (error) {
      console.error('[BiometricAuthSettings] Test auth error:', error);
      HapticFeedback.error();
      Alert.alert('Ошибка', 'Не удалось выполнить тест');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.accentPrimary} />
      </View>
    );
  }

  const biometricLabel = BIOMETRIC_LABELS[availableBiometrics];
  const isBiometricAvailable = availableBiometrics !== 'none';

  return (
    <View style={styles.container}>
      {/* Биометрическая аутентификация */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <View style={styles.settingHeader}>
            {isBiometricAvailable ? (
              <ScanFace size={20} color={theme.accentPrimary} />
            ) : (
              <ShieldOff size={20} color={theme.textSecondary} />
            )}
            <Text style={styles.settingTitle}>
              {isBiometricAvailable ? biometricLabel : 'Биометрическая аутентификация'}
            </Text>
          </View>
          <Text style={styles.settingDescription}>
            {isBiometricAvailable
              ? `Использовать ${biometricLabel.toLowerCase()} для защиты приложения`
              : 'Биометрия недоступна на этом устройстве'}
          </Text>
          {!isBiometricAvailable && Platform.OS === 'ios' && (
            <Text style={styles.settingHint}>
              Настройте Face ID или Touch ID в настройках устройства
            </Text>
          )}
        </View>
        <Switch
          value={settings.biometricEnabled}
          onValueChange={handleToggleBiometric}
          trackColor={{ false: theme.borderSoft, true: theme.accentPrimary }}
          thumbColor={theme.isDark ? '#fff' : '#fff'}
          disabled={!isBiometricAvailable || isAuthenticating}
        />
      </View>

      {/* Информационная карточка */}
      {settings.biometricEnabled && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Shield size={18} color={theme.accentPrimary} />
            <Text style={styles.infoTitle}>Биометрия активна</Text>
          </View>
          <Text style={styles.infoText}>
            Приложение будет запрашивать {biometricLabel.toLowerCase()} при открытии и при доступе к важным функциям.
          </Text>
        </View>
      )}

      {/* Тест аутентификации */}
      {settings.biometricEnabled && isBiometricAvailable && (
        <TouchableOpacity
          style={[styles.testButton, isAuthenticating && styles.testButtonDisabled]}
          onPress={handleTestAuth}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator size="small" color={theme.accentPrimary} />
          ) : (
            <>
              <Fingerprint size={18} color={theme.accentPrimary} />
              <Text style={styles.testButtonText}>Протестировать аутентификацию</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Предупреждение, если биометрия недоступна */}
      {!isBiometricAvailable && (
        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <ShieldOff size={18} color="#f59e0b" />
            <Text style={styles.warningTitle}>Биометрия недоступна</Text>
          </View>
          <Text style={styles.warningText}>
            На вашем устройстве не настроена биометрическая аутентификация. Настройте Face ID или Touch ID в настройках устройства для использования этой функции.
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    container: {
      gap: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.textPrimary,
    },
    settingDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    settingHint: {
      fontSize: 12,
      color: theme.textSecondary,
      fontStyle: 'italic' as const,
      marginTop: 4,
    },
    infoCard: {
      padding: 16,
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 8,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.textPrimary,
    },
    infoText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    testButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 14,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.accentPrimary,
    },
    testButtonDisabled: {
      opacity: 0.6,
    },
    testButtonText: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: theme.accentPrimary,
    },
    warningCard: {
      padding: 16,
      backgroundColor: theme.isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.isDark ? 'rgba(245,158,11,0.3)' : '#fcd34d',
      gap: 8,
    },
    warningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    warningTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: '#92400e',
    },
    warningText: {
      fontSize: 13,
      color: '#92400e',
      lineHeight: 18,
    },
  });
