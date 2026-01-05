/**
 * Content Moderation Tests
 * Tests for AI-based content filtering
 */

import { describe, it, expect } from 'bun:test';
import { contentModeration, SeverityLevel } from '../../backend/messaging/moderation';

describe('ContentModerationService', () => {
  describe('moderateMessage', () => {
    it('should approve safe messages', async () => {
      const result = await contentModeration.moderateMessage(
        'Hello! How are you doing today?'
      );

      expect(result.isApproved).toBe(true);
      expect(result.flags).toHaveLength(0);
    });

    it('should flag profanity', async () => {
      const result = await contentModeration.moderateMessage(
        'You are stupid and dumb'
      );

      expect(result.isApproved).toBe(true); // Low severity
      expect(result.flags).toContain('profanity');
      expect(result.categories).toContain('profanity');
    });

    it('should flag harassment', async () => {
      const result = await contentModeration.moderateMessage(
        'I hate you and will hurt you'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('harassment');
    });

    it('should flag violence with critical severity', async () => {
      const result = await contentModeration.moderateMessage(
        'I have a gun and will use it'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('violence');
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('should flag self-harm content', async () => {
      const result = await contentModeration.moderateMessage(
        'I want to end it all, suicide seems like the answer'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('self_harm');
    });

    it('should flag personal information disclosure', async () => {
      const result = await contentModeration.moderateMessage(
        'My credit card number is 1234-5678-9012-3456'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('personal_info');
    });

    it('should flag scam attempts', async () => {
      const result = await contentModeration.moderateMessage(
        'Send money urgently, you won a prize!'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('scam');
    });

    it('should flag grooming patterns', async () => {
      const result = await contentModeration.moderateMessage(
        "Let's meet in secret, don't tell anyone"
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('grooming');
    });

    it('should flag excessive caps', async () => {
      const result = await contentModeration.moderateMessage(
        'HELLO THIS IS SHOUTING AT YOU!!!'
      );

      expect(result.flags).toContain('excessive_caps');
    });

    it('should flag excessive punctuation', async () => {
      const result = await contentModeration.moderateMessage(
        'What is happening!!! Why????'
      );

      expect(result.flags).toContain('excessive_punctuation');
    });

    it('should reject empty messages', async () => {
      const result = await contentModeration.moderateMessage('');

      expect(result.isApproved).toBe(false);
      expect(result.flags).toContain('empty_message');
    });

    it('should handle Russian language profanity', async () => {
      const result = await contentModeration.moderateMessage(
        'Ты дурак и идиот'
      );

      expect(result.flags).toContain('profanity');
    });

    it('should handle mixed content', async () => {
      const result = await contentModeration.moderateMessage(
        'You stupid idiot, I hate you and have a gun'
      );

      expect(result.isApproved).toBe(false);
      expect(result.flags.length).toBeGreaterThan(1);
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('moderateMessages', () => {
    it('should moderate multiple messages', async () => {
      const messages = [
        'Hello friend',
        'You are stupid',
        'I have a weapon',
      ];

      const results = await contentModeration.moderateMessages(messages);

      expect(results).toHaveLength(3);
      expect(results[0].isApproved).toBe(true);
      expect(results[1].flags).toContain('profanity');
      expect(results[2].flags).toContain('violence');
    });
  });
});
