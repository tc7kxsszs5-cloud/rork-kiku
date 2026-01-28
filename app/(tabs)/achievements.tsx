import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Trophy, Star, Award, Medal } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';

export default function AchievementsScreen() {
  const { theme } = useThemeMode();
  const styles = createStyles(theme);

  // Демо-данные достижений
  const achievements = [
    {
      id: '1',
      title: 'Первое сообщение',
      description: 'Отправили первое сообщение',
      icon: Star,
      unlocked: true,
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Неделя активности',
      description: 'Активны 7 дней подряд',
      icon: Trophy,
      unlocked: true,
      date: '2024-01-20',
    },
    {
      id: '3',
      title: 'Безопасный чат',
      description: 'Все сообщения безопасны',
      icon: Award,
      unlocked: false,
    },
    {
      id: '4',
      title: 'Мастер общения',
      description: 'Отправили 100 сообщений',
      icon: Medal,
      unlocked: false,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Trophy size={32} color={theme.accentPrimary} />
        <Text style={styles.headerTitle}>Достижения</Text>
        <Text style={styles.headerSubtitle}>
          Ваши успехи и награды
        </Text>
      </View>

      <View style={styles.achievementsList}>
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementCardLocked,
              ]}
            >
              <View style={styles.achievementIcon}>
                <Icon
                  size={32}
                  color={
                    achievement.unlocked
                      ? theme.accentPrimary
                      : theme.textSecondary
                  }
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && achievement.date && (
                  <Text style={styles.achievementDate}>
                    Получено: {achievement.date}
                  </Text>
                )}
              </View>
              {achievement.unlocked && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundPrimary,
    },
    content: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
      gap: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.textPrimary,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    achievementsList: {
      gap: 16,
    },
    achievementCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 16,
    },
    achievementCardLocked: {
      opacity: 0.6,
    },
    achievementIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.accentPrimary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    achievementInfo: {
      flex: 1,
      gap: 4,
    },
    achievementTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    achievementTitleLocked: {
      color: theme.textSecondary,
    },
    achievementDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    achievementDate: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
    },
    badge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.accentPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '700',
    },
  });
