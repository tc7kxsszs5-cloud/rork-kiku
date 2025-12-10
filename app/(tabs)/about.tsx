import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image as RNImage, Pressable, Linking } from 'react-native';
import { AlertOctagon, Image as ImageIcon, Clock, Users, Lock, FileText, Eye, Wifi } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import appIcon from '@/assets/images/icon.png';

const PROJECT_URL = 'https://rork.app/p/d8v7u672uumlfpscvnbps';
const START_COMMAND = 'CI=false bunx rork start -p d8v7u672uumlfpscvnbps --tunnel';

type CopyState = 'idle' | 'copied' | 'error';

export default function AboutScreen() {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const handleOpenProjectUrl = () => {
    Linking.openURL(PROJECT_URL).catch((error) => {
      console.log('Failed to open project URL', error);
    });
  };

  const handleCopyStartCommand = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(START_COMMAND);
      setCopyState('copied');
      console.log('[AboutScreen] Copied start command');
    } catch (error) {
      console.error('[AboutScreen] Failed to copy start command', error);
      setCopyState('error');
    }
  }, []);

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }
    const timeout = setTimeout(() => {
      setCopyState('idle');
    }, 2200);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copyHint = copyState === 'copied' ? 'Команда скопирована' : copyState === 'error' ? 'Не удалось скопировать' : 'Нажмите, чтобы скопировать';

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
        <Text style={styles.sectionTitle}>Стабильный запуск</Text>
        <View style={styles.commandCard}>
          <View style={styles.commandHeader}>
            <View style={styles.commandIconWrap}>
              <Wifi size={22} color="#0d1b2a" />
            </View>
            <View style={styles.commandTitleWrap}>
              <Text style={styles.commandTitle}>Запустите dev-сервер с туннелем</Text>
              <Text style={styles.commandSubtitle}>Используйте, если устройство не видит Metro</Text>
            </View>
          </View>
          <View style={styles.commandCodeBlock}>
            <Text style={styles.commandCode} testID="about-start-command">
              {START_COMMAND}
            </Text>
          </View>
          <Pressable
            onPress={handleCopyStartCommand}
            style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
            testID="about-copy-command"
          >
            <Text style={styles.copyButtonText}>{copyHint}</Text>
          </Pressable>
        </View>
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
  commandCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commandIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffe7a3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commandTitleWrap: {
    flex: 1,
  },
  commandTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  commandSubtitle: {
    fontSize: 13,
    color: '#5c5c5c',
    marginTop: 4,
  },
  commandCodeBlock: {
    backgroundColor: '#0d1b2a',
    borderRadius: 12,
    padding: 16,
  },
  commandCode: {
    fontFamily: 'Courier',
    color: '#fef3c7',
    fontSize: 14,
  },
  copyButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#0d1b2a',
    paddingVertical: 14,
    alignItems: 'center',
  },
  copyButtonPressed: {
    opacity: 0.85,
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#ffe7a3',
  },
});
