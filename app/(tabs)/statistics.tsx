import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { BarChart, Shield, TrendingUp, AlertCircle, MessageCircle, RefreshCcw } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { useUser } from '@/constants/UserContext';
import { RiskLevel } from '@/constants/types';


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

export default function StatisticsScreen() {
  const { chats, alerts } = useMonitoring();
  const { user } = useUser();
  const hiQuery = {
    isLoading: false,
    error: null,
    data: {
      greeting: `Привет, ${user?.name ?? 'Родитель'}! Мониторинг активен`,
      timestamp: new Date().toISOString(),
    },
  };

  const statistics = useMemo(() => {
    const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);
    const analyzedMessages = chats.reduce(
      (sum, chat) => sum + chat.messages.filter((m) => m.analyzed).length,
      0
    );

    const riskDistribution: Record<RiskLevel, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.analyzed && message.riskLevel) {
          riskDistribution[message.riskLevel]++;
        }
      });
    });

    const unresolvedCount = alerts.filter((a) => !a.resolved).length;
    const resolvedCount = alerts.filter((a) => a.resolved).length;

    const chatRiskDistribution: Record<RiskLevel, number> = {
      safe: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    chats.forEach((chat) => {
      chatRiskDistribution[chat.overallRisk]++;
    });

    return {
      totalMessages,
      analyzedMessages,
      riskDistribution,
      unresolvedCount,
      resolvedCount,
      chatRiskDistribution,
      totalChats: chats.length,
    };
  }, [chats, alerts]);

  const maxRiskCount = Math.max(
    ...Object.values(statistics.riskDistribution),
    1
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <BarChart size={32} color="#1a1a1a" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Статистика безопасности</Text>
          {user && (
            <Text style={styles.headerSubtitle}>
              {user.name} ({user.role === 'parent' ? 'Родитель' : 'Ребенок'})
            </Text>
          )}
        </View>
      </View>

      <View style={styles.overviewCards}>
        <View style={styles.overviewCard}>
          <MessageCircle size={28} color="#FFD700" />
          <Text style={styles.overviewNumber}>{statistics.totalMessages}</Text>
          <Text style={styles.overviewLabel}>Всего сообщений</Text>
        </View>
        <View style={styles.overviewCard}>
          <Shield size={28} color="#10b981" />
          <Text style={styles.overviewNumber}>{statistics.analyzedMessages}</Text>
          <Text style={styles.overviewLabel}>Проанализировано</Text>
        </View>
      </View>

      <View style={styles.backendCard} testID="backend-status-card">
        <View style={styles.backendCardHeader}>
          <RefreshCcw size={20} color="#1a1a1a" />
          <Text style={styles.backendCardTitle}>Статус связи с сервером</Text>
        </View>
        {hiQuery.isLoading && (
          <Text style={styles.backendCardText}>Синхронизация…</Text>
        )}

        {hiQuery.data && (
          <View style={styles.backendSuccessRow}>
            <Text style={styles.backendCardText}>{hiQuery.data.greeting}</Text>
            <Text style={styles.backendCardTimestamp}>
              {new Date(hiQuery.data.timestamp).toLocaleString('ru-RU')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.overviewCards}>
        <View style={styles.overviewCard}>
          <AlertCircle size={28} color="#ef4444" />
          <Text style={styles.overviewNumber}>{statistics.unresolvedCount}</Text>
          <Text style={styles.overviewLabel}>Активных тревог</Text>
        </View>
        <View style={styles.overviewCard}>
          <TrendingUp size={28} color="#3b82f6" />
          <Text style={styles.overviewNumber}>{statistics.resolvedCount}</Text>
          <Text style={styles.overviewLabel}>Решенных</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Распределение рисков (сообщения)</Text>
        <View style={styles.chartContainer}>
          {(Object.keys(statistics.riskDistribution) as RiskLevel[]).map(
            (level) => {
              const count = statistics.riskDistribution[level];
              const percentage = statistics.analyzedMessages > 0 
                ? (count / statistics.analyzedMessages) * 100 
                : 0;
              const barWidth = maxRiskCount > 0 
                ? (count / maxRiskCount) * 100 
                : 0;

              return (
                <View key={level} style={styles.barRow}>
                  <Text style={styles.barLabel}>{RISK_LABELS[level]}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${barWidth}%`,
                          backgroundColor: RISK_COLORS[level],
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barValue}>
                    {count} ({percentage.toFixed(0)}%)
                  </Text>
                </View>
              );
            }
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статус чатов</Text>
        <View style={styles.chatStatusGrid}>
          {(Object.keys(statistics.chatRiskDistribution) as RiskLevel[]).map(
            (level) => {
              const count = statistics.chatRiskDistribution[level];
              return (
                <View
                  key={level}
                  style={[
                    styles.statusCard,
                    { borderLeftColor: RISK_COLORS[level] },
                  ]}
                >
                  <Text style={styles.statusNumber}>{count}</Text>
                  <Text style={styles.statusLabel}>{RISK_LABELS[level]}</Text>
                </View>
              );
            }
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Общий прогресс</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Охват анализа</Text>
            <Text style={styles.progressValue}>
              {statistics.totalMessages > 0
                ? ((statistics.analyzedMessages / statistics.totalMessages) * 100).toFixed(1)
                : 0}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: statistics.totalMessages > 0
                    ? `${(statistics.analyzedMessages / statistics.totalMessages) * 100}%`
                    : '0%',
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Решение тревог</Text>
            <Text style={styles.progressValue}>
              {alerts.length > 0
                ? ((statistics.resolvedCount / alerts.length) * 100).toFixed(1)
                : 0}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: alerts.length > 0
                    ? `${(statistics.resolvedCount / alerts.length) * 100}%`
                    : '0%',
                  backgroundColor: '#10b981',
                },
              ]}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFD700',
    paddingTop: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
    marginTop: 4,
  },
  overviewCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 12,
  },
  overviewLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginTop: 8,
  },
  backendCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  backendCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  backendCardTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  backendCardText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#333',
  },
  backendCardError: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ef4444',
  },
  backendSuccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  backendCardTimestamp: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  barLabel: {
    width: 90,
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#333',
  },
  barContainer: {
    flex: 1,
    height: 28,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 14,
  },
  barValue: {
    width: 70,
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
    textAlign: 'right',
  },
  chatStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusNumber: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    color: '#333',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFD700',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
});
