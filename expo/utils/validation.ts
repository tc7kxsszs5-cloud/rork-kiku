/**
 * Утилиты для валидации данных
 * 
 * Чистые детерминированные функции для проверки формата данных.
 */

/**
 * Проверяет, является ли значение валидным UUID (версия 1-5)
 * 
 * @param value - Значение для проверки
 * @returns true если значение - валидный UUID
 */
export function isUuid(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }
  // UUID v1-v5 формат: xxxxxxxx-xxxx-1-5xxx-8-9abxxx-xxxxxxxxxxxx
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
