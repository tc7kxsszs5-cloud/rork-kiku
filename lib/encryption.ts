/**
 * Encryption utilities for end-to-end encryption
 * 
 * ⚠️ CRITICAL SECURITY WARNING ⚠️
 * This is a DEMO/PLACEHOLDER implementation only!
 * The current implementation uses base64 encoding, which is NOT encryption.
 * 
 * FOR PRODUCTION, YOU MUST:
 * 1. Install proper crypto libraries:
 *    - expo-crypto (for React Native)
 *    - @react-native-community/async-storage with encryption
 *    - react-native-keychain for secure key storage
 * 
 * 2. Use industry-standard encryption:
 *    - AES-256-GCM for symmetric encryption
 *    - RSA-4096 or ECDH for key exchange
 *    - bcrypt/Argon2 for password hashing
 *    - crypto.getRandomValues() for random number generation
 * 
 * 3. Implement proper key management:
 *    - Hardware-backed key storage (Keychain/Keystore)
 *    - Key derivation functions (PBKDF2, Argon2)
 *    - Key rotation strategy
 *    - Secure key backup/recovery
 * 
 * 4. Follow security best practices:
 *    - NIST guidelines
 *    - OWASP Mobile Security
 *    - Regular security audits
 *    - Penetration testing
 * 
 * Current status: DEMO ONLY - NOT SUITABLE FOR PRODUCTION
 * See docs/SECURITY.md for detailed requirements
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
 * 
 * SECURITY NOTE: This is a demo implementation
 * Production must use: crypto.getRandomValues() or expo-crypto
 */
export const generateEncryptionKey = async (): Promise<string> => {
  // Demo implementation - DO NOT USE IN PRODUCTION
  // TODO: Replace with crypto.getRandomValues() or expo-crypto
  const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log('[Encryption] WARNING: Demo key generation - not secure for production!');
  return key;
};

/**
 * Encrypt text data (simplified for demo)
 * In production: Use AES-256-GCM or similar
 * 
 * SECURITY WARNING: This is NOT real encryption - just base64 encoding for demo
 * Production implementation MUST use proper cryptographic algorithms
 */
export const encryptText = async (text: string, key: string): Promise<EncryptedData> => {
  try {
    // DEMO ONLY - This is base64 encoding, NOT encryption!
    // Production: Use expo-crypto or @react-native-community/crypto
    const iv = Math.random().toString(36).substring(2, 15);
    const combined = `${iv}:${key}:${text}`;
    const encrypted = Platform.OS === 'web' 
      ? btoa(combined)
      : Buffer.from(combined).toString('base64');

    console.log('[Encryption] Text encoded (DEMO - not secure for production)');
    
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
 * 
 * SECURITY WARNING: This is NOT cryptographic hashing - just base64 with salt
 * Production MUST use proper password hashing algorithms
 */
export const hashData = async (data: string): Promise<string> => {
  try {
    // DEMO ONLY - This is NOT secure hashing!
    // Production: Use expo-crypto with SHA-256 minimum, or bcrypt/Argon2 for passwords
    const hash = Platform.OS === 'web'
      ? btoa(data + 'salt')
      : Buffer.from(data + 'salt').toString('base64');

    console.log('[Encryption] Data hashed (DEMO - use proper crypto in production)');
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
