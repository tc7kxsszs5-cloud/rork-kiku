import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context.js";
import { supabase } from "../../../utils/supabase.js";

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

// Получить настройки из базы данных
const getSettingsFromDB = async (deviceId: string): Promise<any | null> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Запись не найдена - это нормально для первого запуска
      return null;
    }
    console.error('[getSettingsFromDB] Error:', error);
    return null;
  }

  return data?.settings_data || null;
};

// Сохранить настройки в базу данных
const saveSettingsToDB = async (deviceId: string, settings: any): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const timestamp = Date.now();

  const { error } = await supabase
    .from('settings')
    .upsert({
      device_id: deviceId,
      settings_data: settings,
      updated_at: timestamp,
      created_at: timestamp,
    }, { onConflict: 'device_id' });

  if (error) {
    console.error('[saveSettingsToDB] Error:', error);
    throw error;
  }
};

// Обновить статус синхронизации настроек
const updateSettingsSyncStatus = async (deviceId: string, timestamp: number): Promise<void> => {
  if (!supabase) {
    return;
  }

  await supabase
    .from('sync_status')
    .upsert({
      device_id: deviceId,
      last_settings_sync: timestamp,
      updated_at: timestamp,
    }, { onConflict: 'device_id' });
};

export const syncSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      settings: z.any().optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(async ({ input }) => {
    const { deviceId, settings, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    try {
      // Получаем настройки с сервера
      const serverSettings = await getSettingsFromDB(deviceId);

      let finalSettings = serverSettings || {};

      // Если клиент отправил настройки - объединяем их
      if (settings) {
        finalSettings = mergeSettings(serverSettings, settings);
        finalSettings.updatedAt = timestamp;

        // Сохраняем объединенные настройки в БД
        await saveSettingsToDB(deviceId, finalSettings);
      }

      // Обновляем статус синхронизации
      await updateSettingsSyncStatus(deviceId, timestamp);

      return {
        success: true,
        settings: finalSettings,
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
      };
    } catch (error) {
      console.error('[syncSettingsProcedure] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        settings: {},
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
      };
    }
  });

export const getSettingsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const { deviceId } = input;
    const timestamp = Date.now();

    try {
      const settings = await getSettingsFromDB(deviceId);

      // Получаем статус синхронизации для lastSyncTimestamp
      let lastSync = 0;
      if (supabase) {
        const { data } = await supabase
          .from('sync_status')
          .select('last_settings_sync')
          .eq('device_id', deviceId)
          .single();

        if (data?.last_settings_sync) {
          lastSync = data.last_settings_sync;
        }
      }

      return {
        settings: settings || {},
        lastSyncTimestamp: lastSync,
        serverTimestamp: timestamp,
      };
    } catch (error) {
      console.error('[getSettingsProcedure] Error:', error);
      return {
        settings: {},
        lastSyncTimestamp: 0,
        serverTimestamp: timestamp,
      };
    }
  });

export const syncSettingsRouter = createTRPCRouter({
  sync: syncSettingsProcedure,
  get: getSettingsProcedure,
});

