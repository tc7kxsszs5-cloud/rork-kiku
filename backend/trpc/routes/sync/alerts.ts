import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context.js";
import { getDeltaAlerts } from "../../../utils/syncHelpers.js";
import { supabase } from "../../../utils/supabase.js";

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

// Получить алерты из базы данных
const getAlertsFromDB = async (deviceId: string): Promise<any[]> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getAlertsFromDB] Error:', error);
    return [];
  }

  return data || [];
};

// Сохранить алерты в базу данных
const saveAlertsToDB = async (deviceId: string, alerts: any[]): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const alertsToSave = alerts.map((alert) => ({
    id: alert.id,
    device_id: deviceId,
    chat_id: alert.chatId || alert.chat_id,
    message_id: alert.messageId || alert.message_id,
    alert_type: alert.alertType || alert.alert_type || '',
    severity: alert.severity || 'medium',
    title: alert.title || '',
    description: alert.description,
    risk_level: alert.riskLevel || alert.risk_level || 'medium',
    status: alert.status || 'active',
    created_at: alert.createdAt || alert.created_at || Date.now(),
    resolved_at: alert.resolvedAt || alert.resolved_at,
    metadata: alert.metadata || null,
  }));

  // Используем upsert для обновления существующих и создания новых
  const { error } = await supabase
    .from('alerts')
    .upsert(alertsToSave, { onConflict: 'id' });

  if (error) {
    console.error('[saveAlertsToDB] Error:', error);
    throw error;
  }
};

// Обновить статус синхронизации алертов
const updateAlertsSyncStatus = async (deviceId: string, timestamp: number): Promise<void> => {
  if (!supabase) {
    return;
  }

  await supabase
    .from('sync_status')
    .upsert({
      device_id: deviceId,
      last_alerts_sync: timestamp,
      updated_at: timestamp,
    }, { onConflict: 'device_id' });
};

export const syncAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      alerts: z.array(z.any()).optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { deviceId, alerts, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    try {
      // Получаем существующие алерты из базы данных
      const serverAlerts = await getAlertsFromDB(deviceId);

      if (alerts && alerts.length > 0) {
        // Merge логика - объединяем серверные и клиентские алерты
        const mergedAlerts = mergeAlerts(serverAlerts, alerts);
        
        // Сохраняем объединенные алерты в базу данных
        await saveAlertsToDB(deviceId, mergedAlerts);
      }

      // Обновляем статус синхронизации
      await updateAlertsSyncStatus(deviceId, timestamp);

      // Если запрошен incremental sync - возвращаем только изменения
      if (lastSyncTimestamp > 0) {
        const allAlerts = await getAlertsFromDB(deviceId);
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

      // Полная синхронизация - возвращаем все алерты
      const allAlerts = await getAlertsFromDB(deviceId);
      
      return {
        success: true,
        alerts: allAlerts,
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
        isDelta: false,
        count: allAlerts.length,
      };
    } catch (error) {
      console.error('[syncAlertsProcedure] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        alerts: [],
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
      };
    }
  });

export const getAlertsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .query(async ({ input }) => {
    const { deviceId, lastSyncTimestamp = 0 } = input;

    try {
      const allAlerts = await getAlertsFromDB(deviceId);
      
      // Получаем последний timestamp синхронизации
      let lastSync = 0;
      if (supabase) {
        const { data } = await supabase
          .from('sync_status')
          .select('last_alerts_sync')
          .eq('device_id', deviceId)
          .single();
        lastSync = data?.last_alerts_sync || 0;
      }

      // Incremental sync если запрошен
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

      // Полная синхронизация
      return {
        alerts: allAlerts,
        lastSyncTimestamp: lastSync,
        serverTimestamp: Date.now(),
        isDelta: false,
        count: allAlerts.length,
      };
    } catch (error) {
      console.error('[getAlertsProcedure] Error:', error);
      return {
        alerts: [],
        lastSyncTimestamp: 0,
        serverTimestamp: Date.now(),
        isDelta: false,
        count: 0,
      };
    }
  });

export const syncAlertsRouter = createTRPCRouter({
  sync: syncAlertsProcedure,
  get: getAlertsProcedure,
});
