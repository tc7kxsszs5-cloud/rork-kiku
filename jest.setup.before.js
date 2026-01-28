// Jest setup file that runs BEFORE jest-expo preset
// This is critical for mocking ESM modules

// КРИТИЧЕСКИЙ МОК: Должен быть ДО загрузки jest-expo preset
jest.mock('expo-modules-core/src/polyfill/dangerous-internal', () => ({}), { virtual: true });
jest.mock('expo-modules-core/src/polyfill/dangerous-internal.ts', () => ({}), { virtual: true });

console.log('[Jest] Pre-setup: Mocked expo-modules-core/src/polyfill/dangerous-internal');
