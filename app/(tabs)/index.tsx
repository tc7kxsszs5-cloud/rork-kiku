import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, AlertTriangle, Shield, Search, X } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { Chat, RiskLevel } from '@/constants/types';
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

export default function MonitoringScreen() {
  const router = useRouter();
  const { chats, unresolvedAlerts } = useMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'all'>('all');
  const searchBarHeight = useRef(new Animated.Value(0)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  const totalChats = chats.length;
  const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);

  const filteredChats = useMemo(() => {
    let result = chats;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chat) => {
        if (chat.isGroup && chat.groupName) {
          return chat.groupName.toLowerCase().includes(query);
        }
        return chat.participantNames.some((name) => name.toLowerCase().includes(query));
      });
    }

    if (selectedRiskFilter !== 'all') {
      result = result.filter((chat) => chat.overallRisk === selectedRiskFilter);
    }

    return result;
  }, [chats, searchQuery, selectedRiskFilter]);

  const toggleSearch = () => {
    HapticFeedback.light();
    setIsSearchVisible(!isSearchVisible);
    Animated.timing(searchBarHeight, {
      toValue: isSearchVisible ? 0 : 60,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleRiskFilter = (risk: RiskLevel | 'all') => {
    HapticFeedback.selection();
    setSelectedRiskFilter(risk);
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const messageCount = item.messages.length;
    const lastActivityText = new Date(item.lastActivity).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const chatTitle = item.isGroup ? item.groupName : item.participantNames.join(' и ');
    const chatSubtitle = item.isGroup 
      ? `${item.participants.length} участников • ${messageCount} сообщ.`
      : `${messageCount} ${messageCount === 1 ? 'сообщение' : 'сообщений'}`;

    const GROUP_TYPE_EMOJI: Record<string, string> = {
      class: '🏫',
      club: '⚽',
      group: '📚',
    };

    const groupEmoji = item.isGroup && item.groupType ? GROUP_TYPE_EMOJI[item.groupType] : '💬';

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() => {
          HapticFeedback.light();
          router.push(`/chat/${item.id}`);
        }}
      >
        <View style={styles.chatHeader}>
          <View style={[styles.chatIconContainer, item.isGroup && styles.groupIconContainer]}>
            <Text style={styles.chatEmoji}>{groupEmoji}</Text>
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatTitle}>{chatTitle}</Text>
            <Text style={styles.chatSubtitle}>{chatSubtitle}</Text>
            <Text style={styles.lastActivity}>Последняя активность: {lastActivityText}</Text>
          </View>
        </View>

        <View style={styles.chatFooter}>
          <View style={[styles.riskBadge, { backgroundColor: RISK_COLORS[item.overallRisk] }]}>
            <Shield size={14} color="#fff" />
            <Text style={styles.riskText}>{RISK_LABELS[item.overallRisk]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientBackground}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>KIDS</Text>
            <Text style={styles.headerSubtitle}>Защита переписок с AI</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
              <Search size={20} color="#1a1a1a" />
            </TouchableOpacity>
            {unresolvedAlerts.length > 0 && (
              <View style={styles.alertsBadge}>
                <AlertTriangle size={16} color="#fff" />
                <Text style={styles.alertsText}>{unresolvedAlerts.length}</Text>
              </View>
            )}
          </View>
        </View>

        <Animated.View style={[styles.searchContainer, { height: searchBarHeight, opacity: searchBarHeight.interpolate({ inputRange: [0, 60], outputRange: [0, 1] }) }]}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по участникам..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, selectedRiskFilter === 'all' && styles.filterChipActive]}
            onPress={() => handleRiskFilter('all')}
          >
            <Text style={[styles.filterChipText, selectedRiskFilter === 'all' && styles.filterChipTextActive]}>Все</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedRiskFilter === 'safe' && styles.filterChipActive, { borderColor: RISK_COLORS.safe }]}
            onPress={() => handleRiskFilter('safe')}
          >
            <Text style={[styles.filterChipText, selectedRiskFilter === 'safe' && styles.filterChipTextActive]}>Безопасно</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedRiskFilter === 'medium' && styles.filterChipActive, { borderColor: RISK_COLORS.medium }]}
            onPress={() => handleRiskFilter('medium')}
          >
            <Text style={[styles.filterChipText, selectedRiskFilter === 'medium' && styles.filterChipTextActive]}>Средний</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedRiskFilter === 'high' && styles.filterChipActive, { borderColor: RISK_COLORS.high }]}
            onPress={() => handleRiskFilter('high')}
          >
            <Text style={[styles.filterChipText, selectedRiskFilter === 'high' && styles.filterChipTextActive]}>Высокий</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MessageCircle size={28} color="#1a1a1a" />
            <Text style={styles.statNumber}>{totalChats}</Text>
            <Text style={styles.statLabel}>Чатов</Text>
          </View>
          <View style={styles.statCard}>
            <Shield size={28} color="#10b981" />
            <Text style={styles.statNumber}>{totalMessages}</Text>
            <Text style={styles.statLabel}>Сообщений</Text>
          </View>
          <View style={styles.statCard}>
            <AlertTriangle size={28} color="#ef4444" />
            <Text style={styles.statNumber}>{unresolvedAlerts.length}</Text>
            <Text style={styles.statLabel}>Тревог</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle size={48} color="#ccc" />
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  gradientBackground: {
    backgroundColor: '#FFD700',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#4a4a4a',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#666',
    marginTop: 4,
  },
  alertsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  alertsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#999',
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chatIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  groupIconContainer: {
    backgroundColor: '#FFE5B4',
  },
  chatEmoji: {
    fontSize: 24,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: 12,
    color: '#999',
  },
  chatFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
});
