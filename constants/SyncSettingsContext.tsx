import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type SyncFrequency = 'realtime' | '5min' | '15min' | '1hour';
export type SyncSource = 'local' | 'cloud';

export interface SyncSettings {
  autoSyncEnabled: boolean;
  frequency: SyncFrequency;
  source: SyncSource;
  lastSyncTimestamp?: number;
  lastSyncStatus?: 'success' | 'error' | 'pending';
}

const SYNC_SETTINGS_STORAGE_KEY = '@sync_settings';

const DEFAULT_SYNC_SETTINGS: SyncSettings = {
  autoSyncEnabled: true,
  frequency: 'realtime',
  source: 'cloud',
};

export const [SyncSettingsProvider, useSyncSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<SyncSettings>(DEFAULT_SYNC_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SYNC_SETTINGS_STORAGE_KEY);
        if (!isMounted) {
          return;
        }
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({ ...DEFAULT_SYNC_SETTINGS, ...parsedSettings });
        }
      } catch (error) {
        console.error('[SyncSettingsContext] Error loading settings:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (Platform.OS !== 'web') {
      loadSettings();
    } else {
      timer = setTimeout(loadSettings, 0);
    }

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const updateSettings = useCallback(async (updates: Partial<SyncSettings>) => {
    try {
      const updatedSettings = { ...settings, ...updates };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SYNC_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('[SyncSettingsContext] Settings updated:', updates);
    } catch (error) {
      console.error('[SyncSettingsContext] Error updating settings:', error);
    }
  }, [settings]);

  const triggerSync = useCallback(async () => {
    if (isSyncing) {
      return;
    }

    setIsSyncing(true);
    setSettings(prev => ({ ...prev, lastSyncStatus: 'pending' }));

    try {
      // Здесь будет логика синхронизации с backend
      // Пока что просто имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedSettings: SyncSettings = {
        ...settings,
        lastSyncTimestamp: Date.now(),
        lastSyncStatus: 'success',
      };
      setSettings(updatedSettings);
      await AsyncStorage.setItem(SYNC_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));

      console.log('[SyncSettingsContext] Sync completed successfully');
    } catch (error) {
      console.error('[SyncSettingsContext] Error during sync:', error);
      setSettings(prev => ({
        ...prev,
        lastSyncTimestamp: Date.now(),
        lastSyncStatus: 'error',
      }));
    } finally {
      setIsSyncing(false);
    }
  }, [settings, isSyncing]);

  return {
    settings,
    isLoading,
    isSyncing,
    updateSettings,
    triggerSync,
  };
});
