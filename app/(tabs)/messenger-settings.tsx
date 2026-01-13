import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Settings, RefreshCcw, Shield } from 'lucide-react-native';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { SyncSettings } from '@/components/settings/SyncSettings';
import { BiometricAuthSettings } from '@/components/settings/BiometricAuthSettings';

export default function MessengerSettingsScreen() {
  const { theme } = useThemeMode();

  const styles = createStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Settings size={24} color={theme.textPrimary} />
        <Text style={styles.headerTitle}>Настройки мессенджера</Text>
        <Text style={styles.headerDescription}>
          Управление синхронизацией, безопасностью и персонализацией
        </Text>
      </View>

      {/* Секция: Синхронизация */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <RefreshCcw size={20} color={theme.accentPrimary} />
          <Text style={styles.sectionTitle}>Синхронизация</Text>
        </View>
        <View style={styles.sectionContent}>
          <SyncSettings />
        </View>
      </View>

      {/* Секция: Безопасность */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={theme.accentPrimary} />
          <Text style={styles.sectionTitle}>Безопасность</Text>
        </View>
        <View style={styles.sectionContent}>
          <BiometricAuthSettings />
        </View>
      </View>

      {/* Заглушка для будущих секций */}
      <View style={styles.placeholderSection}>
        <Text style={styles.placeholderText}>
          Дополнительные настройки появятся в следующих версиях
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
      gap: 24,
    },
    header: {
      gap: 8,
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: theme.textPrimary,
    },
    headerDescription: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    section: {
      gap: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.textPrimary,
    },
    sectionContent: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: 20,
      padding: 16,
    },
    placeholderSection: {
      padding: 20,
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
    },
  });
