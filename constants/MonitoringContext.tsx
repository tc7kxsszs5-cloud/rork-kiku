import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chat, Message, Alert, RiskLevel, RiskAnalysis, AISensitivity, ContentCategory } from '@/constants/types';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/constants/mockData';
import { HapticFeedback } from '@/constants/haptics';
import { AgeGroup } from './UserContext';

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

type KeywordRule = {
  level: RiskLevel;
  pattern: RegExp;
  reason: string;
  category: ContentCategory;
  minAgeGroup?: AgeGroup; // Rule only applies to this age group and younger
  sensitivity?: AISensitivity; // Rule only applies at this sensitivity or higher
};

// Age-appropriate keyword rules - more strict for younger children
const KEYWORD_RULES: KeywordRule[] = [
  // Critical threats - all ages, all sensitivities
  {
    level: 'critical',
    pattern: /(убью|убей|поконч|самоуб|умереть|взорв|бомб|kill|suicide|bomb)/i,
    reason: 'Угроза жизни или суицидальные мотивы',
    category: 'threats',
  },
  
  // High risk - privacy and safety
  {
    level: 'high',
    pattern: /(адрес|домашн|парол|паспорт|номер карты|cvv|секретный код|password|address|ssn)/i,
    reason: 'Запрос личных данных',
    category: 'privacy',
  },
  {
    level: 'high',
    pattern: /(перевед[ие]|деньг|карта|плати|5000|срочно оплат|money|payment|cash)/i,
    reason: 'Финансовое давление',
    category: 'threats',
  },
  {
    level: 'high',
    pattern: /(оруж|пистолет|нож|наркот|взрывчат|weapon|gun|drug|cocaine)/i,
    reason: 'Упоминание оружия или запрещённых веществ',
    category: 'drugs',
  },
  
  // Grooming and inappropriate meetings
  {
    level: 'high',
    pattern: /(никому не говори|встреча без взрослых|секретная встреча|ночью|приди один|secret meeting|don't tell)/i,
    reason: 'Секретные встречи без взрослых',
    category: 'threats',
    minAgeGroup: 'pre-teen', // More important for younger children
  },
  
  // Bullying - severity varies by age
  {
    level: 'high',
    pattern: /(дурак|тупой|ненавижу тебя|жирный|урод|никчем|stupid|hate you|loser|ugly)/i,
    reason: 'Травля и унижения',
    category: 'bullying',
    minAgeGroup: 'middle-childhood', // Stricter for younger
  },
  {
    level: 'medium',
    pattern: /(дурак|тупой|ненавижу тебя|жирный|урод|никчем|stupid|hate you|loser|ugly)/i,
    reason: 'Травля и унижения',
    category: 'bullying',
    minAgeGroup: 'teen', // Less strict for older teens
    sensitivity: 'low',
  },
  
  // Distress signals
  {
    level: 'medium',
    pattern: /(страшно|мне плохо|я боюсь|меня преследуют|издеваются|scared|hurt|help me)/i,
    reason: 'Запрос помощи или признаки давления',
    category: 'threats',
  },
  
  // Suspicious requests - age dependent
  {
    level: 'medium',
    pattern: /(ночью играть|спорим не расскажешь|скинь фотку|отправь фото|send pic|send photo)/i,
    reason: 'Подозрительные просьбы',
    category: 'sexual',
    minAgeGroup: 'pre-teen',
  },
  {
    level: 'low',
    pattern: /(ночью играть|спорим не расскажешь|скинь фотку|отправь фото|send pic|send photo)/i,
    reason: 'Подозрительные просьбы',
    category: 'sexual',
    minAgeGroup: 'teen',
  },
  
  // Profanity - stricter for younger children
  {
    level: 'medium',
    pattern: /(черт|блин|дьявол|damn|hell|crap)/i,
    reason: 'Ненормативная лексика',
    category: 'profanity',
    minAgeGroup: 'early-childhood',
    sensitivity: 'high',
  },
  {
    level: 'low',
    pattern: /(черт|блин|дьявол|damn|hell|crap)/i,
    reason: 'Ненормативная лексика',
    category: 'profanity',
    minAgeGroup: 'middle-childhood',
    sensitivity: 'medium',
  },
];

const IMAGE_RISK_KEYWORDS = ['weapon', 'blood', 'nsfw', 'violence', 'gun', 'knife', 'nude', 'drug'];

const SIMULATED_DELAY_MS = 120;

const simulateLatency = () => new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

// Age group ordering for comparison (earlier = younger)
const AGE_GROUP_ORDER: AgeGroup[] = ['early-childhood', 'middle-childhood', 'pre-teen', 'teen'];

// Sensitivity ordering for comparison
const SENSITIVITY_ORDER: AISensitivity[] = ['low', 'medium', 'high', 'strict'];

// Helper to check if rule applies based on age group
const ruleAppliesForAge = (rule: KeywordRule, userAgeGroup?: AgeGroup): boolean => {
  if (!rule.minAgeGroup || !userAgeGroup) return true;
  
  const ruleAgeIndex = AGE_GROUP_ORDER.indexOf(rule.minAgeGroup);
  const userAgeIndex = AGE_GROUP_ORDER.indexOf(userAgeGroup);
  
  // Rule applies if user is at or below the min age group
  return userAgeIndex <= ruleAgeIndex;
};

// Helper to check if rule applies based on sensitivity
const ruleAppliesForSensitivity = (rule: KeywordRule, sensitivity: AISensitivity): boolean => {
  if (!rule.sensitivity) return true;
  
  const ruleSensIndex = SENSITIVITY_ORDER.indexOf(rule.sensitivity);
  const userSensIndex = SENSITIVITY_ORDER.indexOf(sensitivity);
  
  // Rule applies if user sensitivity is at or above rule sensitivity
  return userSensIndex >= ruleSensIndex;
};

// Helper to check if category should be monitored
const isCategoryMonitored = (category: ContentCategory, monitoredCategories?: ContentCategory[]): boolean => {
  if (!monitoredCategories || monitoredCategories.length === 0) return false;
  return monitoredCategories.includes(category);
};

const evaluateMessageRisk = (
  message: Message, 
  options?: {
    ageGroup?: AgeGroup;
    sensitivity?: AISensitivity;
    monitoredCategories?: ContentCategory[];
  }
): RiskAnalysis => {
  const { ageGroup, sensitivity = 'medium', monitoredCategories } = options || {};
  const normalized = message.text.toLowerCase();
  
  // Filter rules based on age and sensitivity
  // Then further filter to only include rules for monitored categories (if specified)
  const applicableRules = KEYWORD_RULES.filter((rule) => {
    // Check age and sensitivity
    const ageMatch = ruleAppliesForAge(rule, ageGroup);
    const sensitivityMatch = ruleAppliesForSensitivity(rule, sensitivity);
    
    // If no monitored categories specified, apply all rules
    if (!monitoredCategories || monitoredCategories.length === 0) {
      return ageMatch && sensitivityMatch;
    }
    
    // If monitored categories specified, only apply rules for those categories
    const categoryMatch = isCategoryMonitored(rule.category, monitoredCategories);
    return ageMatch && sensitivityMatch && categoryMatch;
  });
  
  const matches = applicableRules.filter((rule) => rule.pattern.test(normalized));

  if (!matches.length) {
    const emphasisScore = Math.min(0.4, (message.text.match(/!/g)?.length ?? 0) * 0.05);
    return {
      riskLevel: 'safe',
      reasons: [],
      confidence: 0.2 + emphasisScore,
      categories: [],
    };
  }

  const highest = matches.reduce<RiskLevel>((current, rule) => {
    return LEVEL_ORDER.indexOf(rule.level) > LEVEL_ORDER.indexOf(current) ? rule.level : current;
  }, 'safe');

  const reasons = Array.from(new Set(matches.map((match) => match.reason)));
  const categories = Array.from(new Set(matches.map((match) => match.category)));
  const numericPatterns = normalized.match(/\d{4,}/g)?.length ?? 0;
  
  // Adjust confidence based on sensitivity level
  const sensitivityBoost = sensitivity === 'strict' ? 0.1 : sensitivity === 'high' ? 0.05 : 0;
  const confidenceBoost = matches.length * 0.1 + (/[A-ZА-Я]{4,}/.test(message.text) ? 0.05 : 0) + numericPatterns * 0.04 + sensitivityBoost;

  return {
    riskLevel: highest,
    reasons,
    confidence: Math.min(0.99, 0.55 + confidenceBoost),
    categories,
  };
};

const evaluateImageRisk = (imageUri: string): { blocked: boolean; reasons: string[] } => {
  const normalized = imageUri.toLowerCase();
  const hit = IMAGE_RISK_KEYWORDS.find((keyword) => normalized.includes(keyword));
  if (!hit) {
    return { blocked: false, reasons: [] };
  }

  return {
    blocked: true,
    reasons: [`Изображение отмечено как рискованное по ключевому слову "${hit}"`],
  };
};

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMountedRef = useRef(true);
  
  // Store analysis options for age-based filtering
  const [analysisOptions, setAnalysisOptions] = useState<{
    ageGroup?: AgeGroup;
    sensitivity?: AISensitivity;
    monitoredCategories?: ContentCategory[];
  }>({
    sensitivity: 'medium',
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Update analysis options (called by parent controls)
  const updateAnalysisOptions = useCallback((options: {
    ageGroup?: AgeGroup;
    sensitivity?: AISensitivity;
    monitoredCategories?: ContentCategory[];
  }) => {
    setAnalysisOptions((prev) => ({ ...prev, ...options }));
    console.log('Analysis options updated:', options);
  }, []);

  const analyzeMessage = useCallback(async (message: Message): Promise<RiskAnalysis> => {
    try {
      await simulateLatency();
      return evaluateMessageRisk(message, analysisOptions);
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        riskLevel: 'safe',
        reasons: [],
        confidence: 0.2,
        categories: [],
      };
    }
  }, [analysisOptions]);

  const analyzeImage = useCallback(async (imageUri: string): Promise<{ blocked: boolean; reasons: string[] }> => {
    try {
      await simulateLatency();
      return evaluateImageRisk(imageUri);
    } catch (error) {
      console.error('Error analyzing image:', error);
      return { blocked: false, reasons: [] };
    }
  }, []);

  const addMessage = useCallback(async (chatId: string, text: string, senderId: string, senderName: string, imageUri?: string) => {
    if (!isMountedRef.current) {
      return;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      text,
      senderId,
      senderName,
      timestamp: Date.now(),
      analyzed: false,
      imageUri,
      imageAnalyzed: false,
      imageBlocked: false,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastActivity: Date.now(),
          };
        }
        return chat;
      })
    );

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeMessage(newMessage);

      if (!isMountedRef.current) {
        return;
      }

      let imageAnalysis = { blocked: false, reasons: [] as string[] };
      if (imageUri) {
        imageAnalysis = await analyzeImage(imageUri);
        if (!isMountedRef.current) {
          return;
        }
      }

      if (!isMountedRef.current) {
        return;
      }

      if (analysis.riskLevel === 'critical') {
        HapticFeedback.error();
      } else if (analysis.riskLevel === 'high' || analysis.riskLevel === 'medium') {
        HapticFeedback.warning();
      } else if (analysis.riskLevel === 'safe') {
        HapticFeedback.success();
      }

      if (!isMountedRef.current) {
        return;
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            const updatedMessages = chat.messages.map((msg) =>
              msg.id === newMessage.id
                ? {
                    ...msg,
                    riskLevel: analysis.riskLevel,
                    riskReasons: analysis.reasons,
                    analyzed: true,
                    imageAnalyzed: true,
                    imageBlocked: imageAnalysis.blocked,
                    imageRiskReasons: imageAnalysis.reasons,
                  }
                : msg
            );

            const levels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
            const highestRisk = updatedMessages.reduce((max, msg) => {
              const msgLevel = msg.riskLevel || 'safe';
              return levels.indexOf(msgLevel) > levels.indexOf(max) ? msgLevel : max;
            }, 'safe' as RiskLevel);

            const shouldAlert = analysis.riskLevel !== 'safe' && analysis.riskLevel !== 'low';
            const imageRisk = imageAnalysis.blocked;

            if ((shouldAlert || imageRisk) && isMountedRef.current) {
              const newAlert: Alert = {
                id: `alert_${Date.now()}`,
                chatId,
                messageId: newMessage.id,
                riskLevel: analysis.riskLevel,
                timestamp: Date.now(),
                reasons: analysis.reasons,
                resolved: false,
              };
              setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
            }

            return {
              ...chat,
              messages: updatedMessages,
              overallRisk: highestRisk,
            };
          }
          return chat;
        })
      );
    } finally {
      if (isMountedRef.current) {
        setIsAnalyzing(false);
      }
    }
  }, [analyzeMessage, analyzeImage]);

  const initializeChatMessages = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: INITIAL_MESSAGES[chat.id] || [],
      }))
    );
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      initializeChatMessages();
    }
  }, [initializeChatMessages]);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  }, []);

  const unresolvedAlerts = useMemo(
    () => alerts.filter((alert) => !alert.resolved),
    [alerts]
  );

  const criticalAlerts = useMemo(
    () => unresolvedAlerts.filter((alert) => alert.riskLevel === 'critical'),
    [unresolvedAlerts]
  );

  return useMemo(
    () => ({
      chats,
      alerts,
      unresolvedAlerts,
      criticalAlerts,
      isAnalyzing,
      addMessage,
      initializeChatMessages,
      resolveAlert,
      updateAnalysisOptions,
      analysisOptions,
    }),
    [chats, alerts, unresolvedAlerts, criticalAlerts, isAnalyzing, addMessage, initializeChatMessages, resolveAlert, updateAnalysisOptions, analysisOptions]
  );
});
