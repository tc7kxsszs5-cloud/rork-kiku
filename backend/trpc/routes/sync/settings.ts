import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "@/backend/trpc/create-context";

const settingsStore = new Map<string, { settings: any; timestamp: number }>();
const lastSyncStore = new Map<string, number>();

// Merge настройки (клиентские перезаписывают серверные если новее)
const mergeSettings = (serverSettings: any, clientSettings: any): any => {
  if (!serverSettings) return clientSettings;
  if (!clientSettings) return serverSettings;

  // Если есть timestamp - используем более свежие
  if (serverSettings.updatedAt && clientSettings.updatedAt) {
    return clientSettings.updatedAt > serverSettings.updatedAt ? clientSettings : serverSettings;
  }

  // Иначе merge (клиентские имеют приоритет для конфликтов)
  return { ...serverSettings, ...clientSettings };
};

export const syncSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      settings: z.any().optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, settings, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    const stored = settingsStore.get(deviceId);
    const serverSettings = stored?.settings;

    if (settings) {
      const mergedSettings = mergeSettings(serverSettings, settings);
      settingsStore.set(deviceId, {
        settings: {
          ...mergedSettings,
          updatedAt: timestamp,
        },
        timestamp,
      });
    }

    lastSyncStore.set(deviceId, timestamp);

    const storedData = settingsStore.get(deviceId);
    return {
      success: true,
      settings: storedData?.settings || {},
      lastSyncTimestamp: timestamp,
      serverTimestamp: timestamp,
    };
  });

export const getSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .query(({ input }) => {
    const { deviceId } = input;
    const stored = settingsStore.get(deviceId);
    const lastSync = lastSyncStore.get(deviceId) || 0;

    return {
      settings: stored?.settings || {},
      lastSyncTimestamp: lastSync,
      serverTimestamp: Date.now(),
    };
  });

export const syncSettingsRouter = createTRPCRouter({
  sync: syncSettingsProcedure,
  get: getSettingsProcedure,
});

