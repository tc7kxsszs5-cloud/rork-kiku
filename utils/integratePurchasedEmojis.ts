/**
 * Утилита для интеграции купленных эмодзи в проект KIKU
 * 
 * Использование:
 * 1. Поместите купленные эмодзи в assets/images/emojis/custom/
 * 2. Импортируйте и вызовите integratePurchasedEmojis()
 */

import { addCustomEmoji, CustomEmojiData } from './customEmojis';
import { Image } from 'react-native';

/**
 * Интеграция купленных эмодзи из локальных файлов
 */
export async function integratePurchasedEmojis() {
  const purchasedEmojis: CustomEmojiData[] = [
    // Пример 1: Эмодзи из локального файла
    // Раскомментируйте и добавьте путь к вашему файлу
    /*
    {
      id: 'kiku_shield',
      name: 'KIKU Shield',
      type: 'image',
      source: Image.resolveAssetSource(require('@/assets/images/emojis/custom/kiku-shield.png')).uri,
      category: 'brand',
      tags: ['shield', 'protection', 'kiku', 'safety'],
    },
    {
      id: 'safety_star',
      name: 'Safety Star',
      type: 'image',
      source: Image.resolveAssetSource(require('@/assets/images/emojis/custom/safety-star.png')).uri,
      category: 'safety',
      tags: ['star', 'safety', 'good', 'achievement'],
    },
    */
    
    // Пример 2: Эмодзи из CDN/URL
    // Раскомментируйте и добавьте URL ваших эмодзи
    /*
    {
      id: 'premium_emoji_1',
      name: 'Premium Emoji 1',
      type: 'image',
      source: 'https://your-cdn.com/emojis/premium-emoji-1.png',
      category: 'premium',
      tags: ['premium', 'exclusive'],
    },
    */
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const emoji of purchasedEmojis) {
    try {
      await addCustomEmoji(emoji);
      successCount++;
      console.log(`✅ Добавлен эмодзи: ${emoji.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Ошибка добавления ${emoji.name}:`, error);
    }
  }

  console.log(`\n📊 Результат интеграции:`);
  console.log(`   ✅ Успешно: ${successCount}`);
  console.log(`   ❌ Ошибок: ${errorCount}`);
  console.log(`   📦 Всего: ${purchasedEmojis.length}`);

  return { successCount, errorCount, total: purchasedEmojis.length };
}

/**
 * Интеграция эмодзи из JSON конфигурации
 * 
 * Создайте файл emojis-config.json с массивом эмодзи:
 * [
 *   {
 *     "id": "emoji_1",
 *     "name": "Emoji Name",
 *     "type": "image",
 *     "source": "path/to/emoji.png",
 *     "category": "category",
 *     "tags": ["tag1", "tag2"]
 *   }
 * ]
 */
export async function integrateEmojisFromConfig(configPath: string) {
  try {
    // В React Native используйте require или fetch для загрузки конфига
    const config = require(configPath); // или await fetch(configPath).then(r => r.json())
    
    if (!Array.isArray(config)) {
      throw new Error('Конфигурация должна быть массивом эмодзи');
    }

    return await integratePurchasedEmojis();
  } catch (error) {
    console.error('[integrateEmojisFromConfig] Ошибка:', error);
    throw error;
  }
}

/**
 * Пример использования в компоненте или при инициализации приложения
 */
export async function initializePurchasedEmojis() {
  // Вызовите эту функцию при первом запуске приложения
  // Например, в app/_layout.tsx или в UserContext
  
  try {
    const result = await integratePurchasedEmojis();
    if (result.successCount > 0) {
      console.log('✅ Купленные эмодзи успешно интегрированы!');
    }
  } catch (error) {
    console.error('❌ Ошибка интеграции эмодзи:', error);
  }
}
