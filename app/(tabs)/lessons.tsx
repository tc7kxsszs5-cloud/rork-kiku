import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BookOpen, CheckCircle, Play, Clock, Star, Shield, Lock } from 'lucide-react-native';
import { useThemeMode } from '@/constants/ThemeContext';
import { useGamification } from '@/constants/GamificationContext';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  points: number;
  category: 'safety' | 'privacy' | 'bullying' | 'digital';
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const LESSONS: Lesson[] = [
  {
    id: 'lesson_1',
    title: 'Безопасность в интернете',
    description: 'Основные правила защиты в сети — пароли, незнакомцы, ссылки',
    duration: '15 мин',
    points: 50,
    category: 'safety',
    emoji: '🛡️',
    difficulty: 'easy',
  },
  {
    id: 'lesson_2',
    title: 'Общение с незнакомцами',
    description: 'Как безопасно общаться и когда стоит насторожиться',
    duration: '20 мин',
    points: 75,
    category: 'safety',
    emoji: '🤝',
    difficulty: 'easy',
  },
  {
    id: 'lesson_3',
    title: 'Защита личных данных',
    description: 'Что нельзя публиковать в сети и почему это важно',
    duration: '25 мин',
    points: 100,
    category: 'privacy',
    emoji: '🔐',
    difficulty: 'medium',
  },
  {
    id: 'lesson_4',
    title: 'Кибербуллинг',
    description: 'Что делать, если вас обижают в интернете',
    duration: '30 мин',
    points: 100,
    category: 'bullying',
    emoji: '🤗',
    difficulty: 'medium',
  },
  {
    id: 'lesson_5',
    title: 'Фишинг и мошенничество',
    description: 'Как распознать мошенников и не попасться на их уловки',
    duration: '20 мин',
    points: 125,
    category: 'digital',
    emoji: '🎣',
    difficulty: 'medium',
  },
  {
    id: 'lesson_6',
    title: 'Цифровой след',
    description: 'Что остаётся в интернете навсегда и как это влияет на вас',
    duration: '25 мин',
    points: 150,
    category: 'privacy',
    emoji: '👣',
    difficulty: 'hard',
  },
  {
    id: 'lesson_7',
    title: 'Безопасные пароли',
    description: 'Создание надёжных паролей и двухфакторная аутентификация',
    duration: '15 мин',
    points: 75,
    category: 'safety',
    emoji: '🔑',
    difficulty: 'easy',
  },
  {
    id: 'lesson_8',
    title: 'Манипуляции онлайн',
    description: 'Как распознать психологические манипуляции в сети',
    duration: '35 мин',
    points: 200,
    category: 'bullying',
    emoji: '🧠',
    difficulty: 'hard',
  },
];

const DIFFICULTY_COLORS = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

const DIFFICULTY_LABELS = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const CATEGORY_LABELS: Record<string, string> = {
  safety: 'Безопасность',
  privacy: 'Приватность',
  bullying: 'Буллинг',
  digital: 'Цифровая грамотность',
};

