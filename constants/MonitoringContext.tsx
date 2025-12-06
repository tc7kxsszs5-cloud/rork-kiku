import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Chat, Message, Alert, RiskLevel, RiskAnalysis } from '@/constants/types';
import { MOCK_CHATS, INITIAL_MESSAGES } from '@/constants/mockData';
import { generateObject } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import { HapticFeedback } from '@/constants/haptics';

const RiskAnalysisSchema = z.object({
  riskLevel: z.enum(['safe', 'low', 'medium', 'high', 'critical']),
  reasons: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  categories: z.array(z.string()),
});

export const [MonitoringProvider, useMonitoring] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const analyzeMessage = useCallback(async (message: Message): Promise<RiskAnalysis> => {
    try {
      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: `Проанализируй сообщение на предмет потенциальной опасности, угроз, насилия, травли, мошенничества или тревожного контента.
            
Сообщение: "${message.text}"

Определи:
1. Уровень риска: safe (безопасно), low (низкий), medium (средний), high (высокий), critical (критический)
2. Причины (если есть риск)
3. Уверенность в оценке (0-1)
4. Категории риска (например: угрозы, насилие, травля, мошенничество, суицидальные мысли, экстремизм)`,
          },
        ],
        schema: RiskAnalysisSchema,
      });

      return result;
    } catch (error) {
      console.error('Error analyzing message:', error);
      return {
        riskLevel: 'safe',
        reasons: [],
        confidence: 0,
        categories: [],
      };
    }
  }, []);

  const analyzeImage = useCallback(async (imageUri: string): Promise<{ blocked: boolean; reasons: string[] }> => {
    try {
      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Проанализируй изображение на предмет опасного контента (насилие, нагота, экстремизм, ненависть, оружие, наркотики). Если безопасно - blocked=false и reasons=[]. Если опасно - blocked=true и reasons=[список причин на русском].',
              },
              {
                type: 'image',
                image: imageUri,
              },
            ],
          },
        ],
        schema: z.object({
          blocked: z.boolean().describe('Заблокировано ли изображение из-за опасного контента'),
          reasons: z.array(z.string()).describe('Причины блокировки, если есть'),
        }),
      });

      return { blocked: result.blocked || false, reasons: result.reasons || [] };
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
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        messages: INITIAL_MESSAGES[chat.id] || [],
      }))
    );
  }, []);

  useEffect(() => {
    initializeChatMessages();
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
    }),
    [chats, alerts, unresolvedAlerts, criticalAlerts, isAnalyzing, addMessage, initializeChatMessages, resolveAlert]
  );
});
