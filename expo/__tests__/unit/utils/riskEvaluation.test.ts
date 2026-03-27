/**
 * Детерминированные модульные тесты для riskEvaluation.ts
 * 
 * Только чистые функции:
 * - Нет интеграций
 * - Нет асинхронных операций
 * - Нет сложных моков
 * - Одинаковый вход = одинаковый выход
 */

import { evaluateMessageRisk, evaluateImageRisk } from '@/utils/riskEvaluation';
import { Message, RiskLevel } from '@/constants/types';

describe('riskEvaluation - Детерминированные unit тесты', () => {
  const createTestMessage = (text: string): Message => ({
    id: 'test-msg-1',
    text,
    senderId: 'sender-1',
    senderName: 'Test User',
    timestamp: Date.now(),
    analyzed: false,
  });

  describe('evaluateMessageRisk', () => {
    describe('Безопасные сообщения (safe level)', () => {
      it('должен вернуть safe для обычного сообщения без ключевых слов', () => {
        const message = createTestMessage('Привет! Как дела?');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('safe');
        expect(result.reasons).toEqual([]);
        expect(result.categories).toEqual([]);
        expect(result.confidence).toBeGreaterThanOrEqual(0.2);
        expect(result.confidence).toBeLessThanOrEqual(0.6);
      });

      it('должен увеличить confidence при наличии восклицательных знаков', () => {
        const message1 = createTestMessage('Привет');
        const message2 = createTestMessage('Привет!!!');
        const message3 = createTestMessage('Привет!!!!!!!!!!');

        const result1 = evaluateMessageRisk(message1);
        const result2 = evaluateMessageRisk(message2);
        const result3 = evaluateMessageRisk(message3);

        expect(result1.confidence).toBeLessThan(result2.confidence);
        expect(result2.confidence).toBeLessThanOrEqual(result3.confidence);
        // Максимум 0.6 (0.2 + 0.4) - используем toBeCloseTo для чисел с плавающей точкой
        expect(result3.confidence).toBeLessThanOrEqual(0.6001);
      });

      it('должен быть детерминированным для одинаковых сообщений', () => {
        const message = createTestMessage('Обычное сообщение');
        const result1 = evaluateMessageRisk(message);
        const result2 = evaluateMessageRisk(message);

        expect(result1).toEqual(result2);
        expect(result1.riskLevel).toBe(result2.riskLevel);
        expect(result1.confidence).toBe(result2.confidence);
      });
    });

    describe('Критический уровень риска (critical)', () => {
      it('должен обнаружить суицидальные мотивы', () => {
        const message = createTestMessage('Я хочу покончить с собой');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('critical');
        expect(result.reasons).toContain('Угроза жизни или суицидальные мотивы');
        expect(result.categories).toContain('threats');
        expect(result.confidence).toBeGreaterThan(0.5);
      });

      it('должен обнаружить угрозы убийства', () => {
        const message = createTestMessage('Я убью тебя');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('critical');
        expect(result.reasons).toContain('Угроза жизни или суицидальные мотивы');
      });

      it('должен обнаружить упоминания бомб', () => {
        const message = createTestMessage('Взорвем школу');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('critical');
      });

      it('должен работать независимо от регистра', () => {
        const message1 = createTestMessage('Я убью тебя');
        const message2 = createTestMessage('Я УБЬЮ ТЕБЯ');
        const message3 = createTestMessage('я убью тебя');

        const result1 = evaluateMessageRisk(message1);
        const result2 = evaluateMessageRisk(message2);
        const result3 = evaluateMessageRisk(message3);

        expect(result1.riskLevel).toBe('critical');
        expect(result2.riskLevel).toBe('critical');
        expect(result3.riskLevel).toBe('critical');
      });
    });

    describe('Высокий уровень риска (high)', () => {
      it('должен обнаружить запрос личных данных', () => {
        const message = createTestMessage('Скажи свой домашний адрес');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('high');
        expect(result.reasons).toContain('Запрос личных данных');
        expect(result.categories).toContain('privacy');
      });

      it('должен обнаружить запрос пароля', () => {
        const message = createTestMessage('Какой у тебя пароль?');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('high');
        expect(result.reasons).toContain('Запрос личных данных');
      });

      it('должен обнаружить финансовое давление', () => {
        const message = createTestMessage('Переведи деньги срочно');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('high');
        expect(result.reasons).toContain('Финансовое давление');
        expect(result.categories).toContain('fraud');
      });

      it('должен обнаружить упоминание оружия', () => {
        const message = createTestMessage('У меня есть пистолет');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('high');
        expect(result.reasons).toContain('Упоминание оружия или запрещённых веществ');
        expect(result.categories).toContain('safety');
      });

      it('должен обнаружить наркотики', () => {
        const message = createTestMessage('Давай наркотики');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('high');
      });
    });

    describe('Средний уровень риска (medium)', () => {
      it('должен обнаружить секретные встречи', () => {
        const message = createTestMessage('Никому не говори, встретимся ночью');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('medium');
        expect(result.reasons).toContain('Секретные встречи без взрослых');
        expect(result.categories).toContain('grooming');
      });

      it('должен обнаружить травлю', () => {
        const message = createTestMessage('Ты дурак и тупой');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('medium');
        expect(result.reasons).toContain('Травля и унижения');
        expect(result.categories).toContain('bullying');
      });

      it('должен обнаружить признаки давления', () => {
        const message = createTestMessage('Мне страшно, меня преследуют');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('medium');
        expect(result.reasons).toContain('Запрос помощи или признаки давления');
        expect(result.categories).toContain('distress');
      });
    });

    describe('Низкий уровень риска (low)', () => {
      it('должен обнаружить подозрительные просьбы', () => {
        const message = createTestMessage('Спорим не расскажешь, скинь фотку');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('low');
        expect(result.reasons).toContain('Подозрительные просьбы');
        expect(result.categories).toContain('boundaries');
      });

      it('должен обнаружить просьбу отправить фото', () => {
        const message = createTestMessage('Отправь фото');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('low');
      });
    });

    describe('Множественные ключевые слова', () => {
      it('должен выбрать highest risk level при множественных совпадениях', () => {
        const message = createTestMessage('Убью тебя и заберу деньги');
        const result = evaluateMessageRisk(message);

        // Должен быть critical, так как это highest level
        expect(result.riskLevel).toBe('critical');
        expect(result.reasons.length).toBeGreaterThan(1);
      });

      it('должен объединить все причины', () => {
        const message = createTestMessage('Ты дурак, отправь фото и не рассказывай');
        const result = evaluateMessageRisk(message);

        expect(result.reasons.length).toBeGreaterThan(1);
        expect(result.categories.length).toBeGreaterThan(1);
      });

      it('должен увеличить confidence при множественных совпадениях', () => {
        const message1 = createTestMessage('Ты дурак');
        const message2 = createTestMessage('Ты дурак, отправь фото, не рассказывай');
        
        const result1 = evaluateMessageRisk(message1);
        const result2 = evaluateMessageRisk(message2);

        expect(result2.confidence).toBeGreaterThan(result1.confidence);
      });
    });

    describe('Confidence calculation', () => {
      it('должен увеличить confidence при CAPS тексте', () => {
        const message1 = createTestMessage('ты дурак');
        const message2 = createTestMessage('ТЫ ДУРАК');
        
        const result1 = evaluateMessageRisk(message1);
        const result2 = evaluateMessageRisk(message2);

        expect(result2.confidence).toBeGreaterThan(result1.confidence);
      });

      it('должен увеличить confidence при числовых паттернах', () => {
        const message1 = createTestMessage('Переведи деньги');
        const message2 = createTestMessage('Переведи 5000 рублей срочно');
        
        const result1 = evaluateMessageRisk(message1);
        const result2 = evaluateMessageRisk(message2);

        expect(result2.confidence).toBeGreaterThan(result1.confidence);
      });

      it('должен ограничить confidence максимумом 0.99', () => {
        const message = createTestMessage('УБЬЮ ТЕБЯ 1234 5678 9012 3456!!!');
        const result = evaluateMessageRisk(message);

        expect(result.confidence).toBeLessThanOrEqual(0.99);
      });

      it('должен иметь минимальный confidence 0.55 для рисковых сообщений', () => {
        const message = createTestMessage('Ты дурак');
        const result = evaluateMessageRisk(message);

        expect(result.confidence).toBeGreaterThanOrEqual(0.55);
      });
    });

    describe('Edge cases', () => {
      it('должен обработать пустое сообщение', () => {
        const message = createTestMessage('');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('safe');
        expect(result.reasons).toEqual([]);
      });

      it('должен обработать очень длинное сообщение', () => {
        const longText = 'Привет! '.repeat(1000);
        const message = createTestMessage(longText);
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('safe');
      });

      it('должен обработать сообщение только с цифрами', () => {
        const message = createTestMessage('1234567890');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('safe');
      });

      it('должен обработать сообщение только со знаками препинания', () => {
        const message = createTestMessage('!!!???...');
        const result = evaluateMessageRisk(message);

        expect(result.riskLevel).toBe('safe');
        expect(result.confidence).toBeGreaterThan(0.2);
      });
    });
  });

  describe('evaluateImageRisk', () => {
    describe('Безопасные изображения', () => {
      it('должен вернуть blocked: false для безопасного URI', () => {
        const result = evaluateImageRisk('https://example.com/image.jpg');

        expect(result.blocked).toBe(false);
        expect(result.reasons).toEqual([]);
      });

      it('должен вернуть blocked: false для обычного пути', () => {
        const result = evaluateImageRisk('/path/to/image.png');

        expect(result.blocked).toBe(false);
      });

      it('должен быть детерминированным для одинаковых URI', () => {
        const uri = 'https://example.com/safe.jpg';
        const result1 = evaluateImageRisk(uri);
        const result2 = evaluateImageRisk(uri);

        expect(result1).toEqual(result2);
        expect(result1.blocked).toBe(result2.blocked);
      });
    });

    describe('Рискованные изображения', () => {
      it('должен заблокировать изображение с ключевым словом "weapon"', () => {
        const result = evaluateImageRisk('https://example.com/weapon.jpg');

        expect(result.blocked).toBe(true);
        expect(result.reasons).toContain('Изображение отмечено как рискованное по ключевому слову "weapon"');
      });

      it('должен заблокировать изображение с ключевым словом "blood"', () => {
        const result = evaluateImageRisk('image-blood-123.png');

        expect(result.blocked).toBe(true);
        expect(result.reasons).toContain('Изображение отмечено как рискованное по ключевому слову "blood"');
      });

      it('должен заблокировать изображение с ключевым словом "nsfw"', () => {
        const result = evaluateImageRisk('nsfw-content.jpg');

        expect(result.blocked).toBe(true);
      });

      it('должен заблокировать изображение с ключевым словом "violence"', () => {
        const result = evaluateImageRisk('violence-scene.png');

        expect(result.blocked).toBe(true);
      });

      it('должен заблокировать изображение с ключевым словом "gun"', () => {
        const result = evaluateImageRisk('gun-image.jpg');

        expect(result.blocked).toBe(true);
      });

      it('должен заблокировать изображение с ключевым словом "knife"', () => {
        const result = evaluateImageRisk('knife-photo.png');

        expect(result.blocked).toBe(true);
      });
    });

    describe('Case insensitive', () => {
      it('должен работать независимо от регистра', () => {
        const result1 = evaluateImageRisk('WEAPON.jpg');
        const result2 = evaluateImageRisk('Weapon.jpg');
        const result3 = evaluateImageRisk('weapon.jpg');

        expect(result1.blocked).toBe(true);
        expect(result2.blocked).toBe(true);
        expect(result3.blocked).toBe(true);
      });
    });

    describe('Частичные совпадения', () => {
      it('должен обнаружить ключевое слово в середине пути', () => {
        const result = evaluateImageRisk('/path/to/weapon/image.jpg');

        expect(result.blocked).toBe(true);
      });

      it('должен обнаружить ключевое слово в начале', () => {
        const result = evaluateImageRisk('bloody-scene.png');

        expect(result.blocked).toBe(true);
      });

      it('должен обнаружить ключевое слово в конце', () => {
        const result = evaluateImageRisk('image-nsfw');

        expect(result.blocked).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('должен обработать пустой URI', () => {
        const result = evaluateImageRisk('');

        expect(result.blocked).toBe(false);
        expect(result.reasons).toEqual([]);
      });

      it('должен обработать очень длинный URI', () => {
        const longUri = 'https://example.com/' + 'a'.repeat(1000) + '.jpg';
        const result = evaluateImageRisk(longUri);

        expect(result.blocked).toBe(false);
      });

      it('должен обработать URI с множественными ключевыми словами', () => {
        // Должен вернуть первое найденное
        const result = evaluateImageRisk('weapon-blood-violence.jpg');

        expect(result.blocked).toBe(true);
        expect(result.reasons.length).toBe(1);
      });
    });
  });
});
