/**
 * Jest configuration — aligned with Jest docs and CI conventions.
 * Test structure: Jest best practices; queries: Testing Library (user-centric).
 * See docs/testing/TESTING_STANDARDS.md.
 */
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
    // Мок react-native, чтобы не загружать node_modules/react-native (Flow "import typeof" ломает парсер)
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
  },
  // CI: limit workers for stability (Jest/CI best practice)
  maxWorkers: process.env.CI ? 2 : '50%',

  // Standard timeout (ms); override per test with it(name, fn, timeout)
  testTimeout: 10000,
  
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
  
  // Настройки для работы с ESM модулями
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