export default function LessonsScreen() {
  const { theme } = useThemeMode();
  const { data, completeLesson, addPoints } = useGamification();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const styles = createStyles(theme);

  const completedIds = new Set(
    (data?.stats.lessonsCompleted ?? 0) > 0
      ? LESSONS.slice(0, data?.stats.lessonsCompleted ?? 0).map((l) => l.id)
      : []
  );

  const completedLessons = data?.stats.lessonsCompleted ?? 0;

  const categories = ['all', ...Array.from(new Set(LESSONS.map((l) => l.category)))];

  const filtered = activeCategory === 'all'
    ? LESSONS
    : LESSONS.filter((l) => l.category === activeCategory);

  const handleStartLesson = (lesson: Lesson) => {
    const isCompleted = completedLessons >= LESSONS.findIndex((l) => l.id === lesson.id) + 1;
    if (isCompleted) {
      Alert.alert('Урок пройден', 'Вы уже прошли этот урок!');
      return;
    }

    Alert.alert(
      lesson.title,
      `${lesson.description}\n\nПродолжительность: ${lesson.duration}\nНаграда: +${lesson.points} очков`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Начать',
          onPress: () => {
            completeLesson(lesson.id);
            addPoints(lesson.points, `Урок: ${lesson.title}`);
            Alert.alert('🎉 Урок завершён!', `+${lesson.points} очков начислено`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.header}>
        <BookOpen size={36} color={theme.accentPrimary} />
        <Text style={styles.headerTitle}>Уроки безопасности</Text>
        <Text style={styles.headerSubtitle}>
          Пройдено: {completedLessons} из {LESSONS.length}
        </Text>
      </View>

      {/* Прогресс */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Shield size={18} color={theme.accentPrimary} />
          <Text style={styles.progressTitle}>Ваш прогресс</Text>
          <Text style={styles.progressPercent}>
            {Math.round((completedLessons / LESSONS.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(completedLessons / LESSONS.length) * 100}%` as any },
            ]}
          />
        </View>
        <Text style={styles.progressSub}>
          Осталось {LESSONS.length - completedLessons} уроков
        </Text>
      </View>

      {/* Фильтр категорий */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categories}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              activeCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === cat && styles.categoryChipTextActive,
              ]}
            >
              {cat === 'all' ? 'Все' : CATEGORY_LABELS[cat] || cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Список уроков */}
      <View style={styles.lessonsList}>
        {filtered.map((lesson, index) => {
          const globalIndex = LESSONS.findIndex((l) => l.id === lesson.id);
          const isCompleted = completedLessons > globalIndex;
          const isLocked = globalIndex > completedLessons;

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard,
                isCompleted && styles.lessonCardCompleted,
                isLocked && styles.lessonCardLocked,
              ]}
              onPress={() => !isLocked && handleStartLesson(lesson)}
              activeOpacity={isLocked ? 1 : 0.7}
            >
              <View style={[
                styles.lessonEmoji,
                isCompleted && { backgroundColor: theme.accentPrimary + '20' },
                isLocked && { backgroundColor: theme.borderSoft },
              ]}>
                {isLocked ? (
                  <Lock size={24} color={theme.textSecondary} />
                ) : (
                  <Text style={styles.emojiText}>{lesson.emoji}</Text>
                )}
              </View>

              <View style={styles.lessonInfo}>
                <View style={styles.lessonTitleRow}>
                  <Text style={[
                    styles.lessonTitle,
                    isCompleted && { color: theme.accentPrimary },
                    isLocked && { color: theme.textSecondary },
                  ]}>
                    {lesson.title}
                  </Text>
                  {isCompleted && <CheckCircle size={18} color={theme.accentPrimary} />}
                </View>

                <Text style={styles.lessonDescription}>{lesson.description}</Text>

                <View style={styles.lessonMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color={theme.textSecondary} />
                    <Text style={styles.metaText}>{lesson.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Star size={12} color="#f59e0b" />
                    <Text style={styles.metaText}>+{lesson.points} очков</Text>
                  </View>
                  <Text style={[
                    styles.difficultyBadge,
                    { color: DIFFICULTY_COLORS[lesson.difficulty] },
                  ]}>
                    {DIFFICULTY_LABELS[lesson.difficulty]}
                  </Text>
                </View>
              </View>

              {!isLocked && !isCompleted && (
                <View style={styles.playButton}>
                  <Play size={18} color="#fff" />
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
      marginBottom: 20,
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
    progressCard: {
      backgroundColor: theme.card || theme.backgroundSecondary,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 10,
    },
    progressHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
      flex: 1,
    },
    progressPercent: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.accentPrimary,
    },
    progressBarBg: {
      height: 10,
      backgroundColor: theme.borderSoft,
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.accentPrimary,
      borderRadius: 5,
    },
    progressSub: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    categoriesScroll: {
      marginBottom: 20,
    },
    categories: {
      gap: 10,
      paddingRight: 10,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    categoryChipActive: {
      backgroundColor: theme.accentPrimary,
      borderColor: theme.accentPrimary,
    },
    categoryChipText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    categoryChipTextActive: {
      color: '#fff',
    },
    lessonsList: {
      gap: 14,
    },
    lessonCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.card || theme.backgroundSecondary,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      gap: 14,
    },
    lessonCardCompleted: {
      borderColor: theme.accentPrimary,
    },
    lessonCardLocked: {
      opacity: 0.5,
    },
    lessonEmoji: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.accentPrimary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    emojiText: {
      fontSize: 26,
    },
    lessonInfo: {
      flex: 1,
      gap: 6,
    },
    lessonTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    lessonTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
      flex: 1,
    },
    lessonDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    lessonMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    difficultyBadge: {
      fontSize: 12,
      fontWeight: '600',
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accentPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
