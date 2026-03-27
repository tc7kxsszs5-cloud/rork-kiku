/**
 * Chat Backgrounds Context
 * Manages chat background customization
 */

import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

export interface ChatBackground {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image' | 'solid';
  value?: string | string[];
  preview?: string;
  // Для совместимости с chat/[chatId].tsx
  color?: string;
  gradient?: string[];
  gradientDirection?: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

// Тип для использования в компонентах (расширенный)
export type ChatBackgroundExtended = ChatBackground;

const STORAGE_KEY = '@chat_backgrounds';
const DEFAULT_BACKGROUNDS: ChatBackground[] = [
  {
    id: 'default',
    name: 'По умолчанию',
    type: 'color',
    value: '#FFFFFF',
  },
  {
    id: 'gradient1',
    name: 'Градиент 1',
    type: 'gradient',
    value: ['#4A90E2', '#357ABD'],
  },
  {
    id: 'gradient2',
    name: 'Градиент 2',
    type: 'gradient',
    value: ['#FF6B35', '#E55A2B'],
  },
];

export const [ChatBackgroundsProvider, useChatBackgrounds] = createContextHook(() => {
  const [backgrounds, setBackgrounds] = useState<ChatBackground[]>(DEFAULT_BACKGROUNDS);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<Record<string, string>>({});

  const setChatBackground = useCallback(async (chatId: string, backgroundId: string) => {
    setSelectedBackgrounds((prev) => ({
      ...prev,
      [chatId]: backgroundId,
    }));
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...selectedBackgrounds,
        [chatId]: backgroundId,
      }));
    } catch (error) {
      logger.error('Failed to save background', error instanceof Error ? error : new Error(String(error)), { context: 'ChatBackgroundsContext', action: 'setChatBackground', chatId, backgroundId });
    }
  }, [selectedBackgrounds]);

  const getChatBackground = useCallback((chatId: string): ChatBackgroundExtended | null => {
    const backgroundId = selectedBackgrounds[chatId];
    if (!backgroundId) {
      const defaultBg = backgrounds[0];
      if (!defaultBg) return null;
      // Преобразуем в формат, ожидаемый chat/[chatId].tsx
      if (defaultBg.type === 'color') {
        return {
          ...defaultBg,
          type: 'solid' as const,
          color: defaultBg.value as string,
        };
      }
      if (defaultBg.type === 'gradient') {
        return {
          ...defaultBg,
          gradient: defaultBg.value as string[],
          gradientDirection: {
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
          },
        };
      }
      return defaultBg;
    }
    const bg = backgrounds.find((b) => b.id === backgroundId) || backgrounds[0];
    if (!bg) return null;
    // Преобразуем в формат, ожидаемый chat/[chatId].tsx
    if (bg.type === 'color') {
      return {
        ...bg,
        type: 'solid' as const,
        color: bg.value as string,
      };
    }
    if (bg.type === 'gradient') {
      return {
        ...bg,
        gradient: bg.value as string[],
        gradientDirection: {
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
      };
    }
    return bg;
  }, [selectedBackgrounds, backgrounds]);

  return {
    backgrounds,
    selectedBackgrounds,
    setChatBackground,
    getChatBackground,
  };
});
