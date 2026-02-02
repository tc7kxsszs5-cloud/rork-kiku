/**
 * AI Service
 * Provides AI analysis capabilities for messages and images
 */

import { RiskAnalysis, RiskLevel } from '@/constants/types';
import { logger } from './logger';
import Constants from 'expo-constants';

export interface AIConfig {
  provider: 'local' | 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  endpoint?: string;
}

/**
 * Get AI configuration from environment or defaults
 */
export function getAIConfig(): AIConfig {
  // Read from environment variables (via expo-constants)
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey || 
                 process.env.OPENAI_API_KEY || 
                 undefined;
  
  const provider = (Constants.expoConfig?.extra?.aiProvider || 
                    process.env.AI_PROVIDER || 
                    'local') as AIConfig['provider'];

  const endpoint = Constants.expoConfig?.extra?.openaiApiBaseUrl || 
                   process.env.OPENAI_API_BASE_URL || 
                   'https://api.openai.com/v1';

  return {
    provider,
    apiKey,
    endpoint,
  };
}

/**
 * Map OpenAI moderation categories to our risk categories
 */
function mapOpenAICategoriesToRiskCategories(categories: Record<string, boolean>): string[] {
  const mapped: string[] = [];
  
  if (categories.hate) mapped.push('hate');
  if (categories['hate/threatening']) mapped.push('hate_threatening');
  if (categories['self-harm']) mapped.push('self_harm');
  if (categories.sexual) mapped.push('sexual');
  if (categories['sexual/minors']) mapped.push('sexual_minors');
  if (categories.violence) mapped.push('violence');
  if (categories['violence/graphic']) mapped.push('violence_graphic');
  
  return mapped;
}

/**
 * Map OpenAI moderation result to our RiskLevel
 */
function mapOpenAIToRiskLevel(flagged: boolean, categoryScores: Record<string, number>): RiskLevel {
  if (!flagged) {
    return 'safe';
  }

  // Определяем уровень риска на основе максимального score
  const maxScore = Math.max(...Object.values(categoryScores));
  
  if (maxScore >= 0.9) return 'critical';
  if (maxScore >= 0.7) return 'high';
  if (maxScore >= 0.5) return 'medium';
  return 'low';
}

/**
 * Analyze message with OpenAI Moderation API
 */
async function analyzeWithOpenAI(
  text: string,
  apiKey: string,
  endpoint: string = 'https://api.openai.com/v1'
): Promise<RiskAnalysis> {
  try {
    const response = await fetch(`${endpoint}/moderations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const result = data.results[0];

    if (!result) {
      throw new Error('Invalid response from OpenAI API');
    }

    const riskLevel = mapOpenAIToRiskLevel(result.flagged, result.category_scores);
    const categories = mapOpenAICategoriesToRiskCategories(result.categories);
    
    const reasons: string[] = [];
    if (result.flagged) {
      Object.entries(result.categories).forEach(([category, flagged]) => {
        if (flagged) {
          reasons.push(`Detected: ${category}`);
        }
      });
    }

    const maxScore = Math.max(...Object.values(result.category_scores as Record<string, number>));
    const confidence = result.flagged ? maxScore : 1 - maxScore;

    return {
      riskLevel,
      confidence,
      reasons,
      categories,
    };
  } catch (error) {
    logger.error('OpenAI API error', error instanceof Error ? error : new Error(String(error)), {
      context: 'aiService',
      action: 'analyzeWithOpenAI',
    });
    throw error;
  }
}

// Simple in-memory cache for AI analysis results
// In production, this should use Redis or similar
const analysisCache = new Map<string, { result: RiskAnalysis; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cache key for text analysis
 */
function getCacheKey(text: string): string {
  // Simple hash for cache key (in production, use proper hashing)
  return `ai_analysis_${text.substring(0, 100)}_${text.length}`;
}

/**
 * Get cached analysis result if available
 */
function getCachedAnalysis(text: string): RiskAnalysis | null {
  const cacheKey = getCacheKey(text);
  const cached = analysisCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  
  if (cached) {
    analysisCache.delete(cacheKey); // Remove expired cache
  }
  
  return null;
}

/**
 * Cache analysis result
 */
function cacheAnalysis(text: string, result: RiskAnalysis): void {
  const cacheKey = getCacheKey(text);
  analysisCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });
  
  // Limit cache size (keep last 1000 entries)
  if (analysisCache.size > 1000) {
    const firstKey = analysisCache.keys().next().value;
    if (firstKey !== undefined) {
      analysisCache.delete(firstKey);
    }
  }
}

/**
 * Analyze message with real AI API
 * Supports OpenAI Moderation API with fallback to local analysis
 * Includes caching to reduce API calls
 */
export async function analyzeMessageWithRealAI(
  text: string,
  config: AIConfig
): Promise<RiskAnalysis> {
  // Check cache first
  const cached = getCachedAnalysis(text);
  if (cached) {
    logger.info('Using cached AI analysis', {
      context: 'aiService',
      action: 'analyzeMessageWithRealAI',
    });
    return cached;
  }

  // Если OpenAI настроен и есть API ключ
  if (config.provider === 'openai' && config.apiKey) {
    try {
      const result = await analyzeWithOpenAI(text, config.apiKey, config.endpoint);
      // Cache the result
      cacheAnalysis(text, result);
      return result;
    } catch (error) {
      // Fallback на локальный анализ при ошибке API
      logger.warn('OpenAI API failed, falling back to local analysis', {
        context: 'aiService',
        action: 'analyzeMessageWithRealAI',
        error: error instanceof Error ? error.message : String(error),
      });
      // Продолжаем к локальному анализу
    }
  }

  // Локальный анализ (fallback или если provider='local')
  // Это будет обработано в AIModerationService
  const fallbackResult: RiskAnalysis = {
    riskLevel: 'safe' as RiskLevel,
    confidence: 0.5,
    reasons: [],
    categories: [],
  };
  
  // Cache fallback result too (shorter TTL could be used)
  cacheAnalysis(text, fallbackResult);
  
  return fallbackResult;
}
