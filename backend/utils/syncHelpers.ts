// Helper functions for sync operations

export function getDeltaChats<T extends { updatedAt?: number; timestamp?: number }>(
  items: T[],
  lastSyncTimestamp: number
): T[] {
  return items.filter((item) => {
    const itemTimestamp = item.updatedAt || item.timestamp || 0;
    return itemTimestamp > lastSyncTimestamp;
  });
}

export function getDeltaAlerts<T extends { createdAt?: number; timestamp?: number }>(
  items: T[],
  lastSyncTimestamp: number
): T[] {
  return items.filter((item) => {
    const itemTimestamp = item.createdAt || item.timestamp || 0;
    return itemTimestamp > lastSyncTimestamp;
  });
}
