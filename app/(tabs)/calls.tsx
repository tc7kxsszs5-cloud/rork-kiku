import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { HapticFeedback } from '@/constants/haptics';

interface Call {
  id: string;
  contactName: string;
  phoneNumber: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  status: 'missed' | 'answered' | 'rejected';
  duration?: number;
  timestamp: number;
}

export default function CallsScreen() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const [calls] = useState<Call[]>([]);

  const styles = createStyles(theme);

  const handleCall = (phoneNumber: string, type: 'audio' | 'video') => {
    HapticFeedback.medium();
    router.push({
      pathname: '/call',
      params: {
        phoneNumber,
        type,
      },
    } as any);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const getCallIcon = (call: Call) => {
    if (call.status === 'missed') {
      return <PhoneMissed size={20} color="#ef4444" />;
    } else if (call.status === 'rejected') {
      return <PhoneOff size={20} color="#f59e0b" />;
    } else if (call.direction === 'incoming') {
      return <PhoneIncoming size={20} color="#10b981" />;
    } else {
      return <PhoneOutgoing size={20} color={theme.interactive?.primary || theme.accentPrimary} />;
    }
  };

  const renderCall = ({ item }: { item: Call }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => handleCall(item.phoneNumber, item.type)}
      activeOpacity={0.7}
    >
      <View style={styles.callIcon}>
        {getCallIcon(item)}
      </View>
      <View style={styles.callInfo}>
        <Text style={styles.callName}>{item.contactName}</Text>
        <View style={styles.callMeta}>
          {item.type === 'video' && (
            <Video size={14} color={theme.textSecondary} style={styles.callTypeIcon} />
          )}
          <Text style={styles.callMetaText}>
            {item.direction === 'incoming' ? 'Входящий' : 'Исходящий'}
            {item.duration && ` • ${formatDuration(item.duration)}`}
          </Text>
        </View>
      </View>
      <View style={styles.callActions}>
        <TouchableOpacity
          style={styles.callActionButton}
          onPress={(e) => {
            e.stopPropagation();
            handleCall(item.phoneNumber, 'audio');
          }}
        >
          <Phone size={18} color={theme.interactive?.primary || theme.accentPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callActionButton}
          onPress={(e) => {
            e.stopPropagation();
            handleCall(item.phoneNumber, 'video');
          }}
        >
          <Video size={18} color={theme.interactive?.primary || theme.accentPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.callTime}>{formatTime(item.timestamp)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {calls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Phone size={64} color={theme.textSecondary} />
          <Text style={styles.emptyText}>Нет звонков</Text>
          <Text style={styles.emptySubtext}>
            История звонков будет отображаться здесь
          </Text>
        </View>
      ) : (
        <FlatList
          data={calls}
          keyExtractor={(item) => item.id}
          renderItem={renderCall}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  listContent: {
    padding: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  callIcon: {
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTypeIcon: {
    marginRight: 4,
  },
  callMetaText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  callActions: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 12,
  },
  callActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: (theme.interactive?.primary || theme.accentPrimary) + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callTime: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});
