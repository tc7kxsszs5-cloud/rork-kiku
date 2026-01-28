/**
 * Тесты для системы версионирования
 * AsyncStorage мокается в jest.setup.js (default + named exports).
 * Мок настроен так, чтобы работать и для статического, и для динамического импорта.
 */

import {
  getVersionInfo,
  createVersionedData,
  needsMigration,
  getStoredVersion,
  saveStoredVersion,
} from '@/utils/versioning';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('versioning', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем моки перед каждым тестом
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  describe('getVersionInfo', () => {
    it('должен вернуть информацию о версиях', () => {
      const versionInfo = getVersionInfo();

      expect(versionInfo).toHaveProperty('appVersion');
      expect(versionInfo).toHaveProperty('dataVersion');
      expect(versionInfo).toHaveProperty('apiVersion');
      expect(versionInfo).toHaveProperty('schemaVersion');
      expect(typeof versionInfo.appVersion).toBe('string');
      expect(typeof versionInfo.dataVersion).toBe('number');
      expect(typeof versionInfo.apiVersion).toBe('number');
      expect(typeof versionInfo.schemaVersion).toBe('number');
    });
  });

  describe('createVersionedData', () => {
    it('должен создать версионированные данные', () => {
      const data = { test: 'data' };
      const versioned = createVersionedData(data, 2);

      expect(versioned.version).toBe(2);
      expect(versioned.data).toBe(data);
      expect(versioned.migratedAt).toBeDefined();
    });

    it('должен использовать дефолтную версию если не указана', () => {
      const data = { test: 'data' };
      const versioned = createVersionedData(data);

      expect(versioned.version).toBeDefined();
      expect(typeof versioned.version).toBe('number');
    });
  });

  describe('needsMigration', () => {
    it('должен вернуть true если версия меньше целевой', () => {
      expect(needsMigration(1, 2)).toBe(true);
      expect(needsMigration(1, 3)).toBe(true);
    });

    it('должен вернуть false если версия равна целевой', () => {
      expect(needsMigration(2, 2)).toBe(false);
    });

    it('должен вернуть false если версия больше целевой', () => {
      expect(needsMigration(3, 2)).toBe(false);
    });

    it('должен использовать дефолтную целевую версию', () => {
      const result = needsMigration(1);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getStoredVersion', () => {
    it('должен получить версию из хранилища', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');

      const version = await getStoredVersion('@test_key');

      expect(version).toBe(2);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@test_key_version');
    });

    it('должен вернуть 1 если версия не найдена', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const version = await getStoredVersion('@test_key');

      expect(version).toBe(1);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@test_key_version');
    });

    it('должен вернуть 1 при ошибке', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const version = await getStoredVersion('@test_key');

      expect(version).toBe(1);
    });
  });

  describe('saveStoredVersion', () => {
    it('должен сохранить версию в хранилище', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await saveStoredVersion('@test_key', 2);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@test_key_version', '2');
    });

    it('должен обработать ошибку при сохранении', async () => {
      // Подавляем вывод ошибки в консоль для этого теста
      const originalError = console.error;
      const errorSpy = jest.fn();
      console.error = errorSpy;

      try {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

        // Функция не должна выбросить ошибку, должна обработать её внутри
        let errorThrown = false;
        try {
          await saveStoredVersion('@test_key', 2);
        } catch (error) {
          errorThrown = true;
        }

        expect(errorThrown).toBe(false);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('@test_key_version', '2');
        // Проверяем, что ошибка была залогирована
        expect(errorSpy).toHaveBeenCalled();
      } finally {
        // Восстанавливаем console.error
        console.error = originalError;
      }
    });
  });
});
