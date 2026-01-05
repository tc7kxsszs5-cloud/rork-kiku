/**
 * Content Moderation Service
 * AI-based content filtering for child safety
 */

import { ModerationResult } from './types';

// Toxicity categories
export enum ToxicityCategory {
  PROFANITY = 'profanity',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  VIOLENCE = 'violence',
  SEXUAL_CONTENT = 'sexual_content',
  SELF_HARM = 'self_harm',
  PERSONAL_INFO = 'personal_info',
  SCAM = 'scam',
  GROOMING = 'grooming',
}

// Severity levels for moderation
export enum SeverityLevel {
  SAFE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

// Keyword patterns for different categories
const MODERATION_PATTERNS = {
  [ToxicityCategory.PROFANITY]: [
    /\b(дурак|идиот|тупой|придурок|дебил)\b/i,
    /\b(stupid|idiot|dumb|moron)\b/i,
  ],
  [ToxicityCategory.HARASSMENT]: [
    /\b(убью|ненавижу|издеваюсь|травлю)\b/i,
    /\b(hate|bully|kill|hurt)\b/i,
  ],
  [ToxicityCategory.VIOLENCE]: [
    /\b(оружие|нож|пистолет|взрыв|убить)\b/i,
    /\b(weapon|gun|knife|bomb|kill)\b/i,
  ],
  [ToxicityCategory.SELF_HARM]: [
    /\b(самоубийство|покончить|умереть|суицид)\b/i,
    /\b(suicide|self-harm|end it all)\b/i,
  ],
  [ToxicityCategory.PERSONAL_INFO]: [
    /\b(адрес|паспорт|номер карты|cvv)\b/i,
    /\b(password|credit card|ssn|address)\b/i,
    /\d{3}[-.\s]?\d{2}[-.\s]?\d{4}/,
    /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/,
  ],
  [ToxicityCategory.SCAM]: [
    /\b(перевед[ие]|деньг|срочно оплат|выигрыш|приз)\b/i,
    /\b(send money|urgent payment|prize|winner)\b/i,
  ],
  [ToxicityCategory.GROOMING]: [
    /\b(встретимся втайне|никому не говори|секретная встреча)\b/i,
    /\b(secret meeting|don't tell anyone|meet in private)\b/i,
  ],
};

/**
 * Content Moderation Service
 */
export class ContentModerationService {
  /**
   * Moderate a message using AI-based filtering
   * @param text - Message text to moderate
   * @returns Moderation result
   */
  async moderateMessage(text: string): Promise<ModerationResult> {
    // Normalize text for analysis
    const normalized = text.toLowerCase().trim();
    
    if (!normalized) {
      return {
        isApproved: false,
        flags: ['empty_message'],
        reasons: ['Message is empty'],
        confidence: 1.0,
        categories: [],
      };
    }
    
    const flags: string[] = [];
    const reasons: string[] = [];
    const categories: string[] = [];
    let maxSeverity = SeverityLevel.SAFE;
    
    // Check against patterns
    for (const [category, patterns] of Object.entries(MODERATION_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(normalized)) {
          flags.push(category);
          categories.push(category);
          
          // Determine severity
          let severity = SeverityLevel.LOW;
          switch (category) {
            case ToxicityCategory.SELF_HARM:
            case ToxicityCategory.VIOLENCE:
              severity = SeverityLevel.CRITICAL;
              reasons.push(`Critical content detected: ${category}`);
              break;
            case ToxicityCategory.GROOMING:
            case ToxicityCategory.PERSONAL_INFO:
              severity = SeverityLevel.HIGH;
              reasons.push(`High-risk content detected: ${category}`);
              break;
            case ToxicityCategory.HARASSMENT:
            case ToxicityCategory.SCAM:
              severity = SeverityLevel.MEDIUM;
              reasons.push(`Potentially harmful content: ${category}`);
              break;
            default:
              severity = SeverityLevel.LOW;
              reasons.push(`Inappropriate content: ${category}`);
          }
          
          maxSeverity = Math.max(maxSeverity, severity);
          break;
        }
      }
    }
    
    // Additional checks
    const hasExcessiveCaps = this.checkExcessiveCaps(text);
    if (hasExcessiveCaps) {
      flags.push('excessive_caps');
      categories.push('formatting');
    }
    
    const hasExcessivePunctuation = this.checkExcessivePunctuation(text);
    if (hasExcessivePunctuation) {
      flags.push('excessive_punctuation');
      categories.push('formatting');
    }
    
    // Calculate confidence based on matches
    const confidence = flags.length > 0 
      ? Math.min(0.95, 0.6 + (flags.length * 0.1))
      : 0.2;
    
    // Determine if message is approved
    const isApproved = maxSeverity <= SeverityLevel.LOW && 
                       !flags.includes(ToxicityCategory.SELF_HARM) &&
                       !flags.includes(ToxicityCategory.VIOLENCE);
    
    return {
      isApproved,
      flags: Array.from(new Set(flags)),
      reasons: Array.from(new Set(reasons)),
      confidence,
      categories: Array.from(new Set(categories)),
    };
  }
  
  /**
   * Check for excessive capital letters (shouting)
   */
  private checkExcessiveCaps(text: string): boolean {
    if (text.length < 10) return false;
    const capsCount = (text.match(/[A-ZА-Я]/g) || []).length;
    return capsCount / text.length > 0.6;
  }
  
  /**
   * Check for excessive punctuation (spam-like)
   */
  private checkExcessivePunctuation(text: string): boolean {
    const punctCount = (text.match(/[!?]{3,}/g) || []).length;
    return punctCount > 0;
  }
  
  /**
   * Batch moderate multiple messages
   */
  async moderateMessages(messages: string[]): Promise<ModerationResult[]> {
    return Promise.all(messages.map(msg => this.moderateMessage(msg)));
  }
}

// Export singleton instance
export const contentModeration = new ContentModerationService();
