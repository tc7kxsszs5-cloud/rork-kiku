import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "@/backend/trpc/create-context";

// In-memory хранилище для алертов
const alertsStore = new Map<string, any[]>();

export const syncAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      userId: z.string().optional(),
      alerts: z.array(z.any()).optional(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, alerts } = input;
    const timestamp = Date.now();

    if (alerts) {
      // Объединяем алерты с существующими
      const existing = alertsStore.get(deviceId) || [];
      const merged = [...alerts, ...existing]
        .filter((alert, index, self) => 
          index === self.findIndex((a) => a.id === alert.id)
        )
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 1000); // Ограничиваем количество

      alertsStore.set(deviceId, merged);
    }

    const stored = alertsStore.get(deviceId) || [];

    return {
      success: true,
      alerts: stored,
      count: stored.length,
      serverTimestamp: timestamp,
    };
  });

export const getAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      userId: z.string().optional(),
      limit: z.number().optional().default(100),
    })
  )
  .query(({ input }) => {
    const { deviceId, limit } = input;
    const stored = alertsStore.get(deviceId) || [];

    return {
      alerts: stored.slice(0, limit),
      total: stored.length,
      serverTimestamp: Date.now(),
    };
  });

export const syncAlertsRouter = createTRPCRouter({
  sync: syncAlertsProcedure,
  get: getAlertsProcedure,
});

