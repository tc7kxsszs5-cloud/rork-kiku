/**
 * Система версионирования для проекта KIKU
 * 
 * Обеспечивает плавный переход между версиями данных без потери информации
 */

export const APP_DATA_VERSION = 1; // Текущая версия данных
export const API_VERSION = 1; // Текущая версия API
export const SCHEMA_VERSION = 1; // Текущая версия схем

export interface VersionInfo {
  appVersion: string; // Версия приложения из package.json
  dataVersion: number; // Версия данных
  apiVersion: number; // Версия API
  schemaVersion: number; // Версия схем
}

/**
 * Получить информацию о версиях
 */
export function getVersionInfo(): VersionInfo {
  try {
    const packageJson = require('../../package.json');
    return {
      appVersion: packageJson.version || '1.0.0',
      dataVersion: APP_DATA_VERSION,
      apiVersion: API_VERSION,
      schemaVersion: SCHEMA_VERSION,
    };
  } catch {
    return {
      appVersion: '1.0.0',
      dataVersion: APP_DATA_VERSION,
      apiVersion: API_VERSION,
      schemaVersion: SCHEMA_VERSION,
    };
  }
}

/**
 * Версионированные данные
 */
export interface VersionedData<T = any> {
  version: number;
  data: T;
  migratedAt?: number;
  migratedFrom?: number;
}

/**
 * Создать версионированные данные
 */
export function createVersionedData<T>(data: T, version: number = APP_DATA_VERSION): VersionedData<T> {
  return {
    version,
    data,
    migratedAt: Date.now(),
  };
}

/**
 * Проверить нужно ли мигрировать данные
 */
export function needsMigration(currentVersion: number, targetVersion: number = APP_DATA_VERSION): boolean {
  return currentVersion < targetVersion;
}

/**
 * Получить версию из хранилища
 */
export async function getStoredVersion(storageKey: string): Promise<number> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const version = await AsyncStorage.getItem(`${storageKey}_version`);
    return version ? parseInt(version, 10) : 1; // По умолчанию версия 1
  } catch {
    return 1;
  }
}

/**
 * Сохранить версию в хранилище
 */
export async function saveStoredVersion(storageKey: string, version: number): Promise<void> {
  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(`${storageKey}_version`, String(version));
  } catch (error) {
    console.error(`[versioning] Failed to save version for ${storageKey}:`, error);
  }
}
