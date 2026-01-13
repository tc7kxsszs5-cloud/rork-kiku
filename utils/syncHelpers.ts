/**
 * Утилиты для синхронизации данных
 * 
 * Чистые детерминированные функции для incremental sync.
 * Используются в backend tRPC routes для синхронизации алертов и чатов.
 */

/**
 * Получает только измененные алерты после lastSyncTimestamp (incremental sync)
 * 
 * @param allAlerts - Все алерты
 * @param lastSyncTimestamp - Timestamp последней синхронизации
 * @returns Массив алертов, измененных после lastSyncTimestamp
 */
export function getDeltaAlerts(allAlerts: Array<{ timestamp?: number }>, lastSyncTimestamp: number): Array<{ timestamp?: number }> {
  return allAlerts.filter((alert) => (alert.timestamp || 0) > lastSyncTimestamp);
}

/**
 * Получает только измененные чаты после lastSyncTimestamp (incremental sync)
 * 
 * @param allChats - Все чаты
 * @param lastSyncTimestamp - Timestamp последней синхронизации
 * @returns Массив чатов, измененных после lastSyncTimestamp
 */
export function getDeltaChats(
  allChats: Array<{ updatedAt?: number; timestamp?: number }>,
  lastSyncTimestamp: number
): Array<{ updatedAt?: number; timestamp?: number }> {
  return allChats.filter((chat) => {
    // Возвращаем чат, если он был изменен после lastSyncTimestamp
    return (chat.updatedAt || chat.timestamp || 0) > lastSyncTimestamp;
  });
}
