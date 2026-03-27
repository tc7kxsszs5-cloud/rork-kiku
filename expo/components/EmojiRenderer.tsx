/**
 * Компонент для отображения эмодзи в тексте сообщений
 * 
 * Поддерживает:
 * - Стандартные Unicode эмодзи
 * - Кастомные эмодзи (изображения, SVG)
 * - Специальный формат [custom:id] для кастомных эмодзи
 */

import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { CustomEmoji } from './CustomEmoji';
import { loadCustomEmojis, CustomEmojiData } from '@/utils/customEmojis';

interface EmojiRendererProps {
  text: string;
  emojiSize?: number;
  style?: any;
}

export function EmojiRenderer({ text, emojiSize = 20, style }: EmojiRendererProps) {
  const [customEmojis, setCustomEmojis] = React.useState<CustomEmojiData[]>([]);

  React.useEffect(() => {
    loadCustomEmojis().then(setCustomEmojis);
  }, []);

  // Парсинг текста с поддержкой кастомных эмодзи
  const parsedContent = useMemo(() => {
    type ParsedPart = 
      | { type: 'text'; content: string }
      | { type: 'custom'; content: string; emoji: CustomEmojiData };
    
    const parts: ParsedPart[] = [];
    const customEmojiMap = new Map(customEmojis.map(e => [e.id, e]));
    
    // Регулярное выражение для поиска кастомных эмодзи [custom:id]
    const customEmojiRegex = /\[custom:([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = customEmojiRegex.exec(text)) !== null) {
      // Добавляем текст до кастомного эмодзи
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }

      // Добавляем кастомный эмодзи
      const emojiId = match[1];
      const emoji = customEmojiMap.get(emojiId);
      
      if (emoji) {
        parts.push({
          type: 'custom',
          content: match[0],
          emoji,
        });
      } else {
        // Если эмодзи не найден, оставляем как текст
        parts.push({
          type: 'text',
          content: match[0],
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  }, [text, customEmojis]);

  return (
    <Text style={style}>
      {parsedContent.map((part, index) => {
        if (part.type === 'custom' && 'emoji' in part) {
          return (
            <CustomEmoji
              key={index}
              emoji={part.emoji}
              size={emojiSize}
            />
          );
        }
        return <Text key={index}>{part.content}</Text>;
      })}
    </Text>
  );
}
