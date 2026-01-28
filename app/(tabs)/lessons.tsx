import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BookOpen, CheckCircle, Lock, Play } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';

export default function LessonsScreen() {
  const { theme } = useThemeMode();
  const styles = createStyles(theme);

  // Демо-данные уроков
  const lessons = [
    {
      id: '1',
      title: 'Безопасность в интернете',
      description: 'Узнайте, как защитить себя в интернете',
      duration: '15 мин',
      completed: true,
      progress: 100,
    },
    {
      id: '2',
      title: 'Общение с незнакомцами',
      description: 'Правила безопасного общения',
      duration: '20 мин',
      completed: false,
      progress: 0,
    },
    {
      id: '3',
      title: 'Защита личных данных',
      description: 'Как защитить свою информацию',
      duration: '25 мин',
      completed: false,
      progress: 0,
    },
    {
      id: '4',
      title: 'Кибербуллинг',
      description: 'Что делать, если вас обижают в интернете',
      duration: '30 мин',
      completed: false,
      progress: 0,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <BookOpen size={32} color={theme.accentPrimary} />
        <Text style={styles.headerTitle}>Уроки безопасности</Text>
        <Text style={styles.headerSubtitle}>
          Изучайте правила безопасного использования интернета
        </Text>
      </View>

      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.lessonCard,
              lesson.completed && styles.lessonCardCompleted,
            ]}
          >
            <View style={styles.lessonIcon}>
              {lesson.completed ? (
                <CheckCircle size={32} color={theme.accentPrimary} />
              ) : (
                <Play size={32} color={theme.textSecondary} />
              )}
            </View>
            <View style={styles.lessonInfo}>
              <View style={styles.lessonHeader}>
                <Text
                  style={[
                    styles.lessonTitle,
                    lesson.completed && styles.lessonTitleCompleted,
                  ]}
                >
                  {lesson.title}
                </Text>
                {lesson.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>Завершено</Text>
                  </View>
                )}
              </View>
              <Text style={styles.lessonDescription}>
                {lesson.description}
              </Text>
              <View style={styles.lessonMeta}>
                <Text style={styles.lessonDuration}>⏱ {lesson.duration}</Text>
                {lesson.progress > 0 && !lesson.completed && (
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${lesson.progress}%` },
                      ]}
                    />
                  </View>
                )}
              </View>
            </View>
            {!lesson.completed && (
              <View style={styles.lockIcon}>
                <Lock size={20} color={theme.textSecondary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    lessonsList: {
      gap: 16,
    },
    lessonCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 16,
    },
    lessonCardCompleted: {
      borderColor: theme.accentPrimary,
      backgroundColor: theme.accentPrimary + '10',
    },
    lessonIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.accentPrimary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    lessonInfo: {
      flex: 1,
      gap: 8,
    },
    lessonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    lessonTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.textPrimary,
      flex: 1,
    },
    lessonTitleCompleted: {
      color: theme.accentPrimary,
    },
    completedBadge: {
      backgroundColor: theme.accentPrimary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    completedBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    lessonDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    lessonMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    lessonDuration: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: theme.borderSoft,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.accentPrimary,
    },
    lockIcon: {
      padding: 8,
    },
  });
