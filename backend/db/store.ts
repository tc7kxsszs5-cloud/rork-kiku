/**
 * Database Store Interface
 * 
 * Абстракция для хранилища данных
 * Реализации: InMemoryStore (development), SQLiteStore (development), PostgreSQLStore (production)
 */

export interface ChatRecord {
  id: string;
  deviceId: string;
  chats: any[];
  timestamp: number;
}

export interface AlertRecord {
  id: string;
  deviceId: string;
  alerts: any[];
  timestamp: number;
}

export interface SettingsRecord {
  id: string;
  deviceId: string;
  settings: any;
  timestamp: number;
}

export interface SyncStore {
  // Chats
  getChats(deviceId: string): Promise<ChatRecord | null>;
  saveChats(deviceId: string, chats: any[], timestamp: number): Promise<void>;
  
  // Alerts
  getAlerts(deviceId: string): Promise<AlertRecord | null>;
  saveAlerts(deviceId: string, alerts: any[], timestamp: number): Promise<void>;
  
  // Settings
  getSettings(deviceId: string): Promise<SettingsRecord | null>;
  saveSettings(deviceId: string, settings: any, timestamp: number): Promise<void>;
  
  // Last sync timestamp
  getLastSync(deviceId: string): Promise<number>;
  setLastSync(deviceId: string, timestamp: number): Promise<void>;
  
  // Cleanup (для оптимизации)
  cleanupOldRecords?(olderThanDays: number): Promise<void>;
}

/**
 * In-Memory реализация (для development)
 */
export class InMemoryStore implements SyncStore {
  private chatsStore = new Map<string, { chats: any[]; timestamp: number }>();
  private alertsStore = new Map<string, { alerts: any[]; timestamp: number }>();
  private settingsStore = new Map<string, { settings: any; timestamp: number }>();
  private lastSyncStore = new Map<string, number>();

  async getChats(deviceId: string): Promise<ChatRecord | null> {
    const stored = this.chatsStore.get(deviceId);
    if (!stored) return null;
    return { id: deviceId, deviceId, chats: stored.chats, timestamp: stored.timestamp };
  }

  async saveChats(deviceId: string, chats: any[], timestamp: number): Promise<void> {
    this.chatsStore.set(deviceId, { chats, timestamp });
  }

  async getAlerts(deviceId: string): Promise<AlertRecord | null> {
    const stored = this.alertsStore.get(deviceId);
    if (!stored) return null;
    return { id: deviceId, deviceId, alerts: stored.alerts, timestamp: stored.timestamp };
  }

  async saveAlerts(deviceId: string, alerts: any[], timestamp: number): Promise<void> {
    this.alertsStore.set(deviceId, { alerts, timestamp });
  }

  async getSettings(deviceId: string): Promise<SettingsRecord | null> {
    const stored = this.settingsStore.get(deviceId);
    if (!stored) return null;
    return { id: deviceId, deviceId, settings: stored.settings, timestamp: stored.timestamp };
  }

  async saveSettings(deviceId: string, settings: any, timestamp: number): Promise<void> {
    this.settingsStore.set(deviceId, { settings, timestamp });
  }

  async getLastSync(deviceId: string): Promise<number> {
    return this.lastSyncStore.get(deviceId) || 0;
  }

  async setLastSync(deviceId: string, timestamp: number): Promise<void> {
    this.lastSyncStore.set(deviceId, timestamp);
  }
}

/**
 * Экспорт текущего store (можно переключить на PostgreSQL в production)
 */
let currentStore: SyncStore = new InMemoryStore();

export const getStore = (): SyncStore => currentStore;

export const setStore = (store: SyncStore): void => {
  currentStore = store;
};

// Для будущей интеграции PostgreSQL:
// export class PostgreSQLStore implements SyncStore { ... }
// setStore(new PostgreSQLStore(connectionString));


