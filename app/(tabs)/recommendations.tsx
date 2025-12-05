import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lightbulb, RefreshCcw, CheckCircle2, AlertCircle, ShieldAlert, ExternalLink } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import { HapticFeedback } from '@/constants/haptics';
import { LinearGradient } from 'expo-linear-gradient';

const RecommendationsSchema = z.object({
  general: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
    })
  ),
  chatSpecific: z.array(
    z.object({
      chatId: z.string(),
      chatName: z.string(),
      recommendations: z.array(z.string()),
    })
  ),
});

type ResourceLink = {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  url: string;
};

const RESOURCE_LINKS: ResourceLink[] = [
  {
    id: 'unicef-safety',
    title: 'UNICEF: Онлайн-безопасность детей',
    description:
      'Подробное руководство, как разговаривать с детьми об интернете, распознавать угрозы и поддерживать доверие.',
    priority: 'high',
    url: 'https://www.unicef.org/parenting/child-safety/teaching-your-child-about-online-safety',
  },
  {
    id: 'google-family-link',
    title: 'Google Family Link и контроль чатов',
    description:
      'Официальная инструкция по настройке ограничений, приватности и правил общения в Google-сервисах.',
    priority: 'medium',
    url: 'https://support.google.com/families/answer/6209641?hl=ru',
  },
  {
    id: 'kaspersky-guide',
    title: 'Kaspersky: Цифровая гигиена семьи',
    description:
      'Практические советы по правилам общения, настройке приватности и реагированию на подозрительные контакты.',
    priority: 'medium',
    url: 'https://www.kaspersky.ru/resource-center/threats/child-online-safety',
  },
];

type Recommendations = z.infer<typeof RecommendationsSchema>;

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6',
} as const;

const PRIORITY_LABELS = {
  high: 'Высокий приоритет',
  medium: 'Средний приоритет',
  low: 'Низкий приоритет',
} as const;

const ESSENTIAL_GUIDANCE = {
  title: 'Базовые меры безопасности',
  description:
    'Даже при отсутствии тревог держите под контролем приватность аккаунтов и укрепляйте семейные правила общения в сети.',
  bullets: [
    'Просматривайте чаты хотя бы раз в день, чтобы замечать ранние сигналы давления или мошенничества',
    'Регулярно напоминайте детям не передавать личные данные и не кликать на незнакомые ссылки',
    'Проверьте настройки конфиденциальности аккаунтов детей в мессенджерах и ограничьте доступ к профилю для незнакомцев',
    'Установите чёткие семейные правила: с кем можно общаться, какие темы запрещены и что делать при нарушении',
    'Обсуждайте сценарии реагирования: к кому обращаться и как блокировать подозрительные контакты',
  ],
};

