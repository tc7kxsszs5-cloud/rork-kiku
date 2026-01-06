import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { createTRPCRouter } from "@/backend/trpc/create-context";

// In-memory хранилище для настроек
const settingsStore = new Map<string, any>();

export const syncSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      userId: z.string(),
      settings: z.any(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, userId, settings } = input;
    const timestamp = Date.now();

    const key = `${userId}_${deviceId}`;
    settingsStore.set(key, {
      ...settings,
      userId,
      deviceId,
      lastUpdated: timestamp,
    });

    return {
      success: true,
      settings: settingsStore.get(key),
      serverTimestamp: timestamp,
    };
  });

export const getSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      userId: z.string(),
    })
  )
  .query(({ input }) => {
    const { deviceId, userId } = input;
    const key = `${userId}_${deviceId}`;
    const stored = settingsStore.get(key);

    return {
      settings: stored || null,
      serverTimestamp: Date.now(),
    };
  });

export const syncSettingsRouter = createTRPCRouter({
  sync: syncSettingsProcedure,
  get: getSettingsProcedure,
});

