import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { useNotifications } from '@/constants/NotificationsContext';
import { useThemeMode } from '@/constants/ThemeContext';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Smartphone,
  Bell,
  Server,
  Zap,
} from 'lucide-react-native';
import { NotificationTestResult, NotificationTestType } from '@/constants/types';

const getStatusIcon = (status: 'passed' | 'failed', color: string) => {
  return status === 'passed' ? (
    <CheckCircle2 size={24} color={color} />
  ) : (
    <XCircle size={24} color={color} />
  );
};

const getTestTypeIcon = (type: NotificationTestType, color: string) => {
  switch (type) {
    case 'permissions':
      return <Bell size={20} color={color} />;
    case 'token':
      return <Zap size={20} color={color} />;
    case 'sync':
      return <Server size={20} color={color} />;
    case 'delivery':
      return <CheckCircle2 size={20} color={color} />;
  }
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function NotificationsDiagnosticsScreen() {
  const { theme } = useThemeMode();
  const {
    deviceId,
    permissionStatus,
    expoPushToken,
    serverRecord,
    lastDiagnostics,
    isRunningDiagnostics,
    runDiagnostics,
    refreshStatus,
    isSupported,
  } = useNotifications();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRunDiagnostics = async () => {
    try {
      await runDiagnostics();
    } catch (error) {
      console.error('Diagnostics failed:', error);
    }
  };

  const getOverallStatus = () => {
    if (!isSupported) return 'unavailable';
    if (permissionStatus !== 'granted') return 'warning';
    if (!expoPushToken) return 'warning';
    if (!serverRecord?.lastSyncedAt) return 'warning';
    
    const hasFailedTests = lastDiagnostics.some((t) => t.status === 'failed');
    if (hasFailedTests) return 'warning';
    
    return 'healthy';
  };

  const overallStatus = getOverallStatus();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundPrimary }]}>
      <Stack.Screen
        options={{
          title: 'Диагностика уведомлений',
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.headerText,
          headerTitleStyle: { color: theme.headerText },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={[styles.statusCard, { backgroundColor: theme.card }]}>
          <View style={styles.statusHeader}>
            {overallStatus === 'healthy' && <CheckCircle2 size={32} color="#10b981" />}
            {overallStatus === 'warning' && <AlertCircle size={32} color="#f59e0b" />}
            {overallStatus === 'unavailable' && <XCircle size={32} color="#ef4444" />}
            <View style={styles.statusTextContainer}>
              <Text style={[styles.statusTitle, { color: theme.textPrimary }]}>
                {overallStatus === 'healthy' && 'Все работает'}
                {overallStatus === 'warning' && 'Требует внимания'}
                {overallStatus === 'unavailable' && 'Недоступно'}
              </Text>
              <Text style={[styles.statusSubtitle, { color: theme.textSecondary }]}>
                {overallStatus === 'healthy' && 'Уведомления настроены корректно'}
                {overallStatus === 'warning' && 'Некоторые функции не работают'}
                {overallStatus === 'unavailable' && 'Платформа не поддерживается'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color={theme.accentPrimary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Информация об устройстве</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Device ID</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]} numberOfLines={1} ellipsizeMode="middle">
              {deviceId || 'Не установлен'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Платформа</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {serverRecord?.platform || 'Неизвестно'}
            </Text>
          </View>
          {serverRecord?.appVersion && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Версия приложения</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{serverRecord.appVersion}</Text>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={theme.accentPrimary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Статус компонентов</Text>
          </View>

          <View style={styles.componentRow}>
            <View style={styles.componentLeft}>
              {getStatusIcon(permissionStatus === 'granted' ? 'passed' : 'failed', permissionStatus === 'granted' ? '#10b981' : '#ef4444')}
              <Text style={[styles.componentLabel, { color: theme.textPrimary }]}>Разрешения</Text>
            </View>
            <Text style={[styles.componentStatus, { color: theme.textSecondary }]}>
              {permissionStatus === 'granted' ? 'Выданы' : permissionStatus === 'unavailable' ? 'Недоступно' : 'Не выданы'}
            </Text>
          </View>

          <View style={styles.componentRow}>
            <View style={styles.componentLeft}>
              {getStatusIcon(expoPushToken ? 'passed' : 'failed', expoPushToken ? '#10b981' : '#ef4444')}
              <Text style={[styles.componentLabel, { color: theme.textPrimary }]}>Push токен</Text>
            </View>
            <Text style={[styles.componentStatus, { color: theme.textSecondary }]}>
              {expoPushToken ? 'Получен' : 'Отсутствует'}
            </Text>
          </View>

          <View style={styles.componentRow}>
            <View style={styles.componentLeft}>
              {getStatusIcon(serverRecord?.lastSyncedAt ? 'passed' : 'failed', serverRecord?.lastSyncedAt ? '#10b981' : '#ef4444')}
              <Text style={[styles.componentLabel, { color: theme.textPrimary }]}>Синхронизация</Text>
            </View>
            <Text style={[styles.componentStatus, { color: theme.textSecondary }]}>
              {serverRecord?.lastSyncedAt ? formatTimestamp(serverRecord.lastSyncedAt) : 'Не синхронизировано'}
            </Text>
          </View>

          {expoPushToken && (
            <View style={[styles.tokenContainer, { backgroundColor: theme.backgroundPrimary }]}>
              <Text style={[styles.tokenLabel, { color: theme.textSecondary }]}>Expo Push Token:</Text>
              <Text style={[styles.tokenValue, { color: theme.textSecondary }]} numberOfLines={2} ellipsizeMode="middle">
                {expoPushToken}
              </Text>
            </View>
          )}
        </View>

        {lastDiagnostics.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Zap size={20} color={theme.accentPrimary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Результаты диагностики</Text>
            </View>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              {serverRecord?.lastTestedAt && `Последний тест: ${formatTimestamp(serverRecord.lastTestedAt)}`}
            </Text>

            {lastDiagnostics.map((test: NotificationTestResult) => (
              <View key={test.id} style={[styles.testCard, { backgroundColor: theme.backgroundPrimary }]}>
                <View style={styles.testHeader}>
                  <View style={styles.testIconContainer}>
                    {getTestTypeIcon(test.type, theme.accentPrimary)}
                    {getStatusIcon(test.status, test.status === 'passed' ? '#10b981' : '#ef4444')}
                  </View>
                  <View style={styles.testInfo}>
                    <Text style={[styles.testMessage, { color: theme.textPrimary }]}>{test.message}</Text>
                    <Text style={[styles.testTimestamp, { color: theme.textSecondary }]}>
                      {formatTimestamp(test.timestamp)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.diagnosticsButton,
            { backgroundColor: theme.accentPrimary },
            isRunningDiagnostics && styles.diagnosticsButtonDisabled,
          ]}
          onPress={handleRunDiagnostics}
          disabled={isRunningDiagnostics || !isSupported}
        >
          {isRunningDiagnostics ? (
            <>
              <ActivityIndicator color="#ffffff" size="small" style={styles.buttonLoader} />
              <Text style={styles.diagnosticsButtonText}>Выполняется диагностика...</Text>
            </>
          ) : (
            <>
              <RefreshCw size={20} color="#ffffff" />
              <Text style={styles.diagnosticsButtonText}>Запустить диагностику</Text>
            </>
          )}
        </TouchableOpacity>

        {!isSupported && (
          <View style={[styles.warningCard, { backgroundColor: '#fef3c7' }]}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={[styles.warningText, { color: '#92400e' }]}>
              Пуш-уведомления недоступны на веб-платформе. Используйте мобильное устройство для полной функциональности.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 2,
    textAlign: 'right',
  },
  componentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  componentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  componentLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 12,
  },
  componentStatus: {
    fontSize: 12,
  },
  tokenContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 10,
    fontFamily: 'monospace' as const,
  },
  testCard: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  testIconContainer: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testMessage: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  testTimestamp: {
    fontSize: 11,
  },
  diagnosticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  diagnosticsButtonDisabled: {
    opacity: 0.6,
  },
  diagnosticsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
    marginLeft: 8,
  },
  buttonLoader: {
    marginRight: 8,
  },
  warningCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  warningText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});
