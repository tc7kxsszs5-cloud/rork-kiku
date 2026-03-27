import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Trophy, Flame, Star, Shield, BookOpen, Users, Lock } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { useGamification } from '@/constants/GamificationContext';

const RARITY_COLORS = {
  common: '#6b7280',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const RARITY_LABELS = {
  common: 'Обычное',
  rare: 'Редкое',
  epic: 'Эпическое',
  legendary: 'Легендарное',
};

const CATEGORY_ICONS: Record<string, any> = {
  safety: Shield,
  education: BookOpen,
  streak: Flame,
  social: Users,
};

export default function AchievementsScreen() {
  const { theme } = useThemeMode();
  const { data, getNextLevelPoints, getProgressToNextLevel, checkIn } = useGamification();
  const styles = createStyles(theme);

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

  const progressToNext = getProgressToNextLevel();
  const nextLevelPoints = getNextLevelPoints();
  const unlockedCount = data.achievements.filter((a) => a.unlockedAt).length;

  const grouped = data.achievements.reduce<Record<string, typeof data.achievements>>(
    (acc, a) => {
      if (!acc[a.category]) acc[a.category] = [];
      acc[a.category].push(a);
      return acc;
    },
    {}
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Trophy size={36} color={theme.accentPrimary} />
        <Text style={styles.headerTitle}>Достижения</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount} из {data.achievements.length} разблокировано
        </Text>
      </View>

      {/* Карточка уровня */}
      <View style={styles.levelCard}>
        <View style={styles.levelRow}>
          <View>
            <Text style={styles.levelLabel}>Уровень</Text>
            <Text style={styles.levelValue}>{data.level}</Text>
          </View>
          <View style={styles.pointsBox}>
            <Star size={16} color={theme.accentPrimary} />
            <Text style={styles.pointsText}>{data.points} очков</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressToNext}%` as any }]} />
        </View>
        <Text style={styles.progressLabel}>
          До уровня {data.level + 1}: {nextLevelPoints - data.points} очков
        </Text>

        {/* Streak */}
        <TouchableOpacity style={styles.streakRow} onPress={checkIn}>
          <Flame size={20} color="#f59e0b" />
          <Text style={styles.streakText}>
            Серия: {data.dailyStreak.current} дней
          </Text>
          {data.dailyStreak.longest > 0 && (
            <Text style={styles.streakRecord}>
              Рекорд: {data.dailyStreak.longest}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Статистика */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Shield size={20} color="#10b981" />
          <Text style={styles.statValue}>{data.stats.safeDays}</Text>
          <Text style={styles.statLabel}>Безоп. дней</Text>
        </View>
        <View style={styles.statCard}>
          <BookOpen size={20} color="#3b82f6" />
          <Text style={styles.statValue}>{data.stats.lessonsCompleted}</Text>
          <Text style={styles.statLabel}>Уроков</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={20} color="#f59e0b" />
          <Text style={styles.statValue}>{data.stats.challengesWon}</Text>
          <Text style={styles.statLabel}>Побед</Text>
        </View>
      </View>

      {/* Достижения по категориям */}
      {Object.entries(grouped).map(([category, items]) => {
        const Icon = CATEGORY_ICONS[category] || Trophy;
        const categoryLabels: Record<string, string> = {
          safety: 'Безопасность',
          education: 'Обучение',
          streak: 'Серии',
          social: 'Сообщество',
        };
        return (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon size={18} color={theme.accentPrimary} />
              <Text style={styles.sectionTitle}>{categoryLabels[category] || category}</Text>
            </View>
            {items.map((achievement) => {
              const isUnlocked = !!achievement.unlockedAt;
              const rarityColor = RARITY_COLORS[achievement.rarity];
              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    { borderLeftColor: rarityColor },
                    !isUnlocked && styles.achievementCardLocked,
                  ]}
                >
                  <View style={[styles.achievementIcon, { backgroundColor: rarityColor + '20' }]}>
                    {isUnlocked ? (
                      <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                    ) : (
                      <Lock size={24} color={theme.textSecondary} />
                    )}
                  </View>
                  <View style={styles.achievementInfo}>
                    <View style={styles.achievementTitleRow}>
                      <Text style={[styles.achievementTitle, !isUnlocked && styles.textMuted]}>
                        {achievement.title}
                      </Text>
                      <Text style={[styles.rarityBadge, { color: rarityColor }]}>
                        {RARITY_LABELS[achievement.rarity]}
                      </Text>
                    </View>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    {achievement.progress > 0 && !isUnlocked && (
                      <View style={styles.achievementProgressBg}>
                        <View
                          style={[
                            styles.achievementProgressFill,
                            { width: `${achievement.progress}%` as any, backgroundColor: rarityColor },
                          ]}
                        />
                      </View>
                    )}
                    {isUnlocked && achievement.unlockedAt && (
                      <Text style={styles.unlockedDate}>
                        Получено: {new Date(achievement.unlockedAt).toLocaleDateString('ru-RU')}
                      </Text>
                    )}
                  </View>
                  {isUnlocked && (
                    <View style={[styles.checkBadge, { backgroundColor: rarityColor }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
      gap: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    headerSubtitle: {
      fontSize: 15,
      color: theme.textSecondary,
    },
    levelCard: {
      backgroundColor: theme.card || theme.backgroundSecondary,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 12,
    },
    levelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    levelLabel: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    levelValue: {
      fontSize: 36,
      fontWeight: '800',
      color: theme.accentPrimary,
    },
    pointsBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.accentPrimary + '15',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
    },
    pointsText: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.accentPrimary,
    },
    progressBarBg: {
      height: 8,
      backgroundColor: theme.borderSoft,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.accentPrimary,
      borderRadius: 4,
    },
    progressLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#f59e0b15',
      padding: 12,
      borderRadius: 12,
    },
    streakText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    streakRecord: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card || theme.backgroundSecondary,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.card || theme.backgroundSecondary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      borderLeftWidth: 4,
      gap: 14,
      marginBottom: 10,
    },
    achievementCardLocked: {
      opacity: 0.55,
    },
    achievementIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    achievementEmoji: {
      fontSize: 28,
    },
    achievementInfo: {
      flex: 1,
      gap: 4,
    },
    achievementTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    textMuted: {
      color: theme.textSecondary,
    },
    rarityBadge: {
      fontSize: 11,
      fontWeight: '600',
    },
    achievementDescription: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    achievementProgressBg: {
      height: 4,
      backgroundColor: theme.borderSoft,
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 4,
    },
    achievementProgressFill: {
      height: '100%',
      borderRadius: 2,
    },
    unlockedDate: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
    },
    checkBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 16,
    },
  });
