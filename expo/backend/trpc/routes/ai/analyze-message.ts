/**
 * AI moderation proxy — keeps API keys on server only (security best practice).
 * Client calls this instead of using OPENAI_API_KEY in the bundle.
 */

import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { rateLimiters } from '../../middleware/rateLimit.js';

const RISK_LEVELS = ['safe', 'low', 'medium', 'high', 'critical'] as const;
type RiskLevel = (typeof RISK_LEVELS)[number];

function mapOpenAIToRiskLevel(
  flagged: boolean,
  categoryScores: Record<string, number>
): RiskLevel {
  if (!flagged) return 'safe';
  const maxScore = Math.max(...Object.values(categoryScores));
  if (maxScore >= 0.9) return 'critical';
  if (maxScore >= 0.7) return 'high';
  if (maxScore >= 0.5) return 'medium';
  return 'low';
}

function mapCategories(categories: Record<string, boolean>): string[] {
  const out: string[] = [];
  if (categories.hate) out.push('hate');
  if (categories['hate/threatening']) out.push('hate_threatening');
  if (categories['self-harm']) out.push('self_harm');
  if (categories.sexual) out.push('sexual');
  if (categories['sexual/minors']) out.push('sexual_minors');
  if (categories.violence) out.push('violence');
  if (categories['violence/graphic']) out.push('violence_graphic');
  return out;
}

export const analyzeMessageProcedure = protectedProcedure
  .use(rateLimiters.ai)
  .input(
    z.object({
      text: z.string().min(1).max(10000),
    })
  )
  .query(async ({ input }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const endpoint = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';

    if (!apiKey) {
      return {
        riskLevel: 'safe' as RiskLevel,
        reasons: [],
        confidence: 0.5,
        categories: [],
      };
    }

    try {
      const response = await fetch(`${endpoint}/moderations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.text }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[ai.analyzeMessage] OpenAI error:', response.status, errText);
        return {
          riskLevel: 'safe' as RiskLevel,
          reasons: [],
          confidence: 0.5,
          categories: [],
        };
      }

      const data = (await response.json()) as {
        results?: Array<{
          flagged: boolean;
          categories: Record<string, boolean>;
          category_scores: Record<string, number>;
        }>;
      };
      const result = data.results?.[0];
      if (!result) {
        return {
          riskLevel: 'safe' as RiskLevel,
          reasons: [],
          confidence: 0.5,
          categories: [],
        };
      }

      const riskLevel = mapOpenAIToRiskLevel(result.flagged, result.category_scores);
      const categories = mapCategories(result.categories);
      const reasons: string[] = [];
      if (result.flagged) {
        Object.entries(result.categories).forEach(([cat, flag]) => {
          if (flag) reasons.push(`Detected: ${cat}`);
        });
      }
      const maxScore = Math.max(...Object.values(result.category_scores));
      const confidence = result.flagged ? maxScore : 1 - maxScore;

      return {
        riskLevel,
        reasons,
        confidence,
        categories,
      };
    } catch (error) {
      console.error('[ai.analyzeMessage] Error:', error);
      return {
        riskLevel: 'safe' as RiskLevel,
        reasons: [],
        confidence: 0.5,
        categories: [],
      };
    }
  });
