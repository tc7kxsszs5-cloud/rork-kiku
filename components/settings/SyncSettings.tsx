import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCcw, Cloud, HardDrive, CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { useSyncSettings, SyncFrequency, SyncSource } from '@/constants/SyncSettingsContext';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

const SYNC_FREQUENCY_OPTIONS: { value: SyncFrequency; label: string; description: string }[] = [
  { value: 'realtime', label: 'В реальном времени', description: 'Мгновенная синхронизация' },
  { value: '5min', label: 'Каждые 5 минут', description: 'Быстрая синхронизация' },
  { value: '15min', label: 'Каждые 15 минут', description: 'Умеренная синхронизация' },
  { value: '1hour', label: 'Каждый час', description: 'Экономная синхронизация' },
];

const SYNC_SOURCE_OPTIONS: { value: SyncSource; label: string; description: string; Icon: typeof Cloud }[] = [
  { value: 'cloud', label: 'Облако', description: 'Синхронизация через сервер', Icon: Cloud },
  { value: 'local', label: 'Локально', description: 'Только на устройстве', Icon: HardDrive },
];

export function SyncSettings() {
  const { theme } = useThemeMode();
  const { settings, isLoading, isSyncing, updateSettings, triggerSync } = useSyncSettings();

  const handleToggleAutoSync = async (value: boolean) => {
    HapticFeedback.selection();
    // updateSettings обрабатывает ошибки внутри контекста
    await updateSettings({ autoSyncEnabled: value });
  };

  const handleFrequencyChange = async (frequency: SyncFrequency) => {
    HapticFeedback.selection();
    // updateSettings обрабатывает ошибки внутри контекста
    await updateSettings({ frequency });
  };

  const handleSourceChange = async (source: SyncSource) => {
    HapticFeedback.selection();
    // updateSettings обрабатывает ошибки внутри контекста
    await updateSettings({ source });
  };

  const handleManualSync = async () => {
    HapticFeedback.medium();
    // triggerSync обрабатывает ошибки внутри контекста
    await triggerSync();
  };

  const formatLastSync = () => {
    if (!settings.lastSyncTimestamp) {
      return 'Синхронизация не выполнялась';
    }
    const date = new Date(settings.lastSyncTimestamp);
    const now = Date.now();
    const diff = now - settings.lastSyncTimestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч. назад`;
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.accentPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Автосинхронизация */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Автосинхронизация</Text>
          <Text style={styles.settingDescription}>
            Автоматическая синхронизация данных
          </Text>
        </View>
        <Switch
          testID="auto-sync-switch"
          value={settings.autoSyncEnabled}
          onValueChange={handleToggleAutoSync}
          trackColor={{ false: theme.borderSoft, true: theme.accentPrimary }}
          thumbColor={theme.isDark ? '#fff' : '#fff'}
        />
      </View>

      {/* Частота синхронизации */}
      {settings.autoSyncEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Частота синхронизации</Text>
          {SYNC_FREQUENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionRow,
                settings.frequency === option.value && styles.optionRowActive,
              ]}
              onPress={() => handleFrequencyChange(option.value)}
            >
              <View style={styles.optionInfo}>
                <Text
                  style={[
                    styles.optionLabel,
                    settings.frequency === option.value && styles.optionLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {settings.frequency === option.value && (
                <CheckCircle2 size={20} color={theme.accentPrimary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Источник данных */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Источник данных</Text>
        {SYNC_SOURCE_OPTIONS.map((option) => {
          const Icon = option.Icon;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionRow,
                settings.source === option.value && styles.optionRowActive,
              ]}
              onPress={() => handleSourceChange(option.value)}
            >
              <View style={styles.optionIcon}>
                <Icon size={20} color={settings.source === option.value ? theme.accentPrimary : theme.textSecondary} />
              </View>
              <View style={styles.optionInfo}>
                <Text
                  style={[
                    styles.optionLabel,
                    settings.source === option.value && styles.optionLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              {settings.source === option.value && (
                <CheckCircle2 size={20} color={theme.accentPrimary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Статус синхронизации */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Clock size={16} color={theme.textSecondary} />
          <Text style={styles.statusLabel}>Последняя синхронизация</Text>
        </View>
        <Text style={styles.statusValue}>{formatLastSync()}</Text>
        {settings.lastSyncStatus && (
          <View style={styles.statusIndicator}>
            {settings.lastSyncStatus === 'success' ? (
              <>
                <CheckCircle2 size={14} color="#22c55e" />
                <Text style={styles.statusText}>Успешно</Text>
              </>
            ) : settings.lastSyncStatus === 'error' ? (
              <>
                <XCircle size={14} color="#ef4444" />
                <Text style={styles.statusText}>Ошибка</Text>
              </>
            ) : (
              <>
                <ActivityIndicator size="small" color={theme.accentPrimary} />
                <Text style={styles.statusText}>В процессе...</Text>
              </>
            )}
          </View>
        )}
      </View>

      {/* Ручная синхронизация */}
      <TouchableOpacity
        style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
        onPress={handleManualSync}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <ActivityIndicator size="small" color={theme.isDark ? '#0b1220' : '#1a1a1a'} />
        ) : (
          <>
            <RefreshCcw size={18} color={theme.isDark ? '#0b1220' : '#1a1a1a'} />
            <Text style={styles.syncButtonText}>Синхронизировать сейчас</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemePalette) =>
  StyleSheet.create({
    container: {
      gap: 20,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
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
    settingTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    section: {
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.textSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    optionRowActive: {
      borderColor: theme.accentPrimary,
      backgroundColor: theme.isDark
        ? `rgba(${parseInt(theme.accentPrimary.slice(1, 3), 16)}, ${parseInt(theme.accentPrimary.slice(3, 5), 16)}, ${parseInt(theme.accentPrimary.slice(5, 7), 16)}, 0.15)`
        : `${theme.accentPrimary}15`,
    },
    optionIcon: {
      marginRight: 12,
    },
    optionInfo: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: theme.textPrimary,
      marginBottom: 2,
    },
    optionLabelActive: {
      color: theme.accentPrimary,
    },
    optionDescription: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    statusCard: {
      padding: 16,
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 8,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statusLabel: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: theme.textSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
    statusValue: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.textPrimary,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
    },
    statusText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    syncButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      backgroundColor: theme.accentPrimary,
      borderRadius: 16,
      paddingVertical: 14,
    },
    syncButtonDisabled: {
      opacity: 0.6,
    },
    syncButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.isDark ? '#0b1220' : '#1a1a1a',
    },
  });
