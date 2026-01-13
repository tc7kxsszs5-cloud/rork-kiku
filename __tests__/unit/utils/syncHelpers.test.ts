/**
 * Детерминированные модульные тесты для syncHelpers.ts
 * 
 * Только чистые функции:
 * - Нет интеграций
 * - Нет асинхронных операций
 * - Нет сложных моков
 * - Одинаковый вход = одинаковый выход
 */

import { getDeltaAlerts, getDeltaChats } from '@/utils/syncHelpers';

describe('syncHelpers - Детерминированные unit тесты', () => {
  describe('getDeltaAlerts', () => {
    it('должен вернуть пустой массив для пустого входного массива', () => {
      const result = getDeltaAlerts([], 1000);
      expect(result).toEqual([]);
    });

    it('должен вернуть пустой массив, если все алерты старше lastSyncTimestamp', () => {
      const alerts = [
        { id: '1', timestamp: 100 },
        { id: '2', timestamp: 200 },
        { id: '3', timestamp: 300 },
      ];
      const result = getDeltaAlerts(alerts, 1000);
      expect(result).toEqual([]);
    });

    it('должен вернуть все алерты, если все новее lastSyncTimestamp', () => {
      const alerts = [
        { id: '1', timestamp: 1100 },
        { id: '2', timestamp: 1200 },
        { id: '3', timestamp: 1300 },
      ];
      const result = getDeltaAlerts(alerts, 1000);
      expect(result).toEqual(alerts);
    });

    it('должен вернуть только алерты новее lastSyncTimestamp', () => {
      const alerts = [
        { id: '1', timestamp: 100 },
        { id: '2', timestamp: 1500 },
        { id: '3', timestamp: 200 },
        { id: '4', timestamp: 1600 },
      ];
      const result = getDeltaAlerts(alerts, 1000);
      expect(result).toEqual([
        { id: '2', timestamp: 1500 },
        { id: '4', timestamp: 1600 },
      ]);
    });

    it('должен обработать алерты без timestamp (fallback на 0)', () => {
      const alerts = [
        { id: '1' }, // нет timestamp
        { id: '2', timestamp: 1500 },
        { id: '3' }, // нет timestamp
      ];
      const result = getDeltaAlerts(alerts, 1000);
      // Алерты без timestamp не должны попасть (0 <= 1000)
      expect(result).toEqual([{ id: '2', timestamp: 1500 }]);
    });

    it('должен обработать граничное значение (равный timestamp)', () => {
      const alerts = [
        { id: '1', timestamp: 1000 },
        { id: '2', timestamp: 1001 },
        { id: '3', timestamp: 999 },
      ];
      const result = getDeltaAlerts(alerts, 1000);
      // Только строго больше (>), не >=
      expect(result).toEqual([{ id: '2', timestamp: 1001 }]);
    });

    it('должен быть детерминированным для одинаковых входных данных', () => {
      const alerts = [
        { id: '1', timestamp: 100 },
        { id: '2', timestamp: 1500 },
      ];
      const result1 = getDeltaAlerts(alerts, 1000);
      const result2 = getDeltaAlerts(alerts, 1000);
      expect(result1).toEqual(result2);
    });

    it('должен обработать отрицательные timestamp', () => {
      const alerts = [
        { id: '1', timestamp: -100 },
        { id: '2', timestamp: 100 },
      ];
      const result = getDeltaAlerts(alerts, 0);
      expect(result).toEqual([{ id: '2', timestamp: 100 }]);
    });

    it('должен обработать очень большие timestamp', () => {
      const largeTimestamp = Number.MAX_SAFE_INTEGER - 1000;
      const alerts = [
        { id: '1', timestamp: largeTimestamp },
        { id: '2', timestamp: largeTimestamp + 500 },
      ];
      const result = getDeltaAlerts(alerts, largeTimestamp);
      expect(result).toEqual([{ id: '2', timestamp: largeTimestamp + 500 }]);
    });
  });

  describe('getDeltaChats', () => {
    it('должен вернуть пустой массив для пустого входного массива', () => {
      const result = getDeltaChats([], 1000);
      expect(result).toEqual([]);
    });

    it('должен вернуть пустой массив, если все чаты старше lastSyncTimestamp (по updatedAt)', () => {
      const chats = [
        { id: '1', updatedAt: 100 },
        { id: '2', updatedAt: 200 },
        { id: '3', updatedAt: 300 },
      ];
      const result = getDeltaChats(chats, 1000);
      expect(result).toEqual([]);
    });

    it('должен вернуть пустой массив, если все чаты старше lastSyncTimestamp (по timestamp)', () => {
      const chats = [
        { id: '1', timestamp: 100 },
        { id: '2', timestamp: 200 },
        { id: '3', timestamp: 300 },
      ];
      const result = getDeltaChats(chats, 1000);
      expect(result).toEqual([]);
    });

    it('должен вернуть все чаты, если все новее lastSyncTimestamp', () => {
      const chats = [
        { id: '1', updatedAt: 1100 },
        { id: '2', updatedAt: 1200 },
        { id: '3', updatedAt: 1300 },
      ];
      const result = getDeltaChats(chats, 1000);
      expect(result).toEqual(chats);
    });

    it('должен использовать updatedAt когда доступен, иначе timestamp', () => {
      const chats = [
        { id: '1', updatedAt: 1500, timestamp: 100 }, // updatedAt используется (1500 > 1000)
        { id: '2', timestamp: 1600 }, // нет updatedAt, используется timestamp (1600 > 1000)
        { id: '3', updatedAt: 200 }, // updatedAt используется, но старый (200 <= 1000), не попадает
      ];
      const result = getDeltaChats(chats, 1000);
      // Должен использовать updatedAt когда есть, иначе timestamp
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ id: '1', updatedAt: 1500, timestamp: 100 });
      expect(result).toContainEqual({ id: '2', timestamp: 1600 });
    });

    it('должен использовать timestamp как fallback если нет updatedAt', () => {
      const chats = [
        { id: '1', timestamp: 1500 },
        { id: '2', timestamp: 200 },
        { id: '3', timestamp: 1600 },
      ];
      const result = getDeltaChats(chats, 1000);
      expect(result).toEqual([
        { id: '1', timestamp: 1500 },
        { id: '3', timestamp: 1600 },
      ]);
    });

    it('должен обработать чаты без updatedAt и timestamp (fallback на 0)', () => {
      const chats = [
        { id: '1' }, // нет полей
        { id: '2', updatedAt: 1500 },
        { id: '3' }, // нет полей
      ];
      const result = getDeltaChats(chats, 1000);
      // Чаты без полей не должны попасть (0 <= 1000)
      expect(result).toEqual([{ id: '2', updatedAt: 1500 }]);
    });

    it('должен обработать граничное значение (равный timestamp)', () => {
      const chats = [
        { id: '1', updatedAt: 1000 },
        { id: '2', updatedAt: 1001 },
        { id: '3', updatedAt: 999 },
      ];
      const result = getDeltaChats(chats, 1000);
      // Только строго больше (>), не >=
      expect(result).toEqual([{ id: '2', updatedAt: 1001 }]);
    });

    it('должен быть детерминированным для одинаковых входных данных', () => {
      const chats = [
        { id: '1', updatedAt: 100 },
        { id: '2', updatedAt: 1500 },
      ];
      const result1 = getDeltaChats(chats, 1000);
      const result2 = getDeltaChats(chats, 1000);
      expect(result1).toEqual(result2);
    });

    it('должен обработать смешанные случаи (updatedAt и timestamp)', () => {
      const chats = [
        { id: '1', updatedAt: 1500 }, // только updatedAt
        { id: '2', timestamp: 1600 }, // только timestamp
        { id: '3', updatedAt: 200, timestamp: 1700 }, // оба, но updatedAt приоритетнее
        { id: '4', updatedAt: 1800, timestamp: 100 }, // оба, updatedAt приоритетнее
      ];
      const result = getDeltaChats(chats, 1000);
      expect(result).toEqual([
        { id: '1', updatedAt: 1500 },
        { id: '2', timestamp: 1600 },
        { id: '4', updatedAt: 1800, timestamp: 100 },
      ]);
    });
  });
});
