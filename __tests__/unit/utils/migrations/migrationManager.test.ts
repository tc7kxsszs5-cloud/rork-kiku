/**
 * Тесты для MigrationManager
 */

import { MigrationManager } from '@/utils/migrations/migrationManager';
import { Migration } from '@/utils/migrations/types';

describe('MigrationManager', () => {
  let manager: MigrationManager;

  beforeEach(() => {
    manager = new MigrationManager();
  });

  describe('register', () => {
    it('должен зарегистрировать миграцию', () => {
      const migration: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: 'Test migration',
        async migrate(data) {
          return { ...data, version: 2 };
        },
      };

      manager.register(migration);

      const migrations = manager.getMigrations();
      expect(migrations).toHaveLength(1);
      expect(migrations[0]).toBe(migration);
    });

    it('должен отсортировать миграции по версиям', () => {
      const migration1: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: '1→2',
        async migrate(data) { return data; },
      };
      const migration2: Migration = {
        fromVersion: 2,
        toVersion: 3,
        name: '2→3',
        async migrate(data) { return data; },
      };
      const migration3: Migration = {
        fromVersion: 3,
        toVersion: 4,
        name: '3→4',
        async migrate(data) { return data; },
      };

      // Регистрируем в разном порядке
      manager.register(migration3);
      manager.register(migration1);
      manager.register(migration2);

      const migrations = manager.getMigrations();
      expect(migrations[0].fromVersion).toBe(1);
      expect(migrations[1].fromVersion).toBe(2);
      expect(migrations[2].fromVersion).toBe(3);
    });
  });

  describe('migrate', () => {
    it('должен выполнить миграцию с версии 1 на версию 2', async () => {
      const migration: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: 'Test migration',
        async migrate(data) {
          return { ...data, version: 2, migrated: true };
        },
      };

      manager.register(migration);

      const v1Data = { version: 1, data: 'test' };
      const result = await manager.migrate(v1Data, 1, 2);

      expect(result.success).toBe(true);
      expect(result.data.version).toBe(2);
      expect(result.data.migrated).toBe(true);
      expect(result.toVersion).toBe(2);
    });

    it('должен выполнить несколько миграций последовательно', async () => {
      const migration1: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: '1→2',
        async migrate(data) {
          return { ...data, version: 2, step1: true };
        },
      };
      const migration2: Migration = {
        fromVersion: 2,
        toVersion: 3,
        name: '2→3',
        async migrate(data) {
          return { ...data, version: 3, step2: true };
        },
      };

      manager.register(migration1);
      manager.register(migration2);

      const v1Data = { version: 1, data: 'test' };
      const result = await manager.migrate(v1Data, 1, 3);

      expect(result.success).toBe(true);
      expect(result.data.version).toBe(3);
      expect(result.data.step1).toBe(true);
      expect(result.data.step2).toBe(true);
      expect(result.toVersion).toBe(3);
    });

    it('должен вернуть успех если версия уже актуальна', async () => {
      const v2Data = { version: 2, data: 'test' };
      const result = await manager.migrate(v2Data, 2, 2);

      expect(result.success).toBe(true);
      expect(result.data).toBe(v2Data);
    });

    it('должен вернуть ошибку если миграция не найдена', async () => {
      const v1Data = { version: 1, data: 'test' };
      const result = await manager.migrate(v1Data, 1, 2);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('No migration found');
    });

    it('должен обработать ошибку в миграции', async () => {
      const migration: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: 'Failing migration',
        async migrate(data) {
          throw new Error('Migration failed');
        },
      };

      manager.register(migration);

      const v1Data = { version: 1, data: 'test' };
      const result = await manager.migrate(v1Data, 1, 2);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Migration failed');
    });
  });

  describe('rollback', () => {
    it('должен откатить миграцию', async () => {
      const migration: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: 'Test migration',
        async migrate(data) {
          return { ...data, version: 2, newField: 'value' };
        },
        async rollback(data) {
          const { newField, ...rest } = data;
          return { ...rest, version: 1 };
        },
      };

      manager.register(migration);

      const v2Data = { version: 2, newField: 'value', data: 'test' };
      const result = await manager.rollback(v2Data, 2, 1);

      expect(result.success).toBe(true);
      expect(result.data.version).toBe(1);
      expect(result.data.newField).toBeUndefined();
    });

    it('должен вернуть ошибку если rollback не определён', async () => {
      const migration: Migration = {
        fromVersion: 1,
        toVersion: 2,
        name: 'No rollback',
        async migrate(data) {
          return { ...data, version: 2 };
        },
      };

      manager.register(migration);

      const v2Data = { version: 2, data: 'test' };
      const result = await manager.rollback(v2Data, 2, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('No rollback found');
    });
  });
});
