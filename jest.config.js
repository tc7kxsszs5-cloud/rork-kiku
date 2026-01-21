module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'constants/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'backend/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.expo/**',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Fork Tests Configuration
  // Используем 50% доступных CPU ядер для параллельного выполнения
  // Это создает отдельные процессы (workers) для каждого теста
  maxWorkers: process.env.CI ? 2 : '50%',
  
  // Timeout для тестов (в миллисекундах)
  testTimeout: 10000,
  
  // Для отладки можно использовать:
  // maxWorkers: 1 - последовательное выполнение
  // maxWorkers: 4 - конкретное количество процессов
  
  // Настройки для разных уровней сложности:
  // - Unit тесты (простые): используют maxWorkers по умолчанию
  // - Integration тесты (сложные): можно запускать с --maxWorkers=2
  // - E2E тесты (очень сложные): --maxWorkers=1 (последовательно)
  
  // Кэширование результатов тестов для ускорения
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Исправление проблемы с readonly property
  // Отключаем изоляцию модулей для некоторых случаев
  // Это может помочь с проблемой readonly property
  testEnvironment: 'node',
  
  // Дополнительные настройки для обхода проблем с readonly
  globals: {
    'ts-jest': {
      isolatedModules: false,
    },
  },
};
