/**
 * Unit тесты для алгоритмов оценки рисков
 * Тестируем детерминированную логику оценки сообщений и изображений
 */

import { describe, it, expect } from 'bun:test';

type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  analyzed: boolean;
}

interface RiskAnalysis {
  riskLevel: RiskLevel;
  reasons: string[];
  confidence: number;
  categories: string[];
}

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

type KeywordRule = {
  level: RiskLevel;
  pattern: RegExp;
  reason: string;
  category: string;
};

// Копия KEYWORD_RULES из MonitoringContext для тестирования
const KEYWORD_RULES: KeywordRule[] = [
  {
    level: 'critical',
    pattern: /(убью|убей|поконч|самоуб|умереть|взорв|бомб)/i,
    reason: 'Угроза жизни или суицидальные мотивы',
    category: 'threats',
  },
  {
    level: 'high',
    pattern: /(адрес|домашн|парол|паспорт|номер карты|cvv|секретный код)/i,
    reason: 'Запрос личных данных',
    category: 'privacy',
  },
  {
    level: 'high',
    pattern: /(перевед[ие]|деньг|карта|плати|5000|срочно оплат)/i,
    reason: 'Финансовое давление',
    category: 'fraud',
  },
  {
    level: 'medium',
    pattern: /(никому не говори|встреча без взрослых|секретная встреча|ночью|приди один)/i,
    reason: 'Секретные встречи без взрослых',
    category: 'grooming',
  },
];

const IMAGE_RISK_KEYWORDS = ['weapon', 'blood', 'nsfw', 'violence', 'gun', 'knife'];

const evaluateMessageRisk = (message: Message): RiskAnalysis => {
  const normalized = message.text.toLowerCase();
  const matches = KEYWORD_RULES.filter((rule) => rule.pattern.test(normalized));

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
  const confidenceBoost = matches.length * 0.1 + (/[A-ZА-Я]{4,}/.test(message.text) ? 0.05 : 0) + numericPatterns * 0.04;

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

describe('evaluateMessageRisk', () => {
  it('должен возвращать safe для безопасных сообщений', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Привет, как дела?',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('safe');
    expect(result.reasons).toEqual([]);
    expect(result.confidence).toBeGreaterThanOrEqual(0.2);
    expect(result.confidence).toBeLessThanOrEqual(0.6);
  });

  it('должен обнаруживать критические угрозы', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Я убью тебя',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('critical');
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons[0]).toContain('Угроза жизни');
    expect(result.categories).toContain('threats');
  });

  it('должен обнаруживать запросы личных данных', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Скажи свой адрес и пароль',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('high');
    expect(result.reasons.some((r) => r.includes('личных данных'))).toBe(true);
    expect(result.categories).toContain('privacy');
  });

  it('должен обнаруживать финансовое давление', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Срочно переведи 5000 на карту',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('high');
    expect(result.reasons.some((r) => r.includes('Финансовое'))).toBe(true);
    expect(result.categories).toContain('fraud');
  });

  it('должен обнаруживать признаки груминга', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Никому не говори, встретимся ночью без взрослых',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('medium');
    expect(result.reasons.some((r) => r.includes('встречи'))).toBe(true);
    expect(result.categories).toContain('grooming');
  });

  it('должен увеличивать confidence при множественных совпадениях', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Скажи адрес и переведи деньги срочно на карту',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('high');
    expect(result.confidence).toBeGreaterThan(0.55);
  });

  it('должен учитывать восклицательные знаки для safe сообщений', () => {
    const message1: Message = {
      id: 'msg1',
      text: 'Привет!!!',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const message2: Message = {
      id: 'msg2',
      text: 'Привет',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result1 = evaluateMessageRisk(message1);
    const result2 = evaluateMessageRisk(message2);

    expect(result1.confidence).toBeGreaterThan(result2.confidence);
  });

  it('должен выбирать максимальный уровень риска при множественных совпадениях', () => {
    const message: Message = {
      id: 'msg1',
      text: 'Убью тебя и переведи деньги',
      senderId: 'user1',
      senderName: 'User',
      timestamp: Date.now(),
      analyzed: false,
    };

    const result = evaluateMessageRisk(message);

    expect(result.riskLevel).toBe('critical'); // Максимальный уровень
    expect(result.reasons.length).toBeGreaterThan(1);
  });
});

describe('evaluateImageRisk', () => {
  it('должен блокировать изображения с опасными ключевыми словами', () => {
    expect(evaluateImageRisk('image_weapon.jpg').blocked).toBe(true);
    expect(evaluateImageRisk('photo_blood.png').blocked).toBe(true);
    expect(evaluateImageRisk('image_violence.gif').blocked).toBe(true);
    expect(evaluateImageRisk('photo_gun.jpg').blocked).toBe(true);
  });

  it('должен возвращать причину блокировки', () => {
    const result = evaluateImageRisk('image_weapon.jpg');

    expect(result.blocked).toBe(true);
    expect(result.reasons.length).toBe(1);
    expect(result.reasons[0]).toContain('weapon');
  });

  it('должен разрешать безопасные изображения', () => {
    expect(evaluateImageRisk('photo_safe.jpg').blocked).toBe(false);
    expect(evaluateImageRisk('image_normal.png').blocked).toBe(false);
    expect(evaluateImageRisk('picture_happy.gif').blocked).toBe(false);
  });

  it('должен работать с разным регистром', () => {
    expect(evaluateImageRisk('IMAGE_WEAPON.jpg').blocked).toBe(true);
    expect(evaluateImageRisk('Photo_Blood.png').blocked).toBe(true);
  });

  it('должен возвращать пустые причины для безопасных изображений', () => {
    const result = evaluateImageRisk('safe_image.jpg');

    expect(result.blocked).toBe(false);
    expect(result.reasons).toEqual([]);
  });
});


