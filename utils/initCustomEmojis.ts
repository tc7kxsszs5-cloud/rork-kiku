/**
 * Инициализация тестовых кастомных эмодзи
 * 
 * Этот файл создаёт примеры кастомных эмодзи для демонстрации функционала
 */

import { CustomEmojiData } from './customEmojis';
import { addCustomEmoji, loadCustomEmojis } from './customEmojis';

/**
 * Тестовые кастомные эмодзи для демонстрации
 */
export const TEST_CUSTOM_EMOJIS: CustomEmojiData[] = [
  {
    id: 'kiku_shield',
    name: 'KIKU Shield',
    type: 'svg',
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#C9A84C">
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 2.18l6 2.25v5.57c0 4.42-2.72 8.44-6 9.87-3.28-1.43-6-5.45-6-9.87V6.43l6-2.25z"/>
      <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4z" fill="#FF6B35"/>
    </svg>`,
    category: 'brand',
    tags: ['shield', 'kiku', 'protection', 'safety'],
  },
  {
    id: 'kiku_heart',
    name: 'KIKU Heart',
    type: 'unicode',
    source: '💛',
    category: 'hearts',
    tags: ['heart', 'kiku', 'love', 'care'],
  },
  {
    id: 'safety_star',
    name: 'Safety Star',
    type: 'svg',
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFB020">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>`,
    category: 'safety',
    tags: ['star', 'safety', 'protection'],
  },
  {
    id: 'happy_kid',
    name: 'Happy Kid',
    type: 'unicode',
    source: '😊',
    category: 'kids',
    tags: ['kid', 'happy', 'child', 'smile'],
  },
  {
    id: 'shield_check',
    name: 'Shield Check',
    type: 'svg',
    source: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#52C41A">
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm-1 13l-4-4 1.41-1.41L11 12.17l5.59-5.59L18 8l-7 7z"/>
    </svg>`,
    category: 'safety',
    tags: ['shield', 'check', 'verified', 'safe'],
  },
];

/**
 * Инициализировать тестовые кастомные эмодзи
 * Вызывается один раз при первом запуске
 */
export async function initializeTestCustomEmojis(): Promise<void> {
  try {
    const existing = await loadCustomEmojis();
    
    // Проверяем, есть ли уже тестовые эмодзи
    const hasTestEmojis = TEST_CUSTOM_EMOJIS.some(testEmoji =>
      existing.some(existingEmoji => existingEmoji.id === testEmoji.id)
    );

    if (!hasTestEmojis) {
      console.log('[initCustomEmojis] Initializing test custom emojis...');
      
      // Добавляем все тестовые эмодзи
      for (const emoji of TEST_CUSTOM_EMOJIS) {
        try {
          await addCustomEmoji(emoji);
          console.log(`[initCustomEmojis] Added test emoji: ${emoji.name}`);
        } catch (error) {
          console.error(`[initCustomEmojis] Failed to add ${emoji.name}:`, error);
        }
      }
      
      console.log('[initCustomEmojis] Test custom emojis initialized');
    } else {
      console.log('[initCustomEmojis] Test custom emojis already exist');
    }
  } catch (error) {
    console.error('[initCustomEmojis] Failed to initialize test emojis:', error);
  }
}
