import { RiskLevel, RiskAnalysis } from '../../constants/types';

/**
 * AI-based content filtering service
 * This service analyzes text messages for inappropriate content
 * Uses a rule-based approach with patterns that can be extended with AI APIs
 */

// NOTE: In production, consider moving these patterns to a configuration file
// or database table for easier maintenance and updates without code changes.
// This allows non-technical staff to update filtering rules and adapt to new threats.
// See docs/SECURITY.md for recommendations on pattern management.

// Inappropriate content patterns (expanded for child safety)
const INAPPROPRIATE_PATTERNS = {
  // Bullying and harassment
  bullying: [
    /\b(stupid|idiot|loser|ugly|fat|dumb|worthless|hate you|kill yourself)\b/i,
    /\b(nobody likes you|you suck|go away|leave me alone)\b/i,
  ],
  
  // Profanity and explicit content
  profanity: [
    /\b(fuck|shit|damn|bitch|ass|crap|hell)\b/i,
    /\b(bastard|piss|cock|dick)\b/i,
  ],
  
  // Violence and threats
  violence: [
    /\b(kill|hurt|beat|punch|hit|fight|attack|weapon|gun|knife)\b/i,
    /\b(threat|harm|danger|blood)\b/i,
  ],
  
  // Predatory behavior
  predatory: [
    /\b(secret|don't tell|meet alone|send pictures|location|address|phone number)\b/i,
    /\b(where do you live|how old are you|are you alone)\b/i,
  ],
  
  // Sensitive personal information
  personalInfo: [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
    /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr)\b/i, // Addresses
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email addresses
  ],
  
  // Inappropriate requests
  inappropriate: [
    /\b(naked|nude|sexy|kiss|date|boyfriend|girlfriend)\b/i,
    /\b(love|romantic|relationship)\b/i,
  ],
};

// Risk level thresholds
const RISK_THRESHOLDS = {
  critical: ['predatory', 'violence'],
  high: ['bullying', 'inappropriate'],
  medium: ['profanity', 'personalInfo'],
};

/**
 * Analyze text content for inappropriate material
 */
export const analyzeTextContent = async (text: string): Promise<RiskAnalysis> => {
  const categories: string[] = [];
  const reasons: string[] = [];
  
  // Check against all patterns
  for (const [category, patterns] of Object.entries(INAPPROPRIATE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        categories.push(category);
        const match = text.match(pattern);
        if (match) {
          reasons.push(`Detected ${category}: "${match[0]}"`);
        }
        break; // Only report once per category
      }
    }
  }

  // Determine risk level based on categories found
  let riskLevel: RiskLevel = 'safe';
  let confidence = 0.7; // Base confidence

  if (categories.length === 0) {
    riskLevel = 'safe';
    confidence = 0.9;
  } else {
    // Check for critical issues first
    if (categories.some((cat) => RISK_THRESHOLDS.critical.includes(cat))) {
      riskLevel = 'critical';
      confidence = 0.95;
    } else if (categories.some((cat) => RISK_THRESHOLDS.high.includes(cat))) {
      riskLevel = 'high';
      confidence = 0.85;
    } else if (categories.some((cat) => RISK_THRESHOLDS.medium.includes(cat))) {
      riskLevel = 'medium';
      confidence = 0.75;
    } else {
      riskLevel = 'low';
      confidence = 0.7;
    }
  }

  return {
    riskLevel,
    reasons: reasons.length > 0 ? reasons : ['Content is safe'],
    confidence,
    categories,
  };
};

/**
 * Analyze text content using OpenAI (optional enhanced version)
 * This is a placeholder for when OpenAI API key is configured
 */
export const analyzeWithAI = async (text: string, apiKey?: string): Promise<RiskAnalysis> => {
  // If no API key is provided, fall back to rule-based analysis
  if (!apiKey) {
    return analyzeTextContent(text);
  }

  try {
    // This is where OpenAI integration would go
    // For now, we use the rule-based approach
    // In production, you would:
    // 1. Import OpenAI SDK
    // 2. Create a client with apiKey
    // 3. Use GPT-4 with a child-safety prompt
    // 4. Parse the response and return risk analysis
    
    const ruleBasedResult = await analyzeTextContent(text);
    
    // Placeholder for AI enhancement
    // const openai = new OpenAI({ apiKey });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a content moderator for a children's messaging app. Analyze the following message for inappropriate content, bullying, violence, or predatory behavior. Respond with a JSON object containing riskLevel (safe/low/medium/high/critical), reasons array, and confidence score."
    //     },
    //     {
    //       role: "user",
    //       content: text
    //     }
    //   ]
    // });
    
    return ruleBasedResult;
  } catch (error) {
    console.error('AI analysis failed, falling back to rule-based:', error);
    return analyzeTextContent(text);
  }
};

/**
 * Check if message should be blocked immediately
 */
export const shouldBlockMessage = (riskLevel: RiskLevel): boolean => {
  return riskLevel === 'critical' || riskLevel === 'high';
};

/**
 * Check if message should trigger parental notification
 */
export const shouldNotifyParent = (riskLevel: RiskLevel): boolean => {
  return riskLevel === 'critical' || riskLevel === 'high' || riskLevel === 'medium';
};

/**
 * Sanitize message text by removing detected inappropriate content
 */
export const sanitizeMessage = (text: string, analysis: RiskAnalysis): string => {
  if (analysis.riskLevel === 'safe') {
    return text;
  }

  let sanitized = text;
  
  // Replace inappropriate words with asterisks
  for (const [category, patterns] of Object.entries(INAPPROPRIATE_PATTERNS)) {
    if (analysis.categories.includes(category)) {
      for (const pattern of patterns) {
        sanitized = sanitized.replace(pattern, (match) => '*'.repeat(match.length));
      }
    }
  }

  return sanitized;
};
