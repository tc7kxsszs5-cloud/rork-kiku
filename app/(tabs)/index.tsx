import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, AlertTriangle, Shield, Search, X, Calendar, Users, Filter } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { Chat, RiskLevel } from '@/constants/types';
import { HapticFeedback } from '@/constants/haptics';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';
import { ThemeModeToggle } from '@/components/ThemeModeToggle';
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator';

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

type DateFilter = 'all' | 'today' | 'week' | 'month';

export default function MonitoringScreen() {
  const router = useRouter();
  const { chats, unresolvedAlerts } = useMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [participantFilter, setParticipantFilter] = useState<string | 'all'>('all');
  const searchBarHeight = useRef(new Animated.Value(0)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const totalChats = chats.length;
  const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);

  // Получаем список всех участников для фильтра
  const allParticipants = useMemo(() => {
    const participantsSet = new Set<string>();
    chats.forEach((chat) => {
      chat.participants.forEach((p) => participantsSet.add(p));
      chat.participantNames.forEach((n) => participantsSet.add(n));
    });
    return Array.from(participantsSet).sort();
  }, [chats]);

  const filteredChats = useMemo(() => {
    let result = chats;

    // Расширенный поиск по содержимому сообщений и названиям чатов
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chat) => {
        // Поиск по названию чата/участникам
        const nameMatch = chat.isGroup && chat.groupName
          ? chat.groupName.toLowerCase().includes(query)
          : chat.participantNames.some((name) => name.toLowerCase().includes(query));

        // Поиск по содержимому сообщений
        const messageMatch = chat.messages.some((msg) =>
          msg.text.toLowerCase().includes(query)
        );

        return nameMatch || messageMatch;
      });
    }

    // Фильтр по типу риска
    if (selectedRiskFilter !== 'all') {
      result = result.filter((chat) => chat.overallRisk === selectedRiskFilter);
    }

    // Фильтр по дате (последняя активность)
    if (dateFilter !== 'all') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      let timeThreshold: number;

      switch (dateFilter) {
        case 'today':
          timeThreshold = now - dayMs;
          break;
        case 'week':
          timeThreshold = now - 7 * dayMs;
          break;
        case 'month':
          timeThreshold = now - 30 * dayMs;
          break;
        default:
          timeThreshold = 0;
      }

      result = result.filter((chat) => chat.lastActivity >= timeThreshold);
    }

    // Фильтр по участнику
    if (participantFilter !== 'all') {
      result = result.filter((chat) =>
        chat.participants.includes(participantFilter) ||
        chat.participantNames.includes(participantFilter)
      );
    }

    return result;
  }, [chats, searchQuery, selectedRiskFilter, dateFilter, participantFilter]);

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

  const renderChat = useCallback(({ item }: { item: Chat }) => {
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
          router.push(`/chat/${item.id}` as any);
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
  }, [router, styles]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.surfaceGradient} style={styles.gradientBackground}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>KIDS</Text>
            <Text style={styles.headerSubtitle}>Защита переписок с AI</Text>
          </View>
          <View style={styles.headerActions}>
            <SyncStatusIndicator variant="compact" />
            <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
              <Search size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <ThemeModeToggle variant="compact" style={styles.headerToggle} />
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
            <Search size={18} color={theme.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по участникам и содержимому сообщений..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.filterToggleButton, showAdvancedFilters && styles.filterToggleButtonActive]}
              onPress={() => {
                setShowAdvancedFilters(!showAdvancedFilters);
                HapticFeedback.light();
              }}
            >
              <Filter size={16} color={showAdvancedFilters ? '#fff' : theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {showAdvancedFilters && (
          <View style={styles.advancedFiltersContainer}>
            <View style={styles.advancedFiltersSection}>
              <View style={styles.filterSectionHeader}>
                <Calendar size={16} color={theme.textSecondary} />
                <Text style={styles.filterSectionTitle}>Период</Text>
              </View>
              <View style={styles.filterChipsRow}>
                {(['all', 'today', 'week', 'month'] as DateFilter[]).map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.filterChip, dateFilter === filter && styles.filterChipActive]}
                    onPress={() => {
                      setDateFilter(filter);
                      HapticFeedback.selection();
                    }}
                  >
                    <Text style={[styles.filterChipText, dateFilter === filter && styles.filterChipTextActive]}>
                      {filter === 'all' ? 'Все' : filter === 'today' ? 'Сегодня' : filter === 'week' ? 'Неделя' : 'Месяц'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {allParticipants.length > 0 && (
              <View style={styles.advancedFiltersSection}>
                <View style={styles.filterSectionHeader}>
                  <Users size={16} color={theme.textSecondary} />
                  <Text style={styles.filterSectionTitle}>Участник</Text>
                </View>
                <View style={styles.filterChipsRow}>
                  <TouchableOpacity
                    style={[styles.filterChip, participantFilter === 'all' && styles.filterChipActive]}
                    onPress={() => {
                      setParticipantFilter('all');
                      HapticFeedback.selection();
                    }}
                  >
                    <Text style={[styles.filterChipText, participantFilter === 'all' && styles.filterChipTextActive]}>Все</Text>
                  </TouchableOpacity>
                  {allParticipants.slice(0, 5).map((participant) => (
                    <TouchableOpacity
                      key={participant}
                      style={[styles.filterChip, participantFilter === participant && styles.filterChipActive]}
                      onPress={() => {
                        setParticipantFilter(participant);
                        HapticFeedback.selection();
                      }}
                    >
                      <Text style={[styles.filterChipText, participantFilter === participant && styles.filterChipTextActive]}>
                        {participant.length > 12 ? `${participant.substring(0, 12)}...` : participant}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

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
            <MessageCircle size={28} color={theme.textPrimary} />
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
      </LinearGradient>

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        // Оптимизация производительности
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 150, // Примерная высота карточки чата
          offset: 150 * index,
          index,
        })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle size={48} color={theme.borderSoft} />
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (theme: ThemePalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  gradientBackground: {
    paddingBottom: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    color: theme.textPrimary,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: theme.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerToggle: {
    marginLeft: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.accentPrimary,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.textPrimary,
  },
  filterToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleButtonActive: {
    backgroundColor: theme.accentPrimary,
  },
  advancedFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: theme.cardMuted,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  advancedFiltersSection: {
    marginBottom: 12,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textSecondary,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    backgroundColor: theme.card,
    borderWidth: 2,
    borderColor: theme.borderSoft,
  },
  filterChipActive: {
    backgroundColor: theme.accentPrimary,
    borderColor: theme.accentPrimary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.textSecondary,
  },
  filterChipTextActive: {
    color: theme.isDark ? theme.backgroundPrimary : '#0b1220',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.4 : 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: theme.isDark ? 1 : 0,
    borderColor: theme.borderSoft,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: theme.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    marginHorizontal: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.textPrimary,
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: theme.backgroundPrimary,
  },
  chatCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: theme.isDark ? 0.35 : 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chatIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  groupIconContainer: {
    backgroundColor: theme.accentMuted,
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
    color: theme.textPrimary,
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: 12,
    color: theme.textSecondary,
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
