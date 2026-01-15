/**
 * Утилиты для работы с кастомными эмодзи
 * 
 * Функции:
 * - Загрузка кастомных эмодзи
 * - Сохранение кастомных эмодзи
 * - Поиск кастомных эмодзи
 * - Управление категориями
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Экспортируем тип для использования в других модулях
export interface CustomEmojiData {
  id: string;
  name: string;
  type: 'image' | 'svg' | 'unicode';
  source: string; // URI для изображения, XML для SVG, или Unicode символ
  category?: string;
  tags?: string[]; // Для поиска
}

const CUSTOM_EMOJIS_STORAGE_KEY = '@kiku_custom_emojis';

/**
 * Загрузить все кастомные эмодзи
 */
export async function loadCustomEmojis(): Promise<CustomEmojiData[]> {
  try {
    const stored = await AsyncStorage.getItem(CUSTOM_EMOJIS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('[customEmojis] Failed to load custom emojis:', error);
    return [];
  }
}

/**
 * Сохранить кастомные эмодзи
 */
export async function saveCustomEmojis(emojis: CustomEmojiData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CUSTOM_EMOJIS_STORAGE_KEY, JSON.stringify(emojis));
  } catch (error) {
    console.error('[customEmojis] Failed to save custom emojis:', error);
    throw error;
  }
}

/**
 * Добавить новый кастомный эмодзи
 */
export async function addCustomEmoji(emoji: CustomEmojiData): Promise<void> {
  const existing = await loadCustomEmojis();
  const updated = [...existing, emoji];
  await saveCustomEmojis(updated);
}

/**
 * Удалить кастомный эмодзи
 */
export async function removeCustomEmoji(emojiId: string): Promise<void> {
  const existing = await loadCustomEmojis();
  const updated = existing.filter(e => e.id !== emojiId);
  await saveCustomEmojis(updated);
}

/**
 * Найти кастомные эмодзи по поисковому запросу
 */
export async function searchCustomEmojis(query: string): Promise<CustomEmojiData[]> {
  const emojis = await loadCustomEmojis();
  const lowerQuery = query.toLowerCase();
  
  return emojis.filter(emoji => {
    // Поиск по имени
    if (emoji.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Поиск по тегам
    if (emoji.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }
    
    // Поиск по категории
    if (emoji.category?.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Получить кастомные эмодзи по категории
 */
export async function getCustomEmojisByCategory(category: string): Promise<CustomEmojiData[]> {
  const emojis = await loadCustomEmojis();
  return emojis.filter(e => e.category === category);
}

/**
 * Получить все категории кастомных эмодзи
 */
export async function getCustomEmojiCategories(): Promise<string[]> {
  const emojis = await loadCustomEmojis();
  const categories = new Set<string>();
  
  emojis.forEach(emoji => {
    if (emoji.category) {
      categories.add(emoji.category);
    }
  });
  
  return Array.from(categories);
}

/**
 * Примеры кастомных эмодзи (для демонстрации)
 */
export const EXAMPLE_CUSTOM_EMOJIS: CustomEmojiData[] = [
  {
    id: 'custom_1',
    name: 'KIKU Logo',
    type: 'image',
    source: 'https://example.com/kiku-logo.png', // Замените на реальный URL
    category: 'brand',
    tags: ['logo', 'kiku', 'brand'],
  },
  {
    id: 'custom_2',
    name: 'Shield Emoji',
    type: 'svg',
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700">
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"/>
    </svg>`,
    category: 'safety',
    tags: ['shield', 'protection', 'safety'],
  },
  {
    id: 'custom_3',
    name: 'Custom Heart',
    type: 'unicode',
    source: '💛', // Кастомный Unicode символ
    category: 'hearts',
    tags: ['heart', 'love'],
  },
];
