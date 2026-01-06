import { analyzeTextContent, shouldBlockMessage, shouldNotifyParent, sanitizeMessage } from '../services/content-filter';

/**
 * Unit tests for content filtering service
 * These tests verify the AI-based content filtering functionality
 */

describe('Content Filter Service', () => {
  describe('analyzeTextContent', () => {
    test('should mark safe content as safe', async () => {
      const result = await analyzeTextContent('Hello! How are you today?');
      
      expect(result.riskLevel).toBe('safe');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.categories).toHaveLength(0);
      expect(result.reasons).toContain('Content is safe');
    });

    test('should detect bullying language', async () => {
      const result = await analyzeTextContent('You are so stupid and nobody likes you');
      
      expect(result.riskLevel).toBe('high');
      expect(result.categories).toContain('bullying');
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons[0]).toMatch(/bullying/i);
    });

    test('should detect profanity', async () => {
      const result = await analyzeTextContent('What the hell is going on');
      
      expect(['medium', 'low']).toContain(result.riskLevel);
      expect(result.categories).toContain('profanity');
    });

    test('should detect violence threats', async () => {
      const result = await analyzeTextContent('I will hurt you with a weapon');
      
      expect(result.riskLevel).toBe('critical');
      expect(result.categories).toContain('violence');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('should detect predatory behavior', async () => {
      const result = await analyzeTextContent('Send me pictures and dont tell anyone');
      
      expect(result.riskLevel).toBe('critical');
      expect(result.categories).toContain('predatory');
    });

    test('should detect personal information', async () => {
      const result = await analyzeTextContent('My phone number is 555-123-4567');
      
      expect(['medium', 'low']).toContain(result.riskLevel);
      expect(result.categories).toContain('personalInfo');
    });

    test('should detect email addresses', async () => {
      const result = await analyzeTextContent('Contact me at test@example.com');
      
      expect(['medium', 'low']).toContain(result.riskLevel);
      expect(result.categories).toContain('personalInfo');
    });

    test('should detect inappropriate content', async () => {
      const result = await analyzeTextContent('Do you want to be my girlfriend?');
      
      expect(result.riskLevel).toBe('high');
      expect(result.categories).toContain('inappropriate');
    });

    test('should handle multiple issues', async () => {
      const result = await analyzeTextContent('You are stupid and I will hurt you');
      
      expect(['high', 'critical']).toContain(result.riskLevel);
      expect(result.categories.length).toBeGreaterThan(0);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    test('should be case insensitive', async () => {
      const result1 = await analyzeTextContent('STUPID');
      const result2 = await analyzeTextContent('stupid');
      const result3 = await analyzeTextContent('StUpId');
      
      expect(result1.riskLevel).toBe(result2.riskLevel);
      expect(result2.riskLevel).toBe(result3.riskLevel);
    });
  });

  describe('shouldBlockMessage', () => {
    test('should block critical risk messages', () => {
      expect(shouldBlockMessage('critical')).toBe(true);
    });

    test('should block high risk messages', () => {
      expect(shouldBlockMessage('high')).toBe(true);
    });

    test('should not block medium risk messages', () => {
      expect(shouldBlockMessage('medium')).toBe(false);
    });

    test('should not block low risk messages', () => {
      expect(shouldBlockMessage('low')).toBe(false);
    });

    test('should not block safe messages', () => {
      expect(shouldBlockMessage('safe')).toBe(false);
    });
  });

  describe('shouldNotifyParent', () => {
    test('should notify parent for critical messages', () => {
      expect(shouldNotifyParent('critical')).toBe(true);
    });

    test('should notify parent for high risk messages', () => {
      expect(shouldNotifyParent('high')).toBe(true);
    });

    test('should notify parent for medium risk messages', () => {
      expect(shouldNotifyParent('medium')).toBe(true);
    });

    test('should not notify parent for low risk messages', () => {
      expect(shouldNotifyParent('low')).toBe(false);
    });

    test('should not notify parent for safe messages', () => {
      expect(shouldNotifyParent('safe')).toBe(false);
    });
  });

  describe('sanitizeMessage', () => {
    test('should not modify safe messages', () => {
      const text = 'Hello, how are you?';
      const analysis = { riskLevel: 'safe' as const, reasons: [], confidence: 1, categories: [] };
      
      expect(sanitizeMessage(text, analysis)).toBe(text);
    });

    test('should sanitize profanity', async () => {
      const text = 'This is damn annoying';
      const analysis = await analyzeTextContent(text);
      const sanitized = sanitizeMessage(text, analysis);
      
      expect(sanitized).not.toBe(text);
      expect(sanitized).toContain('****');
    });

    test('should sanitize bullying words', async () => {
      const text = 'You are stupid';
      const analysis = await analyzeTextContent(text);
      const sanitized = sanitizeMessage(text, analysis);
      
      expect(sanitized).toContain('******');
    });

    test('should sanitize phone numbers', async () => {
      const text = 'Call me at 555-123-4567';
      const analysis = await analyzeTextContent(text);
      const sanitized = sanitizeMessage(text, analysis);
      
      if (analysis.riskLevel !== 'safe') {
        expect(sanitized).toContain('***');
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', async () => {
      const result = await analyzeTextContent('');
      expect(result.riskLevel).toBe('safe');
    });

    test('should handle very long messages', async () => {
      const longText = 'Hello '.repeat(1000);
      const result = await analyzeTextContent(longText);
      expect(result).toHaveProperty('riskLevel');
    });

    test('should handle special characters', async () => {
      const result = await analyzeTextContent('!@#$%^&*()_+-=[]{}|;:,.<>?');
      expect(result.riskLevel).toBe('safe');
    });

    test('should handle unicode characters', async () => {
      const result = await analyzeTextContent('Hello 你好 مرحبا 🌟');
      expect(result.riskLevel).toBe('safe');
    });

    test('should handle numbers only', async () => {
      const result = await analyzeTextContent('123456789');
      expect(result.riskLevel).toBe('safe');
    });
  });

  describe('Boundary Testing', () => {
    test('should handle words that contain inappropriate substrings', async () => {
      // "assistant" contains "ass" but should not be flagged
      const result = await analyzeTextContent('I need an assistant');
      expect(result.riskLevel).toBe('safe');
    });

    test('should only match whole words for profanity', async () => {
      const result = await analyzeTextContent('class assignment');
      // Should not flag "class" even though it contains "ass"
      expect(result.riskLevel).toBe('safe');
    });
  });

  describe('Performance', () => {
    test('should analyze content quickly', async () => {
      const start = Date.now();
      await analyzeTextContent('This is a test message for performance');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    test('should handle concurrent analyses', async () => {
      const promises = Array(10).fill(null).map(() => 
        analyzeTextContent('Test message ' + Math.random())
      );
      
      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toHaveProperty('riskLevel');
      });
    });
  });
});
