import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Activity,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Users,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useParentalControls } from '@/constants/ParentalControlsContext';
import { useUser } from '@/constants/UserContext';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { RiskLevel } from '@/constants/types';

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: '#22c55e',
  low: '#eab308',
  medium: '#f97316',
  high: '#ef4444',
  critical: '#dc2626',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  safe: 'Безопасно',
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

export default function DashboardScreen() {
  const { chats, alerts, unresolvedAlerts } = useMonitoring();
  const { settings, timeRestrictions, contacts } = useParentalControls();
  const { user, userAge } = useUser();
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Calculate statistics
  const totalMessages = useMemo(() => {
    return chats.reduce((sum, chat) => sum + chat.messages.length, 0);
  }, [chats]);

  const analyzedMessages = useMemo(() => {
    return chats.reduce((sum, chat) => {
      return sum + chat.messages.filter((msg) => msg.analyzed).length;
    }, 0);
  }, [chats]);

  const riskDistribution = useMemo(() => {
    const distribution: Record<RiskLevel, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    chats.forEach((chat) => {
      chat.messages.forEach((msg) => {
        if (msg.riskLevel) {
          distribution[msg.riskLevel]++;
        }
      });
    });

    return distribution;
  }, [chats]);

  const activeChats = useMemo(() => {
    return chats.filter((chat) => chat.messages.length > 0).length;
  }, [chats]);

  const whitelistedContactsCount = useMemo(() => {
    return contacts.filter((c) => c.isWhitelisted).length;
  }, [contacts]);

  const dailyUsageLimit = settings.dailyUsageLimit;
  const activeTimeRestrictions = timeRestrictions.filter((r) => r.enabled).length;

  const resolvedAlerts = useMemo(() => {
    return alerts.filter((a) => a.resolved).length;
  }, [alerts]);

  const analysisPercentage = totalMessages > 0 ? Math.round((analyzedMessages / totalMessages) * 100) : 0;
  const resolutionRate = alerts.length > 0 ? Math.round((resolvedAlerts / alerts.length) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="dashboard-screen">
      <LinearGradient colors={theme.heroGradient} style={styles.heroCard}>
        <View style={styles.heroIconWrapper}>
          <Activity color={theme.textPrimary} size={32} />
        </View>
        <Text style={styles.heroTitle}>Панель мониторинга</Text>
        <Text style={styles.heroSubtitle}>
          {user?.role === 'parent' ? 'Контроль активности' : 'Статистика активности'}
        </Text>
        {userAge && (
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Возраст: {userAge} лет</Text>
          </View>
        )}
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Быстрая статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MessageSquare size={24} color={theme.accentPrimary} />
            <Text style={styles.statValue}>{totalMessages}</Text>
            <Text style={styles.statLabel}>Всего сообщений</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#10b981" />
            <Text style={styles.statValue}>{activeChats}</Text>
            <Text style={styles.statLabel}>Активных чатов</Text>
          </View>
          <View style={styles.statCard}>
            <AlertTriangle size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{unresolvedAlerts.length}</Text>
            <Text style={styles.statLabel}>Активных тревог</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle2 size={24} color="#22c55e" />
            <Text style={styles.statValue}>{resolvedAlerts}</Text>
            <Text style={styles.statLabel}>Решённых тревог</Text>
          </View>
        </View>
      </View>

      {/* Analysis Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Прогресс анализа</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>AI анализ сообщений</Text>
            <Text style={styles.progressValue}>{analysisPercentage}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${analysisPercentage}%` }]}
              testID="dashboard-analysis-progress"
            />
          </View>
          <Text style={styles.progressInfo}>
            {analyzedMessages} из {totalMessages} сообщений проанализировано
          </Text>
        </View>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Скорость решения тревог</Text>
            <Text style={styles.progressValue}>{resolutionRate}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${resolutionRate}%`, backgroundColor: '#22c55e' }]}
              testID="dashboard-resolution-progress"
            />
          </View>
          <Text style={styles.progressInfo}>
            {resolvedAlerts} из {alerts.length} тревог решено
          </Text>
        </View>
      </View>

      {/* Risk Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Распределение рисков</Text>
        {Object.entries(riskDistribution).map(([level, count]) => {
          const riskLevel = level as RiskLevel;
          const percentage = totalMessages > 0 ? (count / totalMessages) * 100 : 0;
          return (
            <View key={level} style={styles.riskRow} testID={`dashboard-risk-${level}`}>
              <View style={styles.riskLabelRow}>
                <View style={[styles.riskDot, { backgroundColor: RISK_COLORS[riskLevel] }]} />
                <Text style={styles.riskLabel}>{RISK_LABELS[riskLevel]}</Text>
              </View>
              <View style={styles.riskStats}>
                <Text style={styles.riskCount}>{count}</Text>
                <View style={styles.riskBarContainer}>
                  <View
                    style={[
                      styles.riskBar,
                      { width: `${Math.max(2, percentage)}%`, backgroundColor: RISK_COLORS[riskLevel] },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Parental Controls Status */}
      {user?.role === 'parent' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статус родительского контроля</Text>
          <View style={styles.controlRow}>
            <Clock size={20} color={theme.textPrimary} />
            <View style={styles.controlTextWrapper}>
              <Text style={styles.controlLabel}>Временные ограничения</Text>
              <Text style={styles.controlValue}>
                {settings.timeRestrictionsEnabled
                  ? `Активно: ${activeTimeRestrictions} правил`
                  : 'Выключено'}
              </Text>
            </View>
          </View>
          <View style={styles.controlRow}>
            <Calendar size={20} color={theme.textPrimary} />
            <View style={styles.controlTextWrapper}>
              <Text style={styles.controlLabel}>Дневной лимит использования</Text>
              <Text style={styles.controlValue}>{dailyUsageLimit} минут</Text>
            </View>
          </View>
          <View style={styles.controlRow}>
            <Users size={20} color={theme.textPrimary} />
            <View style={styles.controlTextWrapper}>
              <Text style={styles.controlLabel}>Разрешённые контакты</Text>
              <Text style={styles.controlValue}>{whitelistedContactsCount} контактов</Text>
            </View>
          </View>
          <View style={styles.controlRow}>
            <CheckCircle2 size={20} color={theme.textPrimary} />
            <View style={styles.controlTextWrapper}>
              <Text style={styles.controlLabel}>Фильтрация изображений</Text>
              <Text style={styles.controlValue}>
                {settings.imageFilteringEnabled ? 'Включена' : 'Выключена'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Activity Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Аналитика активности</Text>
        <View style={styles.insightCard}>
          <TrendingUp size={24} color={theme.accentPrimary} />
          <View style={styles.insightTextWrapper}>
            <Text style={styles.insightTitle}>Общая безопасность</Text>
            <Text style={styles.insightDescription}>
              {riskDistribution.critical > 0
                ? `Обнаружено ${riskDistribution.critical} критических угроз. Требуется немедленное внимание!`
                : riskDistribution.high > 0
                  ? `Обнаружено ${riskDistribution.high} высоких рисков. Рекомендуется проверка.`
                  : riskDistribution.medium > 0
                    ? `Обнаружено ${riskDistribution.medium} средних рисков. Всё под контролем.`
                    : 'Все сообщения безопасны. Продолжайте мониторинг!'}
            </Text>
          </View>
        </View>
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
      paddingBottom: 80,
      gap: 20,
    },
    heroCard: {
      borderRadius: 28,
      padding: 24,
      shadowColor: theme.accentPrimary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: theme.isDark ? 0.35 : 0.25,
      shadowRadius: 20,
      elevation: 8,
    },
    heroIconWrapper: {
      width: 60,
      height: 60,
      borderRadius: 18,
      backgroundColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    heroSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    heroBadge: {
      marginTop: 12,
      backgroundColor: theme.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    heroBadgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: Platform.OS === 'web' ? 0.08 : theme.isDark ? 0.25 : 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.textPrimary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    progressCard: {
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      marginBottom: 12,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    progressValue: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.accentPrimary,
    },
    progressBarTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: theme.borderSoft,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: theme.accentPrimary,
    },
    progressInfo: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    riskRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: theme.borderSoft,
    },
    riskLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    riskDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    riskLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    riskStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    riskCount: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
      minWidth: 30,
      textAlign: 'right',
    },
    riskBarContainer: {
      width: 80,
      height: 6,
      borderRadius: 999,
      backgroundColor: theme.borderSoft,
      overflow: 'hidden',
    },
    riskBar: {
      height: '100%',
      borderRadius: 999,
    },
    controlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: theme.borderSoft,
    },
    controlTextWrapper: {
      flex: 1,
    },
    controlLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    controlValue: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 2,
    },
    insightCard: {
      flexDirection: 'row',
      gap: 16,
      backgroundColor: theme.cardMuted,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    insightTextWrapper: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    insightDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 4,
      lineHeight: 18,
    },
  });
