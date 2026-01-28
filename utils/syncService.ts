/**
 * Sync Service for chats, alerts, and settings
 * Handles synchronization between local storage and backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Alert, ParentalSettings } from '@/constants/types';
import { trpcVanillaClient } from '@/lib/trpc';
import { logger } from '@/utils/logger';

export interface SyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get or create device ID
 */
async function getDeviceId(): Promise<string> {
  const stored = await AsyncStorage.getItem('@device_id');
  if (stored) {
    return stored;
  }
  
  const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await AsyncStorage.setItem('@device_id', deviceId);
  return deviceId;
}

/**
 * Get last sync timestamp
 */
async function getLastSyncTimestamp(key: string): Promise<number | null> {
  const stored = await AsyncStorage.getItem(key);
  return stored ? parseInt(stored, 10) : null;
}

/**
 * Set last sync timestamp
 */
async function setLastSyncTimestamp(key: string, timestamp: number): Promise<void> {
  await AsyncStorage.setItem(key, timestamp.toString());
}

/**
 * Check if error is a timeout/network error
 */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('timeout') ||
      error.message.includes('Timeout') ||
      error.message.includes('network') ||
      error.message.includes('Network') ||
      error.message.includes('fetch failed') ||
      error.message.includes('Failed to fetch')
    );
  }
  return false;
}

/**
 * Check if error is retryable (network/timeout errors)
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Retry on timeout, network errors, and 5xx server errors
    return (
      isTimeoutError(error) ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504')
    );
  }
  return false;
}

/**
 * Retry function with exponential backoff
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  context?: { component: string; action: string; [key: string]: unknown }
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on last attempt or if error is not retryable
      if (attempt === maxRetries - 1 || !isRetryableError(error)) {
        throw error;
      }
      
      // Calculate exponential backoff delay
      const delay = initialDelay * Math.pow(2, attempt);
      
      logger.warn('Sync retry attempt', {
        component: context?.component || 'SyncService',
        action: context?.action || 'sync',
        attempt: attempt + 1,
        maxRetries,
        delay,
        error: error instanceof Error ? error.message : String(error),
        ...context,
      });
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Chat Sync Service
 */
class ChatSyncService {
  private readonly lastSyncKey = '@chats_last_sync';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
  }

  async syncChats(chats: Chat[]): Promise<SyncResult<Chat[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await withRetry(
        () => trpcVanillaClient.sync.chats.sync.mutate({
          deviceId,
          chats: chats as any,
          lastSyncTimestamp: lastSync || 0,
        }),
        3,
        1000,
        { component: 'ChatSyncService', action: 'syncChats', deviceId, chatsCount: chats.length }
      );

      if (result.success && result.chats) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Chats synced successfully', {
          component: 'ChatSyncService',
          action: 'syncChats',
          deviceId,
          chatsCount: result.chats.length,
        });
        return { success: true, data: result.chats as Chat[] };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Chat sync failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'ChatSyncService',
        action: 'syncChats',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Синхронизация прервана из-за таймаута. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }

  async getChats(): Promise<SyncResult<Chat[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await withRetry(
        () => trpcVanillaClient.sync.chats.get.query({
          deviceId,
          lastSyncTimestamp: lastSync || 0,
        }),
        3,
        1000,
        { component: 'ChatSyncService', action: 'getChats', deviceId }
      );

      if (result && result.chats) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Chats retrieved successfully', {
          component: 'ChatSyncService',
          action: 'getChats',
          deviceId,
          chatsCount: result.chats.length,
        });
        return { success: true, data: result.chats as Chat[] };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Get chats failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'ChatSyncService',
        action: 'getChats',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Не удалось загрузить чаты. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }
}

/**
 * Alert Sync Service
 */
class AlertSyncService {
  private readonly lastSyncKey = '@alerts_last_sync';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
  }

  async syncAlerts(alerts: Alert[]): Promise<SyncResult<Alert[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await withRetry(
        () => trpcVanillaClient.sync.alerts.sync.mutate({
          deviceId,
          alerts: alerts as any,
          lastSyncTimestamp: lastSync || 0,
        }),
        3,
        1000,
        { component: 'AlertSyncService', action: 'syncAlerts', deviceId, alertsCount: alerts.length }
      );

      if (result.success && result.alerts) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Alerts synced successfully', {
          component: 'AlertSyncService',
          action: 'syncAlerts',
          deviceId,
          alertsCount: result.alerts.length,
        });
        return { success: true, data: result.alerts as Alert[] };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Alert sync failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'AlertSyncService',
        action: 'syncAlerts',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Синхронизация предупреждений прервана из-за таймаута. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }

  async getAlerts(): Promise<SyncResult<Alert[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await withRetry(
        () => trpcVanillaClient.sync.alerts.get.query({
          deviceId,
          lastSyncTimestamp: lastSync || 0,
        }),
        3,
        1000,
        { component: 'AlertSyncService', action: 'getAlerts', deviceId }
      );

      if (result && result.alerts) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Alerts retrieved successfully', {
          component: 'AlertSyncService',
          action: 'getAlerts',
          deviceId,
          alertsCount: result.alerts.length,
        });
        return { success: true, data: result.alerts };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Get alerts failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'AlertSyncService',
        action: 'getAlerts',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Не удалось загрузить предупреждения. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }
}

/**
 * Settings Sync Service
 */
class SettingsSyncService {
  private readonly lastSyncKey = '@settings_last_sync';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
  }

  async syncSettings(settings: ParentalSettings): Promise<SyncResult<ParentalSettings>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await withRetry(
        () => trpcVanillaClient.sync.settings.sync.mutate({
          deviceId,
          settings,
          lastSyncTimestamp: lastSync || 0,
        }),
        3,
        1000,
        { component: 'SettingsSyncService', action: 'syncSettings', deviceId }
      );

      if (result.success && result.settings) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Settings synced successfully', {
          component: 'SettingsSyncService',
          action: 'syncSettings',
          deviceId,
        });
        return { success: true, data: result.settings };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Settings sync failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'SettingsSyncService',
        action: 'syncSettings',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Синхронизация настроек прервана из-за таймаута. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }

  async getSettings(): Promise<SyncResult<ParentalSettings>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();

      const result = await withRetry(
        () => trpcVanillaClient.sync.settings.get.query({
          deviceId,
        }),
        3,
        1000,
        { component: 'SettingsSyncService', action: 'getSettings', deviceId }
      );

      if (result && result.settings) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        logger.info('Settings retrieved successfully', {
          component: 'SettingsSyncService',
          action: 'getSettings',
          deviceId,
        });
        return { success: true, data: result.settings };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = isTimeoutError(error);
      
      logger.error('Get settings failed', error instanceof Error ? error : new Error(errorMessage), {
        component: 'SettingsSyncService',
        action: 'getSettings',
        isTimeout,
        errorMessage,
      });
      
      return {
        success: false,
        error: isTimeout 
          ? 'Не удалось загрузить настройки. Проверьте подключение к интернету.'
          : errorMessage,
      };
    }
  }
}

// Export singleton instances
export const chatSyncService = new ChatSyncService();
export const alertSyncService = new AlertSyncService();
export const settingsSyncService = new SettingsSyncService();
