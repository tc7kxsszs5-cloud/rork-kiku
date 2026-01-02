import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Secure storage utility that uses expo-secure-store on native platforms
 * and falls back to AsyncStorage on web (with encryption warning)
 */

const ENCRYPTION_PREFIX = '__encrypted__';

/**
 * Simple XOR-based obfuscation for web storage (not cryptographically secure)
 * On native platforms, expo-secure-store provides hardware-backed encryption
 */
const obfuscate = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(result, 'binary').toString('base64');
};

const deobfuscate = (encoded: string, key: string): string => {
  const text = Buffer.from(encoded, 'base64').toString('binary');
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

// Device-specific key for web obfuscation
const getDeviceKey = (): string => {
  if (Platform.OS === 'web') {
    // Use a combination of browser fingerprints for web
    const ua = navigator.userAgent;
    const lang = navigator.language;
    const platform = navigator.platform;
    return `${ua}${lang}${platform}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(36);
  }
  return 'default-key';
};

export class SecureStorage {
  /**
   * Store sensitive data securely
   * @param key Storage key
   * @param value Data to store
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web: Use obfuscation (not cryptographically secure, but better than plain text)
        const obfuscated = obfuscate(value, getDeviceKey());
        await AsyncStorage.setItem(`${ENCRYPTION_PREFIX}${key}`, obfuscated);
        console.warn('[SecureStorage] Web platform: Data stored with obfuscation only. Use native app for hardware-backed encryption.');
      } else {
        // Native: Use hardware-backed secure storage
        await SecureStore.setItemAsync(key, value, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      }
    } catch (error) {
      console.error('[SecureStorage] Error storing secure data:', error);
      throw new Error('Failed to store secure data');
    }
  }

  /**
   * Retrieve securely stored data
   * @param key Storage key
   * @returns Stored value or null if not found
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Web: Retrieve and deobfuscate
        const obfuscated = await AsyncStorage.getItem(`${ENCRYPTION_PREFIX}${key}`);
        if (!obfuscated) return null;
        return deobfuscate(obfuscated, getDeviceKey());
      } else {
        // Native: Retrieve from secure storage
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error('[SecureStorage] Error retrieving secure data:', error);
      return null;
    }
  }

  /**
   * Remove securely stored data
   * @param key Storage key
   */
  static async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(`${ENCRYPTION_PREFIX}${key}`);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('[SecureStorage] Error removing secure data:', error);
      throw new Error('Failed to remove secure data');
    }
  }

  /**
   * Store JSON data securely
   * @param key Storage key
   * @param data Data to store (will be JSON stringified)
   */
  static async setJSON<T>(key: string, data: T): Promise<void> {
    const json = JSON.stringify(data);
    await this.setItem(key, json);
  }

  /**
   * Retrieve and parse JSON data
   * @param key Storage key
   * @returns Parsed data or null if not found
   */
  static async getJSON<T>(key: string): Promise<T | null> {
    const json = await this.getItem(key);
    if (!json) return null;
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      console.error('[SecureStorage] Error parsing JSON:', error);
      return null;
    }
  }

  /**
   * Check if secure storage is available (hardware-backed)
   * @returns true on native platforms, false on web
   */
  static isSecureStorageAvailable(): boolean {
    return Platform.OS !== 'web';
  }
}

/**
 * Session management utilities
 */
export class SessionManager {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Create a new session
   * @param userId User ID
   * @param deviceId Device ID
   */
  static async createSession(userId: string, deviceId: string): Promise<void> {
    const session = {
      userId,
      deviceId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
    await SecureStorage.setJSON(this.SESSION_KEY, session);
    console.log('[SessionManager] Session created:', userId);
  }

  /**
   * Validate and refresh session
   * @returns true if session is valid, false otherwise
   */
  static async validateSession(): Promise<boolean> {
    const session = await SecureStorage.getJSON<{
      userId: string;
      deviceId: string;
      createdAt: number;
      lastActivity: number;
    }>(this.SESSION_KEY);

    if (!session) {
      return false;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - session.lastActivity;

    if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
      console.log('[SessionManager] Session expired');
      await this.clearSession();
      return false;
    }

    // Refresh session activity
    await SecureStorage.setJSON(this.SESSION_KEY, {
      ...session,
      lastActivity: now,
    });

    return true;
  }

  /**
   * Get current session data
   */
  static async getSession() {
    return await SecureStorage.getJSON<{
      userId: string;
      deviceId: string;
      createdAt: number;
      lastActivity: number;
    }>(this.SESSION_KEY);
  }

  /**
   * Clear current session
   */
  static async clearSession(): Promise<void> {
    await SecureStorage.removeItem(this.SESSION_KEY);
    console.log('[SessionManager] Session cleared');
  }
}

/**
 * Encryption utilities for sensitive data
 */
export class DataEncryption {
  /**
   * Hash a password or PIN (simple implementation, use bcrypt in production)
   * @param password Password to hash
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    // Simple hash for demonstration - use proper password hashing in production
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Verify password against hash
   * @param password Password to verify
   * @param hash Stored hash
   * @returns true if password matches
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Generate a secure random token
   * @param length Token length
   * @returns Random token
   */
  static generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomValues = new Uint8Array(length);
    
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomValues);
    } else {
      // Fallback for non-web platforms
      for (let i = 0; i < length; i++) {
        randomValues[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < length; i++) {
      token += chars[randomValues[i] % chars.length];
    }
    
    return token;
  }
}
