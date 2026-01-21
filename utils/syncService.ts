/**
 * Sync Service for chats, alerts, and settings
 * Handles synchronization between local storage and backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Alert, ParentalSettings } from '@/constants/types';
import { trpcVanillaClient } from '@/lib/trpc';

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

      const result = await trpcVanillaClient.sync.chats.sync.mutate({
        deviceId,
        chats,
        lastSyncTimestamp: lastSync || 0,
      });

      if (result.success && result.chats) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.chats };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      console.error('[ChatSyncService] syncChats failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getChats(): Promise<SyncResult<Chat[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await trpcVanillaClient.sync.chats.get.query({
        deviceId,
        lastSyncTimestamp: lastSync || 0,
      });

      if (result && result.chats) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.chats };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      console.error('[ChatSyncService] getChats failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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

      const result = await trpcVanillaClient.sync.alerts.sync.mutate({
        deviceId,
        alerts,
        lastSyncTimestamp: lastSync || 0,
      });

      if (result.success && result.alerts) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.alerts };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      console.error('[AlertSyncService] syncAlerts failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAlerts(): Promise<SyncResult<Alert[]>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();
      const lastSync = await getLastSyncTimestamp(this.lastSyncKey);

      const result = await trpcVanillaClient.sync.alerts.get.query({
        deviceId,
        lastSyncTimestamp: lastSync || 0,
      });

      if (result && result.alerts) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.alerts };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      console.error('[AlertSyncService] getAlerts failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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

      const result = await trpcVanillaClient.sync.settings.sync.mutate({
        deviceId,
        settings,
        lastSyncTimestamp: lastSync || 0,
      });

      if (result.success && result.settings) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.settings };
      }

      return { success: false, error: 'Sync failed' };
    } catch (error) {
      console.error('[SettingsSyncService] syncSettings failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getSettings(): Promise<SyncResult<ParentalSettings>> {
    try {
      await this.initialize();
      const deviceId = await getDeviceId();

      const result = await trpcVanillaClient.sync.settings.get.query({
        deviceId,
      });

      if (result && result.settings) {
        await setLastSyncTimestamp(this.lastSyncKey, Date.now());
        return { success: true, data: result.settings };
      }

      return { success: false, error: 'Get failed' };
    } catch (error) {
      console.error('[SettingsSyncService] getSettings failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instances
export const chatSyncService = new ChatSyncService();
export const alertSyncService = new AlertSyncService();
export const settingsSyncService = new SettingsSyncService();
