// Types defined locally for backend
export interface NotificationDeviceRecord {
  deviceId: string;
  pushToken: string;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  userId?: string;
  permissions?: string;
  lastSyncedAt: number;
  lastTestedAt?: number;
  testResults: NotificationTestResult[];
}

export interface NotificationTestResult {
  id: string;
  type: 'permissions' | 'token' | 'delivery' | 'sync';
  status: 'passed' | 'failed';
  message: string;
  timestamp: number;
  deviceLabel?: string;
}

const MAX_TEST_RESULTS = 10;

const devices = new Map<string, NotificationDeviceRecord>();

interface UpsertPayload {
  deviceId: string;
  pushToken: string;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  userId?: string;
  permissions?: string;
}

export const upsertDeviceRecord = (payload: UpsertPayload): NotificationDeviceRecord => {
  const timestamp = Date.now();
  const existing = devices.get(payload.deviceId);

  const record: NotificationDeviceRecord = {
    deviceId: payload.deviceId,
    pushToken: payload.pushToken,
    platform: payload.platform,
    appVersion: payload.appVersion ?? existing?.appVersion,
    userId: payload.userId ?? existing?.userId,
    permissions: payload.permissions ?? existing?.permissions,
    lastSyncedAt: timestamp,
    lastTestedAt: existing?.lastTestedAt,
    testResults: existing?.testResults ?? [],
  };

  devices.set(payload.deviceId, record);
  return record;
};

export const listDeviceRecords = (): NotificationDeviceRecord[] => {
  return Array.from(devices.values()).sort((a, b) => b.lastSyncedAt - a.lastSyncedAt);
};

export const getDeviceRecord = (deviceId: string): NotificationDeviceRecord | undefined => {
  return devices.get(deviceId);
};

export const appendTestResults = (
  deviceId: string,
  results: NotificationTestResult[],
): NotificationDeviceRecord | undefined => {
  const existing = devices.get(deviceId);
  if (!existing) {
    return undefined;
  }

  const merged = [...results, ...existing.testResults].slice(0, MAX_TEST_RESULTS);
  const updated: NotificationDeviceRecord = {
    ...existing,
    lastTestedAt: results[0]?.timestamp ?? existing.lastTestedAt,
    testResults: merged,
  };

  devices.set(deviceId, updated);
  return updated;
};
