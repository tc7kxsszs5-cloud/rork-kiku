/**
 * Миграция Analytics данных с версии 1 на версию 2
 * 
 * Добавляет:
 * - sessionId к событиям
 * - deviceId к событиям
 * - metadata к событиям
 */

import { Migration } from '../types';

export const analyticsV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add session and device tracking to analytics',
  description: 'Добавляет sessionId, deviceId и metadata к событиям аналитики',

  async migrate(data: any) {
    // Генерируем deviceId если его нет
    const generateDeviceId = () => {
      return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Генерируем sessionId если его нет
    const generateSessionId = () => {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Получаем или создаём deviceId
    let deviceId = data.deviceId;
    if (!deviceId) {
      deviceId = generateDeviceId();
      data.deviceId = deviceId;
    }

    // Мигрируем события
    if (data.events && Array.isArray(data.events)) {
      let currentSessionId: string | null = null;
      let lastSessionEndTime = 0;
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 минут

      data.events = data.events.map((event: any) => {
        // Определяем sessionId
        if (event.event === 'session_started') {
          // Новый сеанс
          currentSessionId = generateSessionId();
          lastSessionEndTime = event.timestamp;
        } else if (event.event === 'session_ended') {
          // Конец сеанса
          lastSessionEndTime = event.timestamp;
          currentSessionId = null;
        } else if (currentSessionId && event.timestamp - lastSessionEndTime < SESSION_TIMEOUT) {
          // Событие в текущем сеансе
          // currentSessionId уже установлен
        } else if (!currentSessionId && event.timestamp - lastSessionEndTime > SESSION_TIMEOUT) {
          // Новый сеанс (прошло больше 30 минут)
          currentSessionId = generateSessionId();
          lastSessionEndTime = event.timestamp;
        }

        // Добавляем новые поля
        const migratedEvent = {
          ...event,
          sessionId: event.sessionId || currentSessionId || generateSessionId(),
          deviceId: event.deviceId || deviceId,
          metadata: {
            ...event.metadata,
            migrated: true,
            migratedAt: Date.now(),
          },
        };

        return migratedEvent;
      });
    }

    // Обновляем версию
    data.version = 2;
    data.migratedAt = Date.now();
    data.migratedFrom = 1;

    return data;
  },

  async rollback(data: any) {
    // Откат миграции - удаляем новые поля
    if (data.events && Array.isArray(data.events)) {
      data.events = data.events.map((event: any) => {
        const { sessionId, deviceId, metadata, ...rest } = event;
        // Удаляем metadata.migrated если есть
        if (metadata && metadata.migrated) {
          const { migrated, migratedAt, ...restMetadata } = metadata;
          if (Object.keys(restMetadata).length > 0) {
            return { ...rest, metadata: restMetadata };
          }
        }
        return rest;
      });
    }

    // Удаляем deviceId из корня если был добавлен
    if (data.deviceId && data.deviceId.startsWith('device_')) {
      delete data.deviceId;
    }

    data.version = 1;
    return data;
  },
};
