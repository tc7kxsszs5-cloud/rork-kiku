/**
 * Тесты для миграции Analytics v1 → v2
 */

import { analyticsV1ToV2 } from '@/utils/migrations/analytics/v1-to-v2';

describe('analyticsV1ToV2', () => {
  it('должен мигрировать события с версии 1 на версию 2', async () => {
    const v1Data = {
      version: 1,
      events: [
        { 
          event: 'message_sent', 
          timestamp: Date.now(),
          properties: { chatId: 'chat_1' },
        },
        { 
          event: 'session_started', 
          timestamp: Date.now() + 1000,
        },
      ],
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.version).toBe(2);
    expect(migrated.migratedAt).toBeDefined();
    expect(migrated.migratedFrom).toBe(1);
    expect(migrated.events).toHaveLength(2);
    
    // Проверяем что добавлены новые поля
    expect(migrated.events[0].sessionId).toBeDefined();
    expect(migrated.events[0].deviceId).toBeDefined();
    expect(migrated.events[0].metadata).toBeDefined();
    expect(migrated.events[0].metadata.migrated).toBe(true);
  });

  it('должен сохранить deviceId в корне данных', async () => {
    const v1Data = {
      version: 1,
      events: [
        { event: 'message_sent', timestamp: Date.now() },
      ],
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.deviceId).toBeDefined();
    expect(migrated.deviceId).toMatch(/^device_/);
  });

  it('должен использовать существующий deviceId если есть', async () => {
    const existingDeviceId = 'device_existing_123';
    const v1Data = {
      version: 1,
      deviceId: existingDeviceId,
      events: [
        { event: 'message_sent', timestamp: Date.now() },
      ],
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.deviceId).toBe(existingDeviceId);
    expect(migrated.events[0].deviceId).toBe(existingDeviceId);
  });

  it('должен откатывать миграцию', async () => {
    const v2Data = {
      version: 2,
      deviceId: 'device_123',
      events: [
        { 
          event: 'message_sent', 
          timestamp: Date.now(),
          sessionId: 'session_123',
          deviceId: 'device_123',
          metadata: {
            migrated: true,
            migratedAt: Date.now(),
          },
        },
      ],
    };

    const rolledBack = await analyticsV1ToV2.rollback!(v2Data);

    expect(rolledBack.version).toBe(1);
    expect(rolledBack.events[0].sessionId).toBeUndefined();
    expect(rolledBack.events[0].deviceId).toBeUndefined();
    expect(rolledBack.events[0].metadata).toBeUndefined();
  });

  it('должен обработать пустой массив событий', async () => {
    const v1Data = {
      version: 1,
      events: [],
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.version).toBe(2);
    expect(migrated.events).toEqual([]);
  });

  it('должен обработать данные без событий', async () => {
    const v1Data = {
      version: 1,
    };

    const migrated = await analyticsV1ToV2.migrate(v1Data);

    expect(migrated.version).toBe(2);
  });
});