export default function RecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const { chats, alerts } = useMonitoring();
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCriticalSignals = useMemo(() => alerts.some((a) => !a.resolved), [alerts]);

  const openResource = async (url: string) => {
    try {
      HapticFeedback.light();
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Не удалось открыть ссылку', `Скопируйте адрес вручную: ${url}`);
      }
    } catch (err) {
      console.error('Error opening resource link:', err);
      Alert.alert('Ошибка', 'Не удалось открыть ссылку. Попробуйте позже');
    }
  };

  const generateRecommendations = async () => {
    HapticFeedback.medium();
    setIsLoading(true);
    setError(null);

    try {
      const unresolvedAlerts = alerts.filter((a) => !a.resolved);
      const highRiskChats = chats.filter((c) => c.overallRisk === 'high' || c.overallRisk === 'critical');

      const chatsInfo = chats.map((chat) => ({
        id: chat.id,
        name: chat.participantNames.join(' и '),
        risk: chat.overallRisk,
        messageCount: chat.messages.length,
        riskMessages: chat.messages.filter((m) => m.riskLevel && m.riskLevel !== 'safe').length,
      }));

      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: `Ты эксперт по цифровой безопасности и защите детей в интернете. 
            
Проанализируй данные о мониторинге чатов и предоставь рекомендации по безопасности:

Статистика:
- Всего чатов: ${chats.length}
- Чатов с высоким риском: ${highRiskChats.length}
- Нерешенных тревог: ${unresolvedAlerts.length}

Чаты:
${chatsInfo.map((c) => `- ${c.name}: риск ${c.risk}, ${c.riskMessages} опасных сообщений из ${c.messageCount}`).join('\n')}

Предоставь:
1. Общие рекомендации (3-5 советов) с приоритетами (high/medium/low)
2. Специфичные рекомендации для чатов с высоким риском

Рекомендации должны быть практичными и конкретными.`,
          },
        ],
        schema: RecommendationsSchema,
      });

      setRecommendations(result);
      HapticFeedback.success();
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Не удалось сгенерировать рекомендации');
      HapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Lightbulb size={32} color="#1a1a1a" />
        <Text style={styles.headerTitle}>Рекомендации AI</Text>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={['#fff4c7', '#ffe0c7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.guidanceCard}
          testID="essential-guidance-card"
        >
          <View style={styles.guidanceHeader}>
            <ShieldAlert size={28} color="#b45309" />
            <View style={styles.guidanceTitleBlock}>
              <Text style={styles.guidanceTitle}>{ESSENTIAL_GUIDANCE.title}</Text>
              <Text style={styles.guidancePriority}>Высокий приоритет</Text>
            </View>
          </View>
          <Text style={styles.guidanceDescription}>{ESSENTIAL_GUIDANCE.description}</Text>
          {ESSENTIAL_GUIDANCE.bullets.map((bullet) => (
            <View key={bullet} style={styles.guidanceBulletRow}>
              <View style={styles.guidanceBulletDot} />
              <Text style={styles.guidanceBulletText}>{bullet}</Text>
            </View>
          ))}
          {!hasCriticalSignals && (
            <Text style={styles.guidanceFooter}>
              Даже при отсутствии тревог держите эти практики в ежедневной рутине — это снизит вероятность появления угроз.
            </Text>
          )}
        </LinearGradient>

        {!recommendations && !isLoading && (
          <View style={styles.emptyState}>
            <Lightbulb size={64} color="#FFD700" />
            <Text style={styles.emptyTitle}>Получите персональные рекомендации</Text>
            <Text style={styles.emptySubtitle}>
              AI проанализирует ваши данные и предоставит советы по безопасности
            </Text>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={generateRecommendations}
            >
              <RefreshCcw size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Сгенерировать рекомендации</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>AI анализирует ваши данные...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorState}>
            <AlertCircle size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={generateRecommendations}
            >
              <Text style={styles.retryButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        )}

        {recommendations && !isLoading && (
          <>
            <View style={styles.refreshButtonContainer}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={generateRecommendations}
              >
                <RefreshCcw size={18} color="#FFD700" />
                <Text style={styles.refreshButtonText}>Обновить</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Общие рекомендации</Text>
              {recommendations.general.map((rec, index) => (
                <View
                  key={`${rec.title}-${index}`}
                  style={[
                    styles.recommendationCard,
                    { borderLeftColor: PRIORITY_COLORS[rec.priority] },
                  ]}
                >
                  <View style={styles.recommendationHeader}>
                    <CheckCircle2 size={20} color={PRIORITY_COLORS[rec.priority]} />
                    <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  </View>
                  <Text style={styles.recommendationDescription}>{rec.description}</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: PRIORITY_COLORS[rec.priority] + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: PRIORITY_COLORS[rec.priority] },
                      ]}
                    >
                      {PRIORITY_LABELS[rec.priority]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Полезные материалы</Text>
              {RESOURCE_LINKS.map((resource) => (
                <View key={resource.id} style={styles.resourceCard} testID={`resource-card-${resource.id}`}>
                  <View style={styles.resourceHeader}>
                    <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[resource.priority] + '20' }]}>
                      <Text style={[styles.priorityText, { color: PRIORITY_COLORS[resource.priority] }]}>
                        {PRIORITY_LABELS[resource.priority]}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.resourceButton}
                      onPress={() => openResource(resource.url)}
                      testID={`resource-link-${resource.id}`}
                    >
                      <ExternalLink size={16} color="#FFD700" />
                      <Text style={styles.resourceButtonText}>Открыть</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                  <Text style={styles.resourceUrl}>{resource.url}</Text>
                </View>
              ))}
            </View>

            {recommendations.chatSpecific.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Рекомендации по чатам</Text>
                {recommendations.chatSpecific.map((chatRec, index) => (
                  <View
                    key={`${chatRec.chatId}-${index}`}
                    style={styles.chatRecommendationCard}
                    testID={`chat-recommendation-${chatRec.chatId}`}
                  >
                    <Text style={styles.chatName}>{chatRec.chatName}</Text>
                    {chatRec.recommendations.map((rec, recIndex) => (
                      <View key={`${chatRec.chatId}-${recIndex}`} style={styles.chatRecommendationItem}>
                        <Text style={styles.chatRecommendationBullet}>•</Text>
                        <Text style={styles.chatRecommendationText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFD700',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFD700',
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  guidanceCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  guidanceTitleBlock: {
    flex: 1,
  },
  guidanceTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#5c2c05',
  },
  guidancePriority: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#a64700',
    marginTop: 2,
  },
  guidanceDescription: {
    fontSize: 14,
    color: '#6b3a0c',
    lineHeight: 20,
    marginBottom: 16,
  },
  guidanceBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  guidanceBulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#b45309',
    marginTop: 6,
  },
  guidanceBulletText: {
    flex: 1,
    fontSize: 14,
    color: '#5c2c05',
    lineHeight: 20,
  },
  guidanceFooter: {
    marginTop: 6,
    fontSize: 13,
    color: '#7c4312',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
  },
  refreshButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFD700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  recommendationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  chatRecommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  chatRecommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  chatRecommendationBullet: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: 8,
    fontWeight: '700' as const,
  },
  chatRecommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f4e5b5',
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1a1a1a',
  },
  resourceButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFD700',
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#4b4b4b',
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceUrl: {
    fontSize: 12,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
});
