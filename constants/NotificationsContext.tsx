import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { NotificationDeviceRecord, NotificationTestResult } from './types';
import { useUser } from './UserContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DEVICE_ID_STORAGE_KEY = '@kids_device_id';
const PUSH_TOKEN_STORAGE_KEY = '@kids_push_token';

const createDeviceId = () => `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const isUuid = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false;
  }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
};

const resolveExpoProjectId = (): string | undefined => {
  const candidate =
    process.env.EXPO_PUBLIC_PROJECT_ID ??
    (Constants.expoConfig as any)?.extra?.eas?.projectId ??
    (Constants as any)?.easConfig?.projectId ??
    (Constants.expoConfig as any)?.extra?.projectId;

  return isUuid(candidate) ? candidate : undefined;
};

export type PushPermissionState = Notifications.PermissionStatus | 'unavailable' | 'undetermined';

export interface NotificationsContextValue {
  deviceId: string | null;
  permissionStatus: PushPermissionState;
  expoPushToken: string | null;
  isRegistering: boolean;
  isRunningDiagnostics: boolean;
  lastError: string | null;
  serverRecord: NotificationDeviceRecord | null;
  lastDiagnostics: NotificationTestResult[];
  registerDevice: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  runDiagnostics: () => Promise<NotificationTestResult[]>;
  isSupported: boolean;
  isSyncing: boolean;
}

export const [NotificationsProvider, useNotifications] = createContextHook<NotificationsContextValue>(() => {
  const userContext = useUser();
  const user = userContext?.user ?? null;
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PushPermissionState>(() => 'undetermined');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastDiagnostics, setLastDiagnostics] = useState<NotificationTestResult[]>([]);
  const autoSyncAttemptedRef = useRef(false);
  const isSupported = Platform.OS !== 'web';
  const deviceLabel = useMemo(() => Constants.deviceName ?? Platform.OS, []);

  const registerMutation = trpc.notifications.registerDevice.useMutation({
    onError: (error) => {
      console.error('[NotificationsContext] Register mutation error (ignored):', error);
    },
  });
  const logTestMutation = trpc.notifications.logDeviceTest.useMutation({
    onError: (error) => {
      console.error('[NotificationsContext] Log test mutation error (ignored):', error);
    },
  });
  const {
    data: syncData,
    refetch: refetchSyncStatus,
    isFetching: isSyncing,
    error: syncError,
  } = trpc.notifications.getSyncStatus.useQuery(deviceId ? { deviceId } : undefined, {
    enabled: Boolean(deviceId) && isSupported,
    staleTime: 15_000,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (syncError) {
      console.error('[NotificationsContext] Sync status query error (ignored):', syncError);
    }
  }, [syncError]);

  const serverRecord = syncData?.device ?? null;

  const ensureDeviceId = useCallback(async () => {
    if (deviceId) {
      return deviceId;
    }
    const stored = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (stored) {
      setDeviceId(stored);
      return stored;
    }
    const generated = createDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    setDeviceId(generated);
    return generated;
  }, [deviceId]);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        const storedId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
        let resolvedId = storedId;
        if (!storedId) {
          resolvedId = createDeviceId();
          await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, resolvedId);
        }
        if (isMounted && resolvedId) {
          setDeviceId(resolvedId);
        }

        const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
        if (isMounted && storedToken) {
          setExpoPushToken(storedToken);
        }

        if (!isSupported) {
          setPermissionStatus('unavailable');
          return;
        }

        const permissions = await Notifications.getPermissionsAsync();
        if (isMounted) {
          setPermissionStatus(permissions.status);
        }
      } catch (error) {
        console.error('[NotificationsContext] Bootstrap error', error);
        if (isMounted) {
          setLastError('Не удалось инициализировать уведомления');
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [isSupported]);

  const performRegistration = useCallback(
    async (requestPermissions: boolean) => {
      if (!isSupported) {
        setPermissionStatus('unavailable');
        setLastError(null);
        return;
      }

      const resolvedDeviceId = await ensureDeviceId();
      const projectId = resolveExpoProjectId();
      if (!projectId) {
        console.warn('[NotificationsContext] Push notifications disabled: missing Expo projectId');
        setLastError(null);
        return;
      }

      setIsRegistering(true);
      setLastError(null);

      try {
        let permissions = await Notifications.getPermissionsAsync();
        let status = permissions.status;
        if (status !== 'granted' && requestPermissions) {
          const permissionRequest = await Notifications.requestPermissionsAsync();
          status = permissionRequest.status;
        }
        setPermissionStatus(status);
        if (status !== 'granted') {
          setLastError(null);
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Стандартные уведомления',
            importance: Notifications.AndroidImportance.MAX,
            description: 'Системные уведомления KIDS',
          });
        }

        const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
        setExpoPushToken(tokenResponse.data);
        await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, tokenResponse.data);

        const platformValue: 'ios' | 'android' | 'web' = Platform.OS === 'ios'
          ? 'ios'
          : Platform.OS === 'android'
            ? 'android'
            : 'web';

        try {
          await registerMutation.mutateAsync({
            deviceId: resolvedDeviceId,
            pushToken: tokenResponse.data,
            platform: platformValue,
            appVersion: Constants.expoConfig?.version,
            userId: user?.id ?? undefined,
            permissions: status,
          });
        } catch (mutationError) {
          console.error('[NotificationsContext] Register mutation failed (ignored):', mutationError);
        }

        try {
          await refetchSyncStatus();
        } catch (refetchError) {
          console.error('[NotificationsContext] Refetch sync status failed (ignored):', refetchError);
        }
      } catch (error) {
        console.error('[NotificationsContext] Registration error (ignored)', error);
        setLastError(null);
      } finally {
        setIsRegistering(false);
      }
    },
    [ensureDeviceId, isSupported, refetchSyncStatus, registerMutation, user?.id],
  );

  useEffect(() => {
    if (!isSupported || !deviceId || permissionStatus !== 'granted' || autoSyncAttemptedRef.current) {
      return;
    }

    if (!resolveExpoProjectId()) {
      autoSyncAttemptedRef.current = true;
      console.warn('[NotificationsContext] Auto registration skipped: missing Expo projectId');
      return;
    }

    autoSyncAttemptedRef.current = true;
    performRegistration(false).catch((error) => {
      console.error('[NotificationsContext] Auto registration failed (ignored)', error);
    });
  }, [deviceId, isSupported, permissionStatus, performRegistration]);

  const refreshStatus = useCallback(async () => {
    if (!deviceId || !isSupported) {
      return;
    }
    try {
      await refetchSyncStatus();
    } catch (error) {
      console.error('[NotificationsContext] Refresh status failed (ignored):', error);
    }
  }, [deviceId, isSupported, refetchSyncStatus]);

  const registerDevice = useCallback(async () => {
    autoSyncAttemptedRef.current = true;
    await performRegistration(true);
  }, [performRegistration]);

  const runDiagnostics = useCallback(async () => {
    if (!deviceId) {
      throw new Error('Идентификатор устройства не готов');
    }

    setIsRunningDiagnostics(true);
    const now = Date.now();
    const tests: NotificationTestResult[] = [];

    tests.push({
      id: `perm_${now}`,
      type: 'permissions',
      status: permissionStatus === 'granted' ? 'passed' : 'failed',
      message:
        permissionStatus === 'granted'
          ? 'Разрешение на уведомления выдано'
          : 'Разрешение на уведомления отсутствует',
      timestamp: now,
      deviceLabel,
    });

    tests.push({
      id: `token_${now + 1}`,
      type: 'token',
      status: expoPushToken ? 'passed' : 'failed',
      message: expoPushToken ? 'Expo push токен получен' : 'Expo push токен отсутствует',
      timestamp: now + 1,
      deviceLabel,
    });

    tests.push({
      id: `sync_${now + 2}`,
      type: 'sync',
      status: serverRecord?.lastSyncedAt ? 'passed' : 'failed',
      message: serverRecord?.lastSyncedAt ? 'Сервер синхронизирован' : 'Нет данных синхронизации на сервере',
      timestamp: now + 2,
      deviceLabel,
    });

    if (!isSupported) {
      tests.push({
        id: `delivery_${now + 3}`,
        type: 'delivery',
        status: 'failed',
        message: 'Веб-платформа не поддерживает локальные уведомления',
        timestamp: now + 3,
        deviceLabel,
      });
    } else {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Тестовое уведомление KIDS',
            body: 'Проверка доставки уведомлений',
            data: { type: 'diagnostic' },
          },
          trigger: null,
        });
        tests.push({
          id: `delivery_${now + 3}`,
          type: 'delivery',
          status: 'passed',
          message: 'Локальное уведомление успешно запланировано',
          timestamp: now + 3,
          deviceLabel,
        });
      } catch (error) {
        console.error('[NotificationsContext] Delivery test failed', error);
        tests.push({
          id: `delivery_${now + 3}`,
          type: 'delivery',
          status: 'failed',
          message: 'Не удалось запланировать локальное уведомление',
          timestamp: now + 3,
          deviceLabel,
        });
      }
    }

    try {
      try {
        await logTestMutation.mutateAsync({
          deviceId,
          results: tests,
        });
      } catch (logError) {
        console.error('[NotificationsContext] Log test mutation failed (ignored):', logError);
      }
      setLastDiagnostics(tests);
      try {
        await refetchSyncStatus();
      } catch (refetchError) {
        console.error('[NotificationsContext] Refetch after diagnostics failed (ignored):', refetchError);
      }
      return tests;
    } finally {
      setIsRunningDiagnostics(false);
    }
  }, [deviceId, deviceLabel, expoPushToken, isSupported, logTestMutation, permissionStatus, refetchSyncStatus, serverRecord?.lastSyncedAt]);

  return useMemo(
    () => ({
      deviceId,
      permissionStatus,
      expoPushToken,
      isRegistering,
      isRunningDiagnostics,
      lastError,
      serverRecord,
      lastDiagnostics: serverRecord?.testResults ?? lastDiagnostics,
      registerDevice,
      refreshStatus,
      runDiagnostics,
      isSupported,
      isSyncing,
    }),
    [
      deviceId,
      expoPushToken,
      isRegistering,
      isRunningDiagnostics,
      lastDiagnostics,
      lastError,
      permissionStatus,
      registerDevice,
      refreshStatus,
      runDiagnostics,
      serverRecord,
      isSupported,
      isSyncing,
    ],
  );
});
