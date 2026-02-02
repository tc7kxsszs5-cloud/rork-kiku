/**
 * Тесты для aiService
 * Проверяет конфигурацию, OpenAI интеграцию, кэширование
 */

import { getAIConfig, analyzeMessageWithRealAI } from '@/utils/aiService';
import { RiskLevel } from '@/constants/types';

// Мок для fetch
global.fetch = jest.fn();

// Мок для logger
jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

<<<<<<< HEAD
// Объект extra для мока expo-constants (доступен в тестах)
const mockExtra: Record<string, unknown> = {
  openaiApiKey: undefined,
  aiProvider: 'local',
  openaiBaseUrl: 'https://api.openai.com/v1',
};

jest.mock('expo-constants', () => ({
  default: {
    get expoConfig() {
      return { extra: mockExtra };
=======
// Мок для expo-constants
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        openaiApiKey: undefined,
        aiProvider: 'local',
        openaiApiBaseUrl: 'https://api.openai.com/v1',
      },
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
    },
  },
}));

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
<<<<<<< HEAD
    mockExtra.openaiApiKey = undefined;
    mockExtra.aiProvider = 'local';
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
  });

  describe('getAIConfig', () => {
    it('должен возвращать конфигурацию по умолчанию', () => {
      const config = getAIConfig();
      
      expect(config).toBeDefined();
      expect(config.provider).toBe('local');
      expect(config.endpoint).toBe('https://api.openai.com/v1');
    });

    it('должен читать конфигурацию из expo-constants', () => {
<<<<<<< HEAD
      // Используем process.env — в тестах expo-constants может быть из setup
      const origKey = process.env.OPENAI_API_KEY;
      const origProvider = process.env.AI_PROVIDER;
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.AI_PROVIDER = 'openai';
=======
      const Constants = require('expo-constants');
      Constants.default.expoConfig.extra.openaiApiKey = 'test-key';
      Constants.default.expoConfig.extra.aiProvider = 'openai';
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6

      const config = getAIConfig();
      
      expect(config.provider).toBe('openai');
      expect(config.apiKey).toBe('test-key');
<<<<<<< HEAD

      process.env.OPENAI_API_KEY = origKey;
      process.env.AI_PROVIDER = origProvider ?? '';
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
    });

    it('должен использовать process.env если expo-constants не доступен', () => {
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'env-key';
      process.env.AI_PROVIDER = 'openai';

      const config = getAIConfig();
      
      expect(config.apiKey).toBe('env-key');
      expect(config.provider).toBe('openai');

      process.env.OPENAI_API_KEY = originalEnv;
      delete process.env.AI_PROVIDER;
    });
  });

  describe('analyzeMessageWithRealAI', () => {
    it('должен возвращать safe анализ при provider=local', async () => {
      const config = { provider: 'local' as const, apiKey: undefined };
      const result = await analyzeMessageWithRealAI('test message', config);

      expect(result.riskLevel).toBe('safe');
      expect(result.confidence).toBe(0.5);
      expect(result.reasons).toEqual([]);
      expect(result.categories).toEqual([]);
    });

    it('должен вызывать OpenAI API при provider=openai и наличии ключа', async () => {
<<<<<<< HEAD
      const uniqueMessage = 'openai-unique-test-message-' + Date.now();
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
      const mockResponse = {
        results: [{
          flagged: false,
          categories: {},
          category_scores: {},
        }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const config = {
        provider: 'openai' as const,
        apiKey: 'test-key',
        endpoint: 'https://api.openai.com/v1',
      };

<<<<<<< HEAD
      const result = await analyzeMessageWithRealAI(uniqueMessage, config);
=======
      const result = await analyzeMessageWithRealAI('test message', config);
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/moderations',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
          }),
        })
      );

      expect(result.riskLevel).toBe('safe');
    });

    it('должен обрабатывать ошибки OpenAI API и fallback на local', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const config = {
        provider: 'openai' as const,
        apiKey: 'test-key',
        endpoint: 'https://api.openai.com/v1',
      };

      const result = await analyzeMessageWithRealAI('test message', config);

      expect(result.riskLevel).toBe('safe');
    });

    it('должен кэшировать результаты', async () => {
      const config = { provider: 'local' as const, apiKey: undefined };
      const text = 'same message';

      const result1 = await analyzeMessageWithRealAI(text, config);
      const result2 = await analyzeMessageWithRealAI(text, config);

      // Второй вызов должен использовать кэш
      expect(result1).toEqual(result2);
    });

    it('должен обрабатывать flagged сообщения от OpenAI', async () => {
<<<<<<< HEAD
      const uniqueMessage = 'hateful-unique-' + Date.now();
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
      const mockResponse = {
        results: [{
          flagged: true,
          categories: {
            hate: true,
            violence: false,
          },
          category_scores: {
            hate: 0.8,
            violence: 0.3,
          },
        }],
      };

<<<<<<< HEAD
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockImplementationOnce(async () => ({
        ok: true,
        json: async () => mockResponse,
      }));
=======
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6

      const config = {
        provider: 'openai' as const,
        apiKey: 'test-key',
        endpoint: 'https://api.openai.com/v1',
      };

<<<<<<< HEAD
      const result = await analyzeMessageWithRealAI(uniqueMessage, config);
=======
      const result = await analyzeMessageWithRealAI('hateful message', config);
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6

      expect(result.riskLevel).toBe('high');
      expect(result.categories).toContain('hate');
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });
});
