/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitize string input - remove dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);

  // Remove null bytes and control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Remove potential SQL injection patterns (basic protection)
  // Note: Supabase SDK already protects against SQL injection, but this adds extra layer
  sanitized = sanitized.replace(/['";\\]/g, '');

  return sanitized;
}

/**
 * Sanitize device ID - alphanumeric, dashes, underscores only
 */
export function sanitizeDeviceId(deviceId: string): string {
  if (!deviceId || typeof deviceId !== 'string') {
    throw new Error('Invalid device ID');
  }

  // Only allow alphanumeric, dashes, underscores, dots
  const sanitized = deviceId.replace(/[^a-zA-Z0-9._-]/g, '');

  if (sanitized.length < 1 || sanitized.length > 100) {
    throw new Error('Device ID must be between 1 and 100 characters');
  }

  return sanitized;
}

/**
 * Validate and sanitize JSON data
 */
export function sanitizeJSON(data: any, maxSize: number = 100000): any {
  if (!data) {
    return null;
  }

  // Check size
  const jsonString = JSON.stringify(data);
  if (jsonString.length > maxSize) {
    throw new Error(`Data size exceeds maximum allowed size of ${maxSize} bytes`);
  }

  // Deep sanitize strings in object
  return deepSanitize(data);
}

/**
 * Deep sanitize object - recursively sanitize all string values
 */
function deepSanitize(obj: any, depth: number = 0): any {
  if (depth > 10) {
    // Prevent infinite recursion
    throw new Error('Object depth exceeds maximum');
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitize(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize key
      const sanitizedKey = sanitizeString(key, 100);
      if (sanitizedKey) {
        sanitized[sanitizedKey] = deepSanitize(value, depth + 1);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Validate timestamp
 */
export function validateTimestamp(timestamp: number): number {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    throw new Error('Invalid timestamp');
  }

  // Timestamp must be reasonable (between 2000 and 2100)
  const minTimestamp = 946684800000; // 2000-01-01
  const maxTimestamp = 4102444800000; // 2100-01-01

  if (timestamp < minTimestamp || timestamp > maxTimestamp) {
    throw new Error('Timestamp out of valid range');
  }

  return Math.floor(timestamp);
}

/**
 * Validate array length
 */
export function validateArrayLength<T>(arr: T[], maxLength: number = 1000): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('Expected an array');
  }

  if (arr.length > maxLength) {
    throw new Error(`Array length exceeds maximum of ${maxLength} items`);
  }

  return arr;
}

/**
 * Check for potential XSS in string
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  // Check for common XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize and validate email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email');
  }

  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized) || sanitized.length > 254) {
    throw new Error('Invalid email format');
  }

  return sanitized;
}

/**
 * Sanitize and validate phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    throw new Error('Invalid phone');
  }

  // Remove all non-digit characters except +
  const sanitized = phone.replace(/[^\d+]/g, '');

  // Basic validation: should start with + and have 10-15 digits
  if (!sanitized.startsWith('+') || sanitized.length < 11 || sanitized.length > 16) {
    throw new Error('Invalid phone format');
  }

  return sanitized;
}
