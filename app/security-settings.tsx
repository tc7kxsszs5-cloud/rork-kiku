import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, TrendingUp, AlertCircle, MessageCircle, RefreshCcw } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useUser } from '@/constants/UserContext';
import { RiskLevel } from '@/constants/types';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: '#10b981',
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#991b1b',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  safe: 'Безопасно',
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

export default function SecuritySettingsScreen() {
  const { chats, alerts } = useMonitoring();
  const { user } = useUser();
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statistics = useMemo(() => {
    const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);
    const analyzedMessages = chats.reduce(
      (sum, chat) => sum + chat.messages.filter((message) => message.analyzed).length,
      0,
    );

    const riskDistribution: Record<RiskLevel, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const chatRiskDistribution: Record<RiskLevel, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.analyzed && message.riskLevel) {
          riskDistribution[message.riskLevel] += 1;
        }
      });

      chatRiskDistribution[chat.overallRisk] += 1;
    });

    const unresolvedCount = alerts.filter((alertItem) => !alertItem.resolved).length;
    const resolvedCount = alerts.length - unresolvedCount;

    return {
      totalMessages,
      analyzedMessages,
      riskDistribution,
      chatRiskDistribution,
      unresolvedCount,
      resolvedCount,
      totalChats: chats.length,
    };
  }, [alerts, chats]);

  const maxRiskCount = Math.max(...Object.values(statistics.riskDistribution), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} testID="security-settings-screen">
      <LinearGradient colors={theme.heroGradient} style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Shield size={36} color={theme.isDark ? '#fef3c7' : '#0b1220'} />
          <View style={styles.heroTextWrapper}>
            <Text style={styles.heroTitle}>Центр безопасности</Text>
            <Text style={styles.heroSubtitle}>
              {user?.name ?? 'Родитель'} • {((user?.children?.length ?? 0) > 0 || user?.email) ? 'Родитель' : 'Ребенок'}
            </Text>
          </View>
        </View>
        <View style={styles.heroBadges}>
          <View style={styles.badge}>
            <MessageCircle size={18} color={theme.isDark ? '#0b1220' : '#fef3c7'} />
            <Text style={styles.badgeText}>{statistics.totalChats} чатов под защитой</Text>
          </View>
          <View style={styles.badge}>
            <TrendingUp size={18} color={theme.isDark ? '#0b1220' : '#fef3c7'} />
            <Text style={styles.badgeText}>{statistics.analyzedMessages} сообщений проанализировано</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статусы тревог</Text>
        <View style={styles.overviewRow}>
          <View style={styles.overviewCard}>
            <AlertCircle size={28} color="#ef4444" />
            <Text style={styles.overviewValue}>{statistics.unresolvedCount}</Text>
            <Text style={styles.overviewLabel}>Активных тревог</Text>
          </View>
          <View style={styles.overviewCard}>
            <TrendingUp size={28} color="#22c55e" />
            <Text style={styles.overviewValue}>{statistics.resolvedCount}</Text>
            <Text style={styles.overviewLabel}>Решено</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Распределение рисков</Text>
          <RefreshCcw size={18} color={theme.textSecondary} />
        </View>
        <View style={styles.chartCard}>
          {(Object.keys(statistics.riskDistribution) as RiskLevel[]).map((level) => {
            const count = statistics.riskDistribution[level];
            const barWidth = maxRiskCount > 0 ? (count / maxRiskCount) * 100 : 0;
            const percentage = statistics.analyzedMessages > 0 ? (count / statistics.analyzedMessages) * 100 : 0;

            return (
              <View style={styles.barRow} key={level}>
                <Text style={styles.barLabel}>{RISK_LABELS[level]}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: RISK_COLORS[level] }]} />
                </View>
                <Text style={styles.barValue}>
                  {count} • {percentage.toFixed(0)}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Состояние чатов</Text>
        <View style={styles.chatGrid}>
          {(Object.keys(statistics.chatRiskDistribution) as RiskLevel[]).map((level) => (
            <View key={level} style={[styles.chatCard, { borderLeftColor: RISK_COLORS[level] }]}
              testID={`security-chat-${level}`}>
              <Text style={styles.chatValue}>{statistics.chatRiskDistribution[level]}</Text>
              <Text style={styles.chatLabel}>{RISK_LABELS[level]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Покрытие защиты</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Сообщения под наблюдением</Text>
            <Text style={styles.progressValue}>
              {statistics.totalMessages > 0
                ? ((statistics.analyzedMessages / statistics.totalMessages) * 100).toFixed(1)
                : '0.0'}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: statistics.totalMessages > 0
                    ? `${(statistics.analyzedMessages / statistics.totalMessages) * 100}%`
                    : '0%',
                },
              ]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    shadowColor: theme.isDark ? '#000' : theme.accentPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: theme.isDark ? 0.45 : 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroTextWrapper: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: theme.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 4,
  },
  heroBadges: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textPrimary,
  },
  section: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: theme.isDark ? 0.4 : 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  overviewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    backgroundColor: theme.cardMuted,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: theme.textPrimary,
    marginTop: 12,
  },
  overviewLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  chartCard: {
    gap: 14,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 16,
    borderRadius: 999,
    backgroundColor: theme.cardMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  barValue: {
    width: 80,
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'right' as const,
  },
  chatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chatCard: {
    flexBasis: '48%',
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 16,
    borderLeftWidth: 4,
    borderColor: theme.borderSoft,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: theme.isDark ? 0.3 : 0.08,
    shadowRadius: 6,
  },
  chatValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: theme.textPrimary,
  },
  chatLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.textSecondary,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.accentPrimary,
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.accentPrimary,
  },
});
