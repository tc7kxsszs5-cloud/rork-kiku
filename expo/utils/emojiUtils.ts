/**
 * Утилиты для работы с эмодзи
 * 
 * Функции:
 * - Парсинг эмодзи из текста
 * - Валидация эмодзи
 * - Подсчёт эмодзи в тексте
 * - Замена текстовых смайликов на эмодзи
 * - Обработка кастомных эмодзи
 */

import { loadCustomEmojis, CustomEmojiData } from './customEmojis';

/**
 * Проверить является ли символ эмодзи
 */
export function isEmoji(char: string): boolean {
  // Unicode диапазоны для эмодзи
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]|[\u{FE0F}]/u;
  return emojiRegex.test(char);
}

/**
 * Найти все эмодзи в тексте
 */
export function extractEmojis(text: string): string[] {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu;
  return text.match(emojiRegex) || [];
}

/**
 * Подсчитать количество эмодзи в тексте
 */
export function countEmojis(text: string): number {
  return extractEmojis(text).length;
}

/**
 * Заменить текстовые смайлики на эмодзи
 */
const TEXT_TO_EMOJI_MAP: Record<string, string> = {
  ':)': '😊',
  ':-)': '😊',
  ':(': '😢',
  ':-(': '😢',
  ':D': '😃',
  ':-D': '😃',
  ':P': '😛',
  ':-P': '😛',
  ';)': '😉',
  ';-)': '😉',
  ':O': '😮',
  ':-O': '😮',
  ':*': '😘',
  ':-*': '😘',
  '<3': '❤️',
  '</3': '💔',
  ':3': '😊',
  '>:(': '😠',
  '>:)': '😈',
  ':|': '😐',
  ':-|': '😐',
  ':/': '😕',
  ':-/': '😕',
  ':S': '😕',
  ':-S': '😕',
  ':$': '😳',
  ':-$': '😳',
  ':@': '😠',
  ':-@': '😠',
  '8)': '😎',
  '8-)': '😎',
  'B)': '😎',
  'B-)': '😎',
  'xD': '😆',
  'XD': '😆',
  'x)': '😆',
  'X)': '😆',
  'o.O': '😕',
  'O.o': '😕',
  'o_o': '😐',
  'O_O': '😐',
  '^_^': '😊',
  'T_T': '😭',
  '>_<': '😣',
  '>.<': '😣',
  '-_-': '😑',
  'u_u': '😑',
  'U_U': '😑',
};

export function replaceTextSmileys(text: string): string {
  let result = text;
  
  // Сортируем по длине (от длинных к коротким), чтобы избежать конфликтов
  const sortedEntries = Object.entries(TEXT_TO_EMOJI_MAP).sort((a, b) => b[0].length - a[0].length);
  
  sortedEntries.forEach(([textSmiley, emoji]) => {
    // Используем глобальный поиск для замены всех вхождений
    const regex = new RegExp(textSmiley.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, emoji);
  });
  
  return result;
}

/**
 * Проверить содержит ли текст эмодзи
 */
export function hasEmojis(text: string): boolean {
  return countEmojis(text) > 0;
}

/**
 * Получить первый эмодзи из текста
 */
export function getFirstEmoji(text: string): string | null {
  const emojis = extractEmojis(text);
  return emojis.length > 0 ? emojis[0] : null;
}

/**
 * Удалить все эмодзи из текста
 */
export function removeEmojis(text: string): string {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu;
  return text.replace(emojiRegex, '').trim();
}

/**
 * Получить статистику эмодзи в тексте
 */
export function getEmojiStats(text: string): {
  total: number;
  unique: number;
  emojis: string[];
  mostUsed: { emoji: string; count: number }[];
} {
  const emojis = extractEmojis(text);
  const uniqueEmojis = Array.from(new Set(emojis));
  
  // Подсчёт частоты использования
  const emojiCounts: Record<string, number> = {};
  emojis.forEach(emoji => {
    emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
  });
  
  const mostUsed = Object.entries(emojiCounts)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    total: emojis.length,
    unique: uniqueEmojis.length,
    emojis: uniqueEmojis,
    mostUsed,
  };
}
