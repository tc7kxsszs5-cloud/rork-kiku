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
import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb, RefreshCcw, CheckCircle2, AlertCircle, ShieldAlert, ExternalLink } from 'lucide-react-native';
import { useMonitoring } from '@/constants/MonitoringContext';
import { HapticFeedback } from '@/constants/haptics';
import { useIsMounted } from '@/hooks/useIsMounted';
import { Chat, Alert as ChatAlert } from '@/constants/types';
import { useThemeMode, ThemePalette } from '@/constants/ThemeContext';

type RecommendationPriority = 'high' | 'medium' | 'low';

type ResourceLink = {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  url: string;
};

type GeneralRecommendation = {
  title: string;
  description: string;
  priority: RecommendationPriority;
};

type ChatRecommendation = {
  chatId: string;
  chatName: string;
  recommendations: string[];
};

type RecommendationsData = {
  general: GeneralRecommendation[];
  chatSpecific: ChatRecommendation[];
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

const RECOMMENDATION_DELAY_MS = 260;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const formatChatName = (chat: Chat) => {
  if (chat.isGroup && chat.groupName) {
    return chat.groupName;
  }
  if (chat.participantNames.length >= 2) {
    return chat.participantNames.slice(0, 2).join(' и ');
  }
  return chat.participantNames[0] ?? 'Чат без названия';
};

const buildChatRecommendations = (chat: Chat, unresolvedAlerts: ChatAlert[]): string[] => {
  const recs: string[] = [];
  const chatAlerts = unresolvedAlerts.filter((alert) => alert.chatId === chat.id);
  if (chatAlerts.length) {
    recs.push(`Разберите ${chatAlerts.length} тревог(и) и отметьте решение в приложении.`);
  }
  const riskyMessages = chat.messages.filter((message) => message.riskLevel && message.riskLevel !== 'safe');
  if (riskyMessages.length) {
    const latest = riskyMessages[riskyMessages.length - 1].text.trim();
    const snippet = latest.length > 80 ? `${latest.slice(0, 80)}…` : latest;
    recs.push(`Обсудите сообщение «${snippet}» и уточните, чувствует ли ребёнок давление.`);
  }
  if (chat.overallRisk === 'critical') {
    recs.push('Временно ограничьте чат и предупредите остальных опекунов до выяснения обстоятельств.');
  } else if (chat.overallRisk === 'high') {
    recs.push('Проверяйте чат каждые 2–3 часа и фиксируйте новые сигналы до стабилизации.');
  } else {
    recs.push('Напомните о правилах общения и поддержите ребёнка в доверительном диалоге.');
  }
  return Array.from(new Set(recs));
};

type GeneralInputs = {
  unresolvedAlerts: number;
  highRiskChats: number;
  mediumRiskChats: number;
  totalChats: number;
  riskyMessages: number;
};

const buildGeneralRecommendations = (input: GeneralInputs): GeneralRecommendation[] => {
  const items: GeneralRecommendation[] = [];
  const pushUnique = (item: GeneralRecommendation) => {
    if (!items.find((existing) => existing.title === item.title)) {
      items.push(item);
    }
  };

  if (input.unresolvedAlerts > 0) {
    pushUnique({
      title: `Разберите ${input.unresolvedAlerts} активных тревог`,
      description: 'Назначьте ответственных и завершите ручную проверку до конца дня, фиксируя результат в журнале безопасности.',
      priority: 'high',
    });
  }

  if (input.highRiskChats > 0) {
    pushUnique({
      title: 'Назначьте регламент для опасных чатов',
      description: `Выделите отдельное время мониторинга для ${input.highRiskChats} чатов с высоким риском и зафиксируйте порог эскалации.`,
      priority: 'high',
    });
  }

  if (input.riskyMessages > 5) {
    pushUnique({
      title: 'Проведите эмоциональный чек-ин с ребёнком',
      description: 'Обсудите, что его тревожит в переписках, и предложите сценарии выхода из сложных разговоров.',
      priority: 'medium',
    });
  }

  if (input.mediumRiskChats > 0) {
    pushUnique({
      title: 'Ежевечерний профилактический обзор',
      description: 'Объедините чаты со средним риском в чек-лист и просматривайте их вместе перед сном.',
      priority: 'medium',
    });
  }

  if (items.length === 0 || (!input.unresolvedAlerts && !input.highRiskChats)) {
    pushUnique({
      title: 'Обновите семейные правила безопасности',
      description: 'Повторите правила приватности, ограничьте доступ незнакомцев и закрепите доверительный канал связи.',
      priority: 'low',
    });
  }

  return items.slice(0, 5);
};

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

export default function AIRecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { chats, alerts } = useMonitoring();
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useIsMounted();

  const hasCriticalSignals = useMemo(
    () =>
      alerts.some((a) => !a.resolved) ||
      chats.some((chat) => chat.overallRisk === 'high' || chat.overallRisk === 'critical'),
    [alerts, chats],
  );

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
    if (!isMountedRef.current) {
      return;
    }

    HapticFeedback.medium();
    setIsLoading(true);
    setError(null);

    try {
      const unresolvedAlertsList = alerts.filter((alertItem) => !alertItem.resolved);
      const highRiskChats = chats.filter((chat) => chat.overallRisk === 'high' || chat.overallRisk === 'critical');
      const mediumRiskChats = chats.filter((chat) => chat.overallRisk === 'medium');
      const riskyMessagesCount = chats.reduce((sum, chat) => {
        return sum + chat.messages.filter((message) => message.riskLevel && message.riskLevel !== 'safe').length;
      }, 0);

      await delay(RECOMMENDATION_DELAY_MS);

      const general = buildGeneralRecommendations({
        unresolvedAlerts: unresolvedAlertsList.length,
        highRiskChats: highRiskChats.length,
        mediumRiskChats: mediumRiskChats.length,
        totalChats: chats.length,
        riskyMessages: riskyMessagesCount,
      });

      const focusChats = highRiskChats.length > 0 ? highRiskChats : mediumRiskChats.slice(0, 2);

      const chatSpecific = focusChats.map((chat) => ({
        chatId: chat.id,
        chatName: formatChatName(chat),
        recommendations: buildChatRecommendations(chat, unresolvedAlertsList),
      }));

      if (!isMountedRef.current) {
        return;
      }

      setRecommendations({ general, chatSpecific });
      HapticFeedback.success();
    } catch (err) {
      console.error('Error building recommendations:', err);
      if (isMountedRef.current) {
        setError('Не удалось собрать рекомендации. Попробуйте ещё раз');
      }
      HapticFeedback.error();
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}> 
          <Lightbulb size={32} color={theme.textPrimary} />
          <View>
            <Text style={styles.headerTitle}>AI рекомендации</Text>
            <Text style={styles.headerSubtitle}>Динамические советы для родителей</Text>
          </View>
        </View>

        <View style={styles.content}>
          <LinearGradient
            colors={theme.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.guidanceCard}
            testID="essential-guidance-card"
          >
            <View style={styles.guidanceHeader}>
              <ShieldAlert size={28} color={theme.isDark ? '#fef3c7' : '#7c2d12'} />
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
              <Lightbulb size={64} color={theme.accentPrimary} />
              <Text style={styles.emptyTitle}>Получите персональные рекомендации</Text>
              <Text style={styles.emptySubtitle}>
                AI проанализирует ваши данные и предоставит советы по безопасности
              </Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateRecommendations}
                testID="recommendations-generate-button"
              >
                <RefreshCcw size={20} color={theme.isDark ? '#0b1220' : '#fff'} />
                <Text style={styles.generateButtonText}>Сгенерировать рекомендации</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={theme.accentPrimary} />
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
                testID="recommendations-retry-button"
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
                  testID="recommendations-refresh-button"
                >
                  <RefreshCcw size={18} color={theme.accentPrimary} />
                  <Text style={styles.refreshButtonText}>Обновить</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Общие рекомендации</Text>
                {recommendations.general.map((rec, index) => (
                  <View
                    key={`${rec.title}-${index}`}
                    style={[styles.recommendationCard, { borderLeftColor: PRIORITY_COLORS[rec.priority] }]}
                  >
                    <View style={styles.recommendationHeader}>
                      <CheckCircle2 size={20} color={PRIORITY_COLORS[rec.priority]} />
                      <Text style={styles.recommendationTitle}>{rec.title}</Text>
                    </View>
                    <Text style={styles.recommendationDescription}>{rec.description}</Text>
                    <View
                      style={[styles.priorityBadge, { backgroundColor: `${PRIORITY_COLORS[rec.priority]}20` }]}
                    >
                      <Text style={[styles.priorityText, { color: PRIORITY_COLORS[rec.priority] }]}>
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
                      <View style={[styles.priorityBadge, { backgroundColor: `${PRIORITY_COLORS[resource.priority]}20` }]}
                      >
                        <Text style={[styles.priorityText, { color: PRIORITY_COLORS[resource.priority] }]}>
                          {PRIORITY_LABELS[resource.priority]}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.resourceButton}
                        onPress={() => openResource(resource.url)}
                        testID={`resource-link-${resource.id}`}
                      >
                        <ExternalLink size={16} color={theme.accentPrimary} />
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

const createStyles = (theme: ThemePalette) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: theme.backgroundSecondary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: theme.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textSecondary,
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  guidanceCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: theme.accentPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.isDark ? 0.45 : 0.2,
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
    color: theme.textPrimary,
  },
  guidancePriority: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.textSecondary,
    marginTop: 2,
  },
  guidanceDescription: {
    fontSize: 14,
    color: theme.textPrimary,
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
    backgroundColor: theme.textPrimary,
    marginTop: 6,
  },
  guidanceBulletText: {
    flex: 1,
    fontSize: 14,
    color: theme.textPrimary,
    lineHeight: 20,
  },
  guidanceFooter: {
    marginTop: 6,
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: theme.card,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.35 : 0.1,
    shadowRadius: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: theme.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.accentPrimary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 30,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.isDark ? '#0b1220' : '#fff',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: theme.card,
    borderRadius: 18,
  },
  loadingText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 20,
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: theme.card,
    borderRadius: 18,
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
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.accentPrimary,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.accentPrimary,
  },
  section: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: theme.isDark ? 0.35 : 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.textPrimary,
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderColor: theme.borderSoft,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.08,
    shadowRadius: 4,
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
    color: theme.textPrimary,
  },
  recommendationDescription: {
    fontSize: 14,
    color: theme.textSecondary,
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
  resourceCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
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
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  resourceButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.accentPrimary,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: theme.textPrimary,
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceUrl: {
    fontSize: 12,
    color: theme.textSecondary,
    textDecorationLine: 'underline',
  },
  chatRecommendationCard: {
    backgroundColor: theme.cardMuted,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.textPrimary,
    marginBottom: 12,
  },
  chatRecommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  chatRecommendationBullet: {
    fontSize: 18,
    color: theme.accentPrimary,
    marginRight: 8,
    fontWeight: '700' as const,
  },
  chatRecommendationText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
});
