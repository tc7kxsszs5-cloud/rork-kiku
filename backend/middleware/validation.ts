/**
 * Middleware для валидации и безопасности
 */

import { z } from 'zod';

/**
 * Валидация deviceId
 */
export const deviceIdSchema = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_-]+$/);

/**
 * Валидация userId
 */
export const userIdSchema = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_-]+$/);

/**
 * Валидация timestamp (должен быть разумным)
 */
export const timestampSchema = z.number().int().min(0).max(Date.now() + 86400000); // Не больше чем завтра

/**
 * Sanitize строку (удаление опасных символов)
 */
export const sanitizeString = (str: string, maxLength: number = 1000): string => {
  return str
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Удаляем потенциально опасные символы
    .trim();
};

/**
 * Rate limiting helper (базовая реализация)
 * В production использовать Redis или специализированные библиотеки
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 минута
): boolean => {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

/**
 * Очистка старых записей rate limiting (вызывать периодически)
 */
export const cleanupRateLimit = (): void => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetAt) {
      requestCounts.delete(key);
    }
  }
};


