import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image as RNImage, Pressable, Linking } from 'react-native';
import { AlertOctagon, Image as ImageIcon, Clock, Users, Lock, FileText, Eye } from 'lucide-react-native';
import appIcon from '@/assets/images/icon.png';

const PROJECT_URL = 'https://rork.app/p/d8v7u672uumlfpscvnbps';

type StageHighlight = {
  title: string;
  value: string;
  description: string;
  accent: string;
};

const stageHighlights: StageHighlight[] = [
  {
    title: 'Стадия',
    value: 'Late MVP / Pre-Production',
    description: 'UI/UX и функциональность основных экранов готовы, идет финализация стабильности',
    accent: '#2ecc71',
  },
  {
    title: 'AI & Контент',
    value: 'Готово',
    description: 'Модерация чатов, визуализация рисков, аналитика и рекомендации реализованы',
    accent: '#00c2ff',
  },
  {
    title: 'Оставшиеся шаги',
    value: 'Интеграция backend + push',
    description: 'Нужно подключить серверную синхронизацию, push-уведомления и аналитику',
    accent: '#ff9f0a',
  },
];

export default function AboutScreen() {
  const handleOpenProjectUrl = () => {
    Linking.openURL(PROJECT_URL).catch((error) => {
      console.log('Failed to open project URL', error);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <RNImage
            source={appIcon}
            style={styles.appIcon}
            resizeMode="contain"
            testID="about-app-icon"
          />
          <Text style={styles.iconLabel} testID="about-app-icon-label">
            KIDS
          </Text>
        </View>
        <Text style={styles.title}>KIDS</Text>
        <Text style={styles.subtitle}>Защита переписок с AI</Text>
        <Text style={styles.version}>Версия 1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Текущий статус</Text>
        <Text style={styles.description}>
          Проект находится на стадии позднего MVP: весь пользовательский функционал и дизайн готовы,
          проводим стабилизацию и готовим интеграцию с backend и пуш-уведомлениями.
        </Text>
        <View style={styles.stageGrid}>
          {stageHighlights.map((item, index) => (
            <View key={item.title} style={styles.stageCard} testID={`about-stage-card-${index}`}>
              <View style={[styles.stagePill, { backgroundColor: item.accent }]}
                testID={`about-stage-pill-${index}`}
              >
                <Text style={styles.stagePillText}>{item.title}</Text>
              </View>
              <Text style={styles.stageValue}>{item.value}</Text>
              <Text style={styles.stageDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
        <View style={styles.progressBlock} testID="about-stage-progress">
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Готовность релиза</Text>
            <Text style={styles.progressValue}>80%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressHint}>
            Осталось: подключить push-уведомления, серверную синхронизацию и провести тесты на устройствах.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <Text style={styles.description}>
          KIDS - это инновационное приложение для мониторинга и защиты безопасности детских чатов с использованием искусственного интеллекта. 
          Мы помогаем родителям защитить своих детей от онлайн-угроз, сохраняя при этом приватность и доверие.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>URL для публикации</Text>
        <Text style={styles.description}>
          Используйте ссылку ниже при заполнении форм App Store или TestFlight — это стабильный веб-превью проекта в Expo.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.urlCard, pressed && styles.urlCardPressed]}
          onPress={handleOpenProjectUrl}
          testID="about-project-url"
        >
          <Text style={styles.urlLabel}>Проект</Text>
          <Text numberOfLines={1} style={styles.urlValue}>
            {PROJECT_URL}
          </Text>
          <Text style={styles.urlHint}>Нажмите, чтобы открыть</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Лицензия</Text>
        <View style={styles.licenseCard} testID="about-license-card">
          <Text style={styles.licenseStatus}>Файл LICENSE не найден</Text>
          <Text style={styles.licenseHint}>
            Добавьте LICENSE в корень проекта и заполните поле «license» в package.json, чтобы зафиксировать выбранную лицензию.
          </Text>
          <Text style={styles.licenseHint}>
            Проверяйте наличие файла LICENSE и значения «license» в package.json — это основной способ понять, оформлена ли лицензия.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Основные функции</Text>
        
        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Eye size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Мониторинг сообщений</Text>
            <Text style={styles.featureDescription}>
              Автоматический анализ текстовых сообщений на предмет угроз, травли, насилия и опасного контента с использованием продвинутых AI моделей
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <ImageIcon size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Фильтрация изображений</Text>
            <Text style={styles.featureDescription}>
              AI-анализ изображений для обнаружения неприемлемого контента: насилие, нагота, экстремизм, оружие и наркотики
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <AlertOctagon size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>SOS кнопка</Text>
            <Text style={styles.featureDescription}>
              Экстренная помощь одним нажатием - мгновенное уведомление родителей с геолокацией при опасности
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Clock size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Временные ограничения</Text>
            <Text style={styles.featureDescription}>
              Настраиваемые ограничения по времени использования и расписанию для здорового цифрового баланса
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Users size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Белый список контактов</Text>
            <Text style={styles.featureDescription}>
              Управление разрешенными контактами с возможностью блокировки неизвестных собеседников
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Lock size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Шифрование данных</Text>
            <Text style={styles.featureDescription}>
              Все данные хранятся локально на устройстве с шифрованием для максимальной приватности
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <FileText size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>COPPA/GDPR-K соответствие</Text>
            <Text style={styles.featureDescription}>
              Полное соответствие международным стандартам защиты данных детей с подробным логированием согласий
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Технологии</Text>
        <View style={styles.techList}>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>AI модели для анализа текста и изображений</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>End-to-end шифрование сообщений</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>Локальное хранение данных с AsyncStorage</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>Геолокация для экстренных случаев</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>Голосовые сообщения с транскрипцией</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText}>Реал-тайм мониторинг с уведомлениями</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Безопасность и приватность</Text>
        <Text style={styles.description}>
          Мы серьезно относимся к безопасности и приватности. Все данные хранятся локально на вашем устройстве. 
          Мы не собираем личную информацию без согласия родителей. AI анализ работает с шифрованными данными, 
          а метаданные о безопасности хранятся отдельно от содержимого сообщений.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Поддержка</Text>
        <Text style={styles.description}>
          Если у вас есть вопросы или предложения, свяжитесь с нами:
        </Text>
        <Text style={styles.contactText}>Email: support@kids-app.com</Text>
        <Text style={styles.contactText}>Сайт: www.kids-app.com</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 KIDS. Все права защищены.</Text>
        <Text style={styles.footerSubtext}>
          Сделано с заботой о безопасности детей
        </Text>
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
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFD700',
  },
  iconWrapper: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: '#0d1b2a',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  appIcon: {
    width: 128,
    height: 128,
    borderRadius: 32,
  },
  iconLabel: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginTop: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4a4a4a',
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  stageGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: 16,
  },
  stageCard: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  stagePill: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  stagePillText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#0d1b2a',
    letterSpacing: 0.5,
  },
  stageValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0d1b2a',
    marginBottom: 6,
  },
  stageDescription: {
    fontSize: 13,
    color: '#4a4a4a',
    lineHeight: 18,
  },
  progressBlock: {
    marginTop: 24,
    backgroundColor: '#0d1b2a',
    borderRadius: 18,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#2ecc71',
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#19273b',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '80%',
    backgroundColor: '#2ecc71',
    borderRadius: 8,
  },
  progressHint: {
    marginTop: 12,
    fontSize: 13,
    color: '#d5e2ff',
    lineHeight: 18,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techList: {
    marginTop: 8,
  },
  techItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  techBullet: {
    fontSize: 20,
    color: '#FFD700',
    marginRight: 12,
    fontWeight: '700' as const,
  },
  techText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  contactText: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 8,
  },
  urlCard: {
    marginTop: 16,
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    padding: 20,
  },
  urlCardPressed: {
    opacity: 0.8,
  },
  urlLabel: {
    fontSize: 14,
    color: '#9ab6d8',
    marginBottom: 4,
    fontWeight: '600' as const,
  },
  urlValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700' as const,
  },
  urlHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#9ab6d8',
  },
  licenseCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  licenseStatus: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  licenseHint: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});
