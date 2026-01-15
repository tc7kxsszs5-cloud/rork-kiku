/**
 * Централизованный экспорт всех миграций
 * 
 * Регистрирует все миграции для использования в MigrationManager
 */

import { MigrationManager } from './migrationManager';
import { analyticsV1ToV2 } from './analytics/v1-to-v2';
import { messagesV1ToV2 } from './messages/v1-to-v2';
import { userV1ToV2 } from './user/v1-to-v2';

/**
 * Создать менеджер миграций с зарегистрированными миграциями
 */
export function createMigrationManager(): MigrationManager {
  const manager = new MigrationManager();

  // Регистрируем все миграции
  manager.register(analyticsV1ToV2);
  manager.register(messagesV1ToV2);
  manager.register(userV1ToV2);

  return manager;
}

/**
 * Глобальный менеджер миграций (singleton)
 */
let globalMigrationManager: MigrationManager | null = null;

/**
 * Получить глобальный менеджер миграций
 */
export function getMigrationManager(): MigrationManager {
  if (!globalMigrationManager) {
    globalMigrationManager = createMigrationManager();
  }
  return globalMigrationManager;
}

// Экспортируем типы
export * from './types';
export { MigrationManager } from './migrationManager';
