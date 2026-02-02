module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|expo-modules-core|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@nkzw/create-context-hook)',
  ],
  setupFiles: ['<rootDir>/jest.setup.before.js'], // Runs BEFORE preset
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
<<<<<<< HEAD
    // Мок react-native, чтобы не загружать node_modules/react-native (Flow "import typeof" ломает парсер)
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
=======
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
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

  testEnvironment: 'node',

  // Исключаем kids, избегаем Haste collision с другим package.json
  modulePathIgnorePatterns: ['<rootDir>/kids/'],

  // E2E тянет app/_layout, expo-splash-screen, NativeModules — не подходит для Jest node env
  testPathIgnorePatterns: [
    '/node_modules/',
    '/\\.expo/',
    '<rootDir>/__tests__/e2e/',
<<<<<<< HEAD
    '<rootDir>/__tests__/playwright/',
    '<rootDir>/__tests__/testUtils\\.ts',
  ],

  // Покрытие: пороги не блокируют сборку, но показывают в отчёте
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
=======
    // contexts.test теперь использует динамические импорты, можно запускать
  ],
>>>>>>> 31b4976e7e3b59e066361accec63d69faa16c8e6
  
  // Настройки для работы с ESM модулями
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
