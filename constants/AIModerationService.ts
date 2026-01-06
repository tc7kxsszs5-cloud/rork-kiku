import { RiskLevel, RiskAnalysis } from './types';

/**
 * Расширенный сервис AI модерации
 * Использует комбинацию правил и AI для более точного анализа
 */

export interface AIModerationConfig {
  useAdvancedAI: boolean;
  confidenceThreshold: number;
  enableImageAnalysis: boolean;
  enableSentimentAnalysis: boolean;
}

const DEFAULT_CONFIG: AIModerationConfig = {
  useAdvancedAI: true,
  confidenceThreshold: 0.7,
  enableImageAnalysis: true,
  enableSentimentAnalysis: true,
};

/**
 * Расширенный анализ сообщения с использованием AI
 */
export async function analyzeMessageWithAI(
  text: string,
  config: Partial<AIModerationConfig> = {}
): Promise<RiskAnalysis> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Базовая проверка на ключевые слова (быстрая)
  const basicAnalysis = analyzeWithRules(text);

  // Если базовый анализ показал критический риск, возвращаем сразу
  if (basicAnalysis.riskLevel === 'critical') {
    return basicAnalysis;
  }

  // Если включен расширенный AI анализ
  if (finalConfig.useAdvancedAI) {
    try {
      // Здесь можно интегрировать реальный AI API (OpenAI, Anthropic, etc.)
      // Пока используем улучшенный эвристический анализ
      const advancedAnalysis = await analyzeWithAdvancedHeuristics(text);
      
      // Объединяем результаты
      return combineAnalyses(basicAnalysis, advancedAnalysis);
    } catch (error) {
      console.error('[AIModeration] Advanced analysis failed, using basic:', error);
      return basicAnalysis;
    }
  }

  return basicAnalysis;
}

/**
 * Анализ изображения с AI
 */
export async function analyzeImageWithAI(
  imageUri: string,
  config: Partial<AIModerationConfig> = {}
): Promise<{ blocked: boolean; reasons: string[]; confidence: number }> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!finalConfig.enableImageAnalysis) {
    return { blocked: false, reasons: [], confidence: 0 };
  }

  try {
    // Базовая проверка на ключевые слова в URI
    const basicCheck = analyzeImageWithRules(imageUri);
    
    if (basicCheck.blocked) {
      return { ...basicCheck, confidence: 0.8 };
    }

    // Здесь можно добавить реальный AI анализ изображений
    // Например, через Vision API или специализированные сервисы модерации
    
    return { blocked: false, reasons: [], confidence: 0.5 };
  } catch (error) {
    console.error('[AIModeration] Image analysis failed:', error);
    return { blocked: false, reasons: [], confidence: 0 };
  }
}

/**
 * Базовый анализ с правилами (быстрый)
 */
function analyzeWithRules(text: string): RiskAnalysis {
  const normalized = text.toLowerCase();
  
  // Критические паттерны
  const criticalPatterns = [
    /(убью|убей|поконч|самоуб|умереть|взорв|бомб)/i,
    /(убить|смерть|суицид)/i,
  ];
  
  // Высокие риски
  const highPatterns = [
    /(адрес|домашн|парол|паспорт|номер карты|cvv|секретный код)/i,
    /(перевед[ие]|деньг|карта|плати|5000|срочно оплат)/i,
    /(оруж|пистолет|нож|наркот|взрывчат)/i,
  ];
  
  // Средние риски
  const mediumPatterns = [
    /(никому не говори|встреча без взрослых|секретная встреча|ночью|приди один)/i,
    /(дурак|тупой|ненавижу тебя|жирный|урод|никчем)/i,
    /(страшно|мне плохо|я боюсь|меня преследуют|издеваются)/i,
  ];

  // Проверка критических
  for (const pattern of criticalPatterns) {
    if (pattern.test(normalized)) {
      return {
        riskLevel: 'critical',
        reasons: ['Обнаружены критические угрозы'],
        confidence: 0.95,
        categories: ['threats'],
      };
    }
  }

  // Проверка высоких
  for (const pattern of highPatterns) {
    if (pattern.test(normalized)) {
      return {
        riskLevel: 'high',
        reasons: ['Обнаружен высокий риск'],
        confidence: 0.85,
        categories: ['privacy', 'fraud'],
      };
    }
  }

  // Проверка средних
  for (const pattern of mediumPatterns) {
    if (pattern.test(normalized)) {
      return {
        riskLevel: 'medium',
        reasons: ['Обнаружен средний риск'],
        confidence: 0.7,
        categories: ['grooming', 'bullying'],
      };
    }
  }

  return {
    riskLevel: 'safe',
    reasons: [],
    confidence: 0.3,
    categories: [],
  };
}

