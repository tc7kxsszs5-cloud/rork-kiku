import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { Alert, RiskLevel } from '@/constants/types';
import { HapticFeedback } from '@/constants/haptics';

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

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, chats, resolveAlert } = useMonitoring();

  const getChatName = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat ? chat.participantNames.join(' и ') : 'Неизвестный чат';
  };

  const getMessage = (chatId: string, messageId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return null;
    return chat.messages.find((m) => m.id === messageId);
  };

  const renderAlert = ({ item }: { item: Alert }) => {
    const message = getMessage(item.chatId, item.messageId);
    const chatName = getChatName(item.chatId);

    return (
      <View style={[styles.alertCard, item.resolved && styles.resolvedCard]}>
        <View style={styles.alertHeader}>
          <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[item.riskLevel] }]}>
            <AlertTriangle size={14} color="#fff" />
            <Text style={styles.riskText}>{RISK_LABELS[item.riskLevel]}</Text>
          </View>
          <View style={styles.statusBadge}>
            {item.resolved ? (
              <CheckCircle size={14} color="#10b981" />
            ) : (
              <Clock size={14} color="#f59e0b" />
            )}
          </View>
        </View>

        <TouchableOpacity onPress={() => {
          HapticFeedback.light();
          router.push({ pathname: '/chat/[chatId]', params: { chatId: item.chatId } });
        }}>
          <Text style={styles.chatName}>{chatName}</Text>
        </TouchableOpacity>

        {message && (
          <View style={styles.messagePreview}>
            <Text style={styles.messageText} numberOfLines={2}>
              {message.text}
            </Text>
          </View>
        )}

        {item.reasons.length > 0 && (
          <View style={styles.reasonsContainer}>
            <Text style={styles.reasonsTitle}>Причины тревоги:</Text>
            {item.reasons.map((reason, index) => (
              <Text key={index} style={styles.reasonText}>
                • {reason}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.alertFooter}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {!item.resolved && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => {
                HapticFeedback.success();
                resolveAlert(item.id);
              }}
            >
              <CheckCircle size={16} color="#10b981" />
              <Text style={styles.resolveText}>Отметить решенным</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Активные уведомления</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unresolvedAlerts.length}</Text>
            </View>
          </View>

          {unresolvedAlerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <CheckCircle size={48} color="#10b981" />
              <Text style={styles.emptyText}>Нет активных уведомлений</Text>
              <Text style={styles.emptySubtext}>Все переписки безопасны</Text>
            </View>
          ) : (
            <FlatList
              data={unresolvedAlerts}
              renderItem={renderAlert}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {resolvedAlerts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Решенные</Text>
              <View style={[styles.countBadge, styles.resolvedCountBadge]}>
                <Text style={styles.countText}>{resolvedAlerts.length}</Text>
              </View>
            </View>

            <FlatList
              data={resolvedAlerts}
              renderItem={renderAlert}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  resolvedCountBadge: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  resolvedCard: {
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#007AFF',
    marginBottom: 8,
  },
  messagePreview: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reasonsContainer: {
    marginBottom: 12,
  },
  reasonsTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  resolveText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#10b981',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
  },
});
