/**
 * Менеджер миграций данных
 * 
 * Управляет миграциями между версиями данных
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Migration, MigrationResult } from './types';

export class MigrationManager {
  private migrations: Migration[] = [];
  private backupEnabled: boolean = true;

  /**
   * Зарегистрировать миграцию
   */
  register(migration: Migration): void {
    // Проверяем что нет конфликтов
    const conflict = this.migrations.find(
      m => m.fromVersion === migration.fromVersion && m.toVersion === migration.toVersion
    );
    
    if (conflict) {
      console.warn(`[MigrationManager] Migration conflict: ${migration.name} conflicts with ${conflict.name}`);
    }
    
    this.migrations.push(migration);
    // Сортируем по версиям
    this.migrations.sort((a, b) => a.fromVersion - b.fromVersion);
  }

  /**
   * Выполнить миграцию данных
   */
  async migrate(
    data: any,
    fromVersion: number,
    toVersion: number
  ): Promise<MigrationResult> {
    if (fromVersion >= toVersion) {
      return {
        success: true,
        data,
        fromVersion,
        toVersion,
      };
    }

    let currentData = data;
    let currentVersion = fromVersion;

    try {
      // Сохраняем резервную копию перед миграцией
      if (this.backupEnabled) {
        await this.saveBackup(currentData, currentVersion);
      }

      // Выполняем миграции пошагово
      while (currentVersion < toVersion) {
        const nextVersion = currentVersion + 1;
        const migration = this.migrations.find(
          m => m.fromVersion === currentVersion && m.toVersion === nextVersion
        );

        if (!migration) {
          throw new Error(
            `No migration found from version ${currentVersion} to ${nextVersion}`
          );
        }

        console.log(`[MigrationManager] Migrating from ${currentVersion} to ${nextVersion}: ${migration.name}`);

        // Выполняем миграцию
        currentData = await migration.migrate(currentData);
        currentVersion = migration.toVersion;

        // Обновляем версию в данных
        if (currentData && typeof currentData === 'object') {
          currentData.version = currentVersion;
          currentData.migratedAt = Date.now();
          currentData.migratedFrom = migration.fromVersion;
        }
      }

      return {
        success: true,
        data: currentData,
        fromVersion,
        toVersion: currentVersion,
      };
    } catch (error) {
      console.error('[MigrationManager] Migration failed:', error);
      return {
        success: false,
        data: currentData,
        fromVersion,
        toVersion: currentVersion,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Откатить миграцию
   */
  async rollback(
    data: any,
    fromVersion: number,
    toVersion: number
  ): Promise<MigrationResult> {
    if (fromVersion <= toVersion) {
      return {
        success: true,
        data,
        fromVersion,
        toVersion,
      };
    }

    let currentData = data;
    let currentVersion = fromVersion;

    try {
      // Выполняем откат пошагово
      while (currentVersion > toVersion) {
        const prevVersion = currentVersion - 1;
        const migration = this.migrations.find(
          m => m.fromVersion === prevVersion && m.toVersion === currentVersion
        );

        if (!migration || !migration.rollback) {
          throw new Error(
            `No rollback found from version ${currentVersion} to ${prevVersion}`
          );
        }

        console.log(`[MigrationManager] Rolling back from ${currentVersion} to ${prevVersion}: ${migration.name}`);

        // Выполняем откат
        currentData = await migration.rollback(currentData);
        currentVersion = prevVersion;
      }

      return {
        success: true,
        data: currentData,
        fromVersion,
        toVersion: currentVersion,
      };
    } catch (error) {
      console.error('[MigrationManager] Rollback failed:', error);
      return {
        success: false,
        data: currentData,
        fromVersion,
        toVersion: currentVersion,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Сохранить резервную копию
   */
  private async saveBackup(data: any, version: number): Promise<void> {
    try {
      const backupKey = `@backup_v${version}_${Date.now()}`;
      await AsyncStorage.setItem(backupKey, JSON.stringify(data));
      
      // Ограничиваем количество резервных копий (последние 5)
      const keys = await AsyncStorage.getAllKeys();
      const backupKeys = keys.filter(k => k.startsWith('@backup_')).sort();
      if (backupKeys.length > 5) {
        const keysToRemove = backupKeys.slice(0, backupKeys.length - 5);
        await AsyncStorage.multiRemove(keysToRemove);
      }
    } catch (error) {
      console.error('[MigrationManager] Failed to save backup:', error);
    }
  }

  /**
   * Получить список зарегистрированных миграций
   */
  getMigrations(): Migration[] {
    return [...this.migrations];
  }

  /**
   * Включить/выключить резервные копии
   */
  setBackupEnabled(enabled: boolean): void {
    this.backupEnabled = enabled;
  }
}
