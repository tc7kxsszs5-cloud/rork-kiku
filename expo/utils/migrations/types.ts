/**
 * Типы для системы миграций
 */

/**
 * Миграция данных между версиями
 */
export interface Migration {
  /** Версия от которой мигрируем */
  fromVersion: number;
  /** Версия к которой мигрируем */
  toVersion: number;
  /** Название миграции */
  name: string;
  /** Функция миграции */
  migrate: (data: any) => Promise<any> | any;
  /** Функция отката (опционально) */
  rollback?: (data: any) => Promise<any> | any;
  /** Описание миграции */
  description?: string;
}

/**
 * Результат миграции
 */
export interface MigrationResult {
  success: boolean;
  data: any;
  fromVersion: number;
  toVersion: number;
  error?: Error;
}
