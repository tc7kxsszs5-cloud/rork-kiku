/**
 * Тесты для errorHandler
 * Проверяет обработку ошибок, пользовательские сообщения, логирование
 */

import { Alert, Platform } from 'react-native';
import {
  showUserFriendlyError,
  handleErrorSilently,
  withErrorHandling,
  createErrorHandler,
  ErrorContext,
} from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import i18n from '@/constants/i18n';

// Моки
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('@/constants/i18n', () => ({
  __esModule: true,
  default: {
    t: jest.fn((key: string) => {
      const translations: Record<string, string> = {
        'common.error': 'Ошибка',
        'common.errors.networkError': 'Проблема с сетью',
        'common.errors.syncFailed': 'Синхронизация не удалась',
        'common.errors.loadFailed': 'Не удалось загрузить',
        'common.errors.saveFailed': 'Не удалось сохранить',
        'common.errors.permissionDenied': 'Доступ запрещен',
        'common.errors.storageError': 'Ошибка хранилища',
        'common.errors.analysisFailed': 'Анализ не удался',
        'common.errors.sosFailed': 'SOS не удалось отправить',
        'common.errors.authFailed': 'Ошибка аутентификации',
        'common.errors.default': 'Произошла ошибка',
      };
      return translations[key] || key;
    }),
  },
}));

describe('errorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Platform.OS as any) = 'ios';
  });

  describe('showUserFriendlyError', () => {
    it('должен показывать Alert с пользовательским сообщением на iOS', async () => {
      const error = new Error('Network error');
      
      await showUserFriendlyError(error, 'TestComponent');

      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Проблема с сетью');
      expect(logger.error).toHaveBeenCalledWith(
        'User-friendly error shown',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
    });

    it('должен использовать контекст для логирования', async () => {
      const error = new Error('Sync failed');
      const context: ErrorContext = {
        component: 'SyncComponent',
        action: 'syncData',
        userId: 'user-123',
      };

      await showUserFriendlyError(error, undefined, context);

      expect(logger.error).toHaveBeenCalledWith(
        'User-friendly error shown',
        error,
        expect.objectContaining({
          component: 'SyncComponent',
          action: 'syncData',
          userId: 'user-123',
        })
      );
    });

    it('должен использовать console.error на web платформе', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (Platform.OS as any) = 'web';
      
      const error = new Error('Network error');
      await showUserFriendlyError(error);

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('[Error]', 'Проблема с сетью', error);
      
      consoleSpy.mockRestore();
      (Platform.OS as any) = 'ios';
    });

    it('должен обрабатывать различные типы ошибок', async () => {
      const errors = [
        { error: new Error('Network error'), expected: 'Проблема с сетью' },
        { error: new Error('Sync failed'), expected: 'Синхронизация не удалась' },
        { error: new Error('Failed to load'), expected: 'Не удалось загрузить' },
        { error: new Error('Failed to save'), expected: 'Не удалось сохранить' },
        { error: new Error('Permission denied'), expected: 'Доступ запрещен' },
        { error: new Error('Storage error'), expected: 'Ошибка хранилища' },
        { error: new Error('Analysis failed'), expected: 'Анализ не удался' },
        { error: new Error('SOS failed'), expected: 'SOS не удалось отправить' },
        { error: new Error('Auth failed'), expected: 'Ошибка аутентификации' },
      ];

      for (const { error, expected } of errors) {
        jest.clearAllMocks();
        await showUserFriendlyError(error);
        expect(Alert.alert).toHaveBeenCalledWith('Ошибка', expected);
      }
    });

    it('должен использовать fallback сообщение для неизвестных ошибок', async () => {
      const error = new Error('Unknown error type');
      
      await showUserFriendlyError(error);

      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Unknown error type');
    });

    it('должен использовать default сообщение для технических ошибок', async () => {
      const error = new Error('Error: Something went wrong at file.ts:123:45');
      
      await showUserFriendlyError(error);

      expect(Alert.alert).toHaveBeenCalledWith('Ошибка', 'Произошла ошибка');
    });

    it('должен обрабатывать не-Error объекты', async () => {
      await showUserFriendlyError('String error');

      expect(logger.error).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('handleErrorSilently', () => {
    it('должен логировать ошибку без показа Alert', () => {
      const error = new Error('Test error');
      
      handleErrorSilently(error, 'TestComponent');

      expect(logger.error).toHaveBeenCalledWith(
        'Error handled silently',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('должен использовать контекст для логирования', () => {
      const error = new Error('Test error');
      const context: ErrorContext = {
        component: 'TestComponent',
        action: 'testAction',
        data: { key: 'value' },
      };

      handleErrorSilently(error, undefined, context);

      expect(logger.error).toHaveBeenCalledWith(
        'Error handled silently',
        error,
        expect.objectContaining({
          component: 'TestComponent',
          action: 'testAction',
          data: { key: 'value' },
        })
      );
    });

    it('должен обрабатывать не-Error объекты', () => {
      handleErrorSilently('String error', 'TestComponent');

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('withErrorHandling', () => {
    it('должен оборачивать функцию с обработкой ошибок', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrapped = withErrorHandling(fn, 'TestComponent');

      const result = await wrapped('arg1', 'arg2');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('должен обрабатывать ошибки в обернутой функции', async () => {
      const error = new Error('Test error');
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = withErrorHandling(fn, 'TestComponent');

      await expect(wrapped()).rejects.toThrow('Test error');
      expect(logger.error).toHaveBeenCalledWith(
        'Error handled silently',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
    });

    it('должен передавать аргументы правильно', async () => {
      const fn = jest.fn().mockImplementation((a: number, b: number) => Promise.resolve(a + b));
      const wrapped = withErrorHandling(fn, 'TestComponent');

      const result = await wrapped(2, 3);

      expect(result).toBe(5);
      expect(fn).toHaveBeenCalledWith(2, 3);
    });
  });

  describe('createErrorHandler', () => {
    it('должен создавать обработчик ошибок для компонента', () => {
      const handler = createErrorHandler('TestComponent');

      expect(handler).toHaveProperty('show');
      expect(handler).toHaveProperty('silent');
      expect(handler).toHaveProperty('wrap');
    });

    it('должен использовать show для показа ошибки', async () => {
      const handler = createErrorHandler('TestComponent');
      const error = new Error('Test error');

      await handler.show(error);

      expect(Alert.alert).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'User-friendly error shown',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
    });

    it('должен использовать silent для тихой обработки', () => {
      const handler = createErrorHandler('TestComponent');
      const error = new Error('Test error');

      handler.silent(error);

      expect(logger.error).toHaveBeenCalledWith(
        'Error handled silently',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('должен использовать wrap для обертывания функций', async () => {
      const handler = createErrorHandler('TestComponent');
      const fn = jest.fn().mockResolvedValue('success');
      const wrapped = handler.wrap(fn);

      const result = await wrapped('arg');

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg');
    });

    it('должен обрабатывать ошибки в обернутых функциях', async () => {
      const handler = createErrorHandler('TestComponent');
      const error = new Error('Test error');
      const fn = jest.fn().mockRejectedValue(error);
      const wrapped = handler.wrap(fn);

      await expect(wrapped()).rejects.toThrow('Test error');
      expect(logger.error).toHaveBeenCalledWith(
        'Error handled silently',
        error,
        expect.objectContaining({
          component: 'TestComponent',
        })
      );
    });
  });
});
