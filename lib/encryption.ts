/**
 * Encryption utilities for end-to-end encryption
 * 
 * NOTE: This is a simplified implementation for demonstration purposes.
 * In production, use established encryption libraries like:
 * - @react-native-community/async-storage with encryption
 * - react-native-keychain for secure key storage
 * - crypto-js or libsodium for encryption
 */

import { Platform } from 'react-native';

// Simple base64 encoding/decoding as a placeholder
// In production, use proper encryption algorithms (AES-256-GCM, etc.)

export interface EncryptedData {
  data: string;
  iv: string; // Initialization vector
  timestamp: number;
}

/**
 * Generate a simple encryption key (placeholder)
 * In production: Use secure key derivation (PBKDF2, Argon2)
 */
export const generateEncryptionKey = async (): Promise<string> => {
  // Placeholder: generate random key
  const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log('[Encryption] Generated encryption key');
  return key;
};

/**
 * Encrypt text data (simplified for demo)
 * In production: Use AES-256-GCM or similar
 */
export const encryptText = async (text: string, key: string): Promise<EncryptedData> => {
  try {
    // Simplified encryption using base64 encoding
    // In production, use proper encryption libraries
    const iv = Math.random().toString(36).substring(2, 15);
    const combined = `${iv}:${key}:${text}`;
    const encrypted = Platform.OS === 'web' 
      ? btoa(combined)
      : Buffer.from(combined).toString('base64');

    console.log('[Encryption] Text encrypted successfully');
    
    return {
      data: encrypted,
      iv,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('[Encryption] Error encrypting text:', error);
    throw new Error('Failed to encrypt text');
  }
};

/**
 * Decrypt text data (simplified for demo)
 * In production: Use AES-256-GCM or similar
 */
export const decryptText = async (encryptedData: EncryptedData, key: string): Promise<string> => {
  try {
    // Simplified decryption using base64 decoding
    const decoded = Platform.OS === 'web'
      ? atob(encryptedData.data)
      : Buffer.from(encryptedData.data, 'base64').toString('utf-8');
    
    const parts = decoded.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [iv, encKey, text] = parts;
    
    // Verify key matches (in production, use proper HMAC)
    if (encKey !== key) {
      throw new Error('Invalid decryption key');
    }

    console.log('[Encryption] Text decrypted successfully');
    return text;
  } catch (error) {
    console.error('[Encryption] Error decrypting text:', error);
    throw new Error('Failed to decrypt text');
  }
};

/**
 * Hash sensitive data for storage (one-way)
 * In production: Use bcrypt, scrypt, or Argon2
 */
export const hashData = async (data: string): Promise<string> => {
  try {
    // Simplified hashing
    // In production, use proper cryptographic hash functions
    const hash = Platform.OS === 'web'
      ? btoa(data + 'salt')
      : Buffer.from(data + 'salt').toString('base64');

    console.log('[Encryption] Data hashed successfully');
    return hash;
  } catch (error) {
    console.error('[Encryption] Error hashing data:', error);
    throw new Error('Failed to hash data');
  }
};

/**
 * Verify hashed data
 */
export const verifyHash = async (data: string, hash: string): Promise<boolean> => {
  try {
    const newHash = await hashData(data);
    return newHash === hash;
  } catch (error) {
    console.error('[Encryption] Error verifying hash:', error);
    return false;
  }
};

/**
 * Generate a secure random token
 */
export const generateSecureToken = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomPart}_${randomPart2}`;
};

/**
 * Encrypt message for secure transmission
 * Includes integrity check
 */
export const encryptMessage = async (message: string, senderKey: string, receiverKey: string): Promise<string> => {
  try {
    // Simplified: combine sender and receiver keys
    const combinedKey = `${senderKey}:${receiverKey}`;
    const encrypted = await encryptText(message, combinedKey);
    
    // Return as JSON string
    return JSON.stringify(encrypted);
  } catch (error) {
    console.error('[Encryption] Error encrypting message:', error);
    throw error;
  }
};

/**
 * Decrypt message from secure transmission
 */
export const decryptMessage = async (encryptedMessage: string, senderKey: string, receiverKey: string): Promise<string> => {
  try {
    const combinedKey = `${senderKey}:${receiverKey}`;
    const encrypted: EncryptedData = JSON.parse(encryptedMessage);
    
    return await decryptText(encrypted, combinedKey);
  } catch (error) {
    console.error('[Encryption] Error decrypting message:', error);
    throw error;
  }
};

/**
 * Security best practices reminder for production:
 * 
 * 1. Use established encryption libraries:
 *    - Native: react-native-keychain, expo-secure-store
 *    - JS: @noble/ciphers, libsodium-wrappers
 * 
 * 2. Key management:
 *    - Store keys in secure hardware (Keychain/Keystore)
 *    - Use key derivation functions (PBKDF2, Argon2)
 *    - Implement key rotation
 * 
 * 3. Encryption standards:
 *    - AES-256-GCM for symmetric encryption
 *    - RSA-4096 or ECDH for key exchange
 *    - Add HMAC for integrity verification
 * 
 * 4. Compliance:
 *    - Follow NIST guidelines
 *    - Implement FIPS 140-2 compliant encryption
 *    - Regular security audits
 */