/**
 * Расширенный эвристический анализ
 */
async function analyzeWithAdvancedHeuristics(text: string): Promise<RiskAnalysis> {
  // Анализ длины сообщения
  const length = text.length;
  const hasExcessiveLength = length > 500;
  
  // Анализ использования заглавных букв (крики)
  const capsRatio = (text.match(/[A-ZА-Я]/g) || []).length / length;
  const isShouting = capsRatio > 0.5 && length > 10;
  
  // Анализ повторяющихся символов
  const hasRepeats = /(.)\1{4,}/.test(text);
  
  // Анализ числовых паттернов (возможные телефоны, адреса)
  const hasPhonePattern = /\d{10,}/.test(text);
  const hasAddressPattern = /(улица|дом|квартира|адрес)/i.test(text);
  
  // Анализ эмоциональных маркеров
  const hasNegativeEmotions = /(плохо|страшно|боюсь|ненавижу|ужасно)/i.test(text);
  const hasPositiveEmotions = /(хорошо|рад|счастлив|люблю)/i.test(text);
  
  let riskLevel: RiskLevel = 'safe';
  const reasons: string[] = [];
  const categories: string[] = [];
  let confidence = 0.3;

  if (isShouting && hasNegativeEmotions) {
    riskLevel = 'medium';
    reasons.push('Агрессивное сообщение с негативными эмоциями');
    categories.push('bullying');
    confidence = 0.65;
  }

  if (hasPhonePattern || hasAddressPattern) {
    riskLevel = 'high';
    reasons.push('Обнаружены личные данные');
    categories.push('privacy');
    confidence = 0.8;
  }

  if (hasRepeats && length > 20) {
    riskLevel = 'low';
    reasons.push('Подозрительный паттерн сообщения');
    categories.push('suspicious');
    confidence = 0.5;
  }

  return {
    riskLevel,
    reasons,
    confidence,
    categories,
  };
}

/**
 * Объединение результатов анализа
 */
function combineAnalyses(
  basic: RiskAnalysis,
  advanced: RiskAnalysis
): RiskAnalysis {
  const levels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
  const basicIndex = levels.indexOf(basic.riskLevel);
  const advancedIndex = levels.indexOf(advanced.riskLevel);
  
  // Берем более высокий уровень риска
  const combinedLevel = basicIndex > advancedIndex ? basic.riskLevel : advanced.riskLevel;
  
  // Объединяем причины
  const combinedReasons = [...new Set([...basic.reasons, ...advanced.reasons])];
  const combinedCategories = [...new Set([...basic.categories, ...advanced.categories])];
  
  // Усредняем уверенность
  const combinedConfidence = (basic.confidence + advanced.confidence) / 2;

  return {
    riskLevel: combinedLevel,
    reasons: combinedReasons,
    confidence: Math.min(0.99, combinedConfidence),
    categories: combinedCategories,
  };
}

/**
 * Базовый анализ изображений
 */
function analyzeImageWithRules(imageUri: string): { blocked: boolean; reasons: string[] } {
  const normalized = imageUri.toLowerCase();
  const riskKeywords = ['weapon', 'blood', 'nsfw', 'violence', 'gun', 'knife', 'nude', 'explicit'];
  
  const hit = riskKeywords.find((keyword) => normalized.includes(keyword));
  if (hit) {
    return {
      blocked: true,
      reasons: [`Изображение содержит рискованный контент: ${hit}`],
    };
  }

  return { blocked: false, reasons: [] };
}

