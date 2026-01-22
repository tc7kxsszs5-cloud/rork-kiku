import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../create-context";
import { getDeltaAlerts } from "../../../utils/syncHelpers";

const alertsStore = new Map<string, { alerts: any[]; timestamp: number }>();
const lastSyncStore = new Map<string, number>();

const mergeAlerts = (serverAlerts: any[], clientAlerts: any[]): any[] => {
  const alertMap = new Map<string, any>();

  // Добавляем серверные алерты
  serverAlerts.forEach((alert) => {
    alertMap.set(alert.id, alert);
  });

  // Объединяем с клиентскими
  clientAlerts.forEach((alert) => {
    const existing = alertMap.get(alert.id);
    if (!existing || (alert.timestamp && existing.timestamp && alert.timestamp > existing.timestamp)) {
      alertMap.set(alert.id, alert);
    }
  });

  return Array.from(alertMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

export const syncAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      alerts: z.array(z.any()).optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, alerts, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    const stored = alertsStore.get(deviceId);
    const serverAlerts = stored?.alerts || [];

    if (alerts && alerts.length > 0) {
      const mergedAlerts = mergeAlerts(serverAlerts, alerts);
      alertsStore.set(deviceId, {
        alerts: mergedAlerts,
        timestamp,
      });
    }

    lastSyncStore.set(deviceId, timestamp);

    if (lastSyncTimestamp > 0) {
      const storedData = alertsStore.get(deviceId);
      const allAlerts = storedData?.alerts || [];
      const deltaAlerts = getDeltaAlerts(allAlerts, lastSyncTimestamp);
      return {
        success: true,
        alerts: deltaAlerts,
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
        isDelta: true,
        count: deltaAlerts.length,
      };
    }

    const storedData = alertsStore.get(deviceId);
    return {
      success: true,
      alerts: storedData?.alerts || [],
      lastSyncTimestamp: timestamp,
      serverTimestamp: timestamp,
      isDelta: false,
      count: storedData?.alerts?.length || 0,
    };
  });

export const getAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .query(({ input }) => {
    const { deviceId, lastSyncTimestamp = 0 } = input;
    const storedData = alertsStore.get(deviceId);
    const allAlerts = storedData?.alerts || [];
    const lastSync = lastSyncStore.get(deviceId) || 0;

    if (lastSyncTimestamp > 0) {
      const deltaAlerts = getDeltaAlerts(allAlerts, lastSyncTimestamp);
      return {
        alerts: deltaAlerts,
        lastSyncTimestamp: lastSync,
        serverTimestamp: Date.now(),
        isDelta: true,
        count: deltaAlerts.length,
      };
    }

    return {
      alerts: allAlerts,
      lastSyncTimestamp: lastSync,
      serverTimestamp: Date.now(),
      isDelta: false,
      count: allAlerts.length,
    };
  });

export const syncAlertsRouter = createTRPCRouter({
  sync: syncAlertsProcedure,
  get: getAlertsProcedure,
});

