/**
 * Encryption Utilities
 * Provides encryption/decryption functions for secure messaging
 * 
 * ⚠️ SECURITY WARNING: This is a PLACEHOLDER implementation for development only!
 * Base64 encoding is NOT encryption and provides NO security.
 * 
 * For production, you MUST replace this with proper encryption:
 * - Use AES-256-GCM or ChaCha20-Poly1305
 * - Use proper key management (AWS KMS, HashiCorp Vault)
 * - Implement key rotation
 * - Use crypto.subtle API or established libraries like libsodium
 */

/**
 * PLACEHOLDER: Base64 encoding (NOT ENCRYPTION - DEV ONLY)
 * ⚠️ DO NOT USE IN PRODUCTION - Provides no security whatsoever
 * 
 * In production, replace with proper encryption (AES-256-GCM, etc.)
 */
export class MessageEncryption {
  private static readonly ALGORITHM = 'base64'; // PLACEHOLDER ONLY
  
  /**
   * Encrypt a message
   * @param text - Plain text to encrypt
   * @returns Encrypted text
   */
  static encrypt(text: string): string {
    try {
      // In production, use proper encryption like crypto.subtle or node:crypto
      // For now, using base64 as placeholder
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(text, 'utf8').toString('base64');
      }
      return btoa(text);
    } catch (error) {
      console.error('Encryption error:', error);
      return text;
    }
  }
  
  /**
   * Decrypt a message
   * @param encrypted - Encrypted text
   * @returns Decrypted plain text
   */
  static decrypt(encrypted: string): string {
    try {
      // In production, use proper decryption
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(encrypted, 'base64').toString('utf8');
      }
      return atob(encrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return encrypted;
    }
  }
  
  /**
   * Generate a simple hash for message integrity
   * @param text - Text to hash
   * @returns Hash string
   */
  static hash(text: string): string {
    // Simple hash for demo purposes
    // In production, use crypto.createHash or crypto.subtle.digest
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Generate a random encryption key
   * @returns Random key string
   */
  static generateKey(): string {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Sanitize user input to prevent XSS
 * @param text - User input text
 * @returns Sanitized text
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate message length and content
 * @param text - Message text
 * @returns Validation result
 */
export function validateMessage(text: string): { valid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (text.length > 5000) {
    return { valid: false, error: 'Message exceeds maximum length (5000 characters)' };
  }
  
  // Check for control characters
  if (/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(text)) {
    return { valid: false, error: 'Message contains invalid characters' };
  }
  
  return { valid: true };
}
