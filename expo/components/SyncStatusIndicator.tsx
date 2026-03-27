/**
 * Sync Status Indicator Component
 * Shows synchronization status to the user
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { useThemeMode } from '@/constants/ThemeContext';
import { CloudUpload, CheckCircle, AlertCircle } from 'lucide-react-native';

interface SyncStatusIndicatorProps {
  variant?: 'default' | 'compact';
}

export function SyncStatusIndicator({ variant = 'default' }: SyncStatusIndicatorProps) {
  const { isSyncing: monitoringSyncing, lastSyncTimestamp: monitoringSyncTime } = useMonitoring();
  const { isSyncing: settingsSyncing, lastSyncTimestamp: settingsSyncTime } = useParentalControls();
  const { theme } = useThemeMode();
  const styles = createStyles(theme);

  const isSyncing = monitoringSyncing || settingsSyncing;
  const lastSync = monitoringSyncTime || settingsSyncTime;

  const formatTimeAgo = (timestamp: number | null): string => {
    if (!timestamp) return 'Никогда';
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${Math.floor(hours / 24)} дн назад`;
  };

  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        {isSyncing ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : lastSync ? (
          <CheckCircle size={16} color={theme.success} />
        ) : (
          <AlertCircle size={16} color={theme.warning} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSyncing ? (
        <>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.text}>Синхронизация...</Text>
        </>
      ) : lastSync ? (
        <>
          <CheckCircle size={16} color={theme.success} />
          <Text style={styles.text}>Обновлено {formatTimeAgo(lastSync)}</Text>
        </>
      ) : (
        <>
          <CloudUpload size={16} color={theme.warning} />
          <Text style={styles.text}>Не синхронизировано</Text>
        </>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  compactContainer: {
    padding: 4,
  },
  text: {
    fontSize: 12,
    color: theme.textSecondary,
  },
});
