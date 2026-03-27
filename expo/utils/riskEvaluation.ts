/**
 * Утилиты для оценки риска сообщений и изображений
 * 
 * Чистые детерминированные функции для анализа безопасности контента.
 * Используются в MonitoringContext для оценки рисков в реальном времени.
 */

import { Message, RiskAnalysis, RiskLevel } from '@/constants/types';

const LEVEL_ORDER: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];

type KeywordRule = {
  level: RiskLevel;
  pattern: RegExp;
  reason: string;
  category: string;
};

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
    level: 'high',
    pattern: /(оруж|пистолет|нож|наркот|взрывчат)/i,
    reason: 'Упоминание оружия или запрещённых веществ',
    category: 'safety',
  },
  {
    level: 'medium',
    pattern: /(никому не говори|встреча без взрослых|секретная встреча|ночью|приди один)/i,
    reason: 'Секретные встречи без взрослых',
    category: 'grooming',
  },
  {
    level: 'medium',
    pattern: /(дурак|тупой|ненавижу тебя|жирный|урод|никчем)/i,
    reason: 'Травля и унижения',
    category: 'bullying',
  },
  {
    level: 'medium',
    pattern: /(страшно|мне плохо|я боюсь|меня преследуют|издеваются)/i,
    reason: 'Запрос помощи или признаки давления',
    category: 'distress',
  },
  {
    level: 'low',
    pattern: /(ночью играть|спорим не расскажешь|скинь фотку|отправь фото)/i,
    reason: 'Подозрительные просьбы',
    category: 'boundaries',
  },
];

const IMAGE_RISK_KEYWORDS = ['weapon', 'blood', 'nsfw', 'violence', 'gun', 'knife'];

/**
 * Оценивает уровень риска сообщения на основе ключевых слов и паттернов
 * 
 * @param message - Сообщение для оценки
 * @returns Анализ риска с уровнем, причинами, уверенностью и категориями
 */
export function evaluateMessageRisk(message: Message): RiskAnalysis {
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
}

/**
 * Оценивает уровень риска изображения на основе ключевых слов в URI
 * 
 * @param imageUri - URI изображения для оценки
 * @returns Объект с флагом блокировки и причинами
 */
export function evaluateImageRisk(imageUri: string): { blocked: boolean; reasons: string[] } {
  const normalized = imageUri.toLowerCase();
  const hit = IMAGE_RISK_KEYWORDS.find((keyword) => normalized.includes(keyword));
  if (!hit) {
    return { blocked: false, reasons: [] };
  }

  return {
    blocked: true,
    reasons: [`Изображение отмечено как рискованное по ключевому слову "${hit}"`],
  };
}
