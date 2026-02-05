// Jest setup file that runs BEFORE jest-expo preset
// This is critical for mocking ESM modules

// КРИТИЧЕСКИЙ МОК: Должен быть ДО загрузки jest-expo preset
jest.mock('expo-modules-core/src/polyfill/dangerous-internal', () => ({}), { virtual: true });
jest.mock('expo-modules-core/src/polyfill/dangerous-internal.ts', () => ({}), { virtual: true });

// Mock expo-haptics to avoid native module requirements in Jest
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'Success', Warning: 'Warning', Error: 'Error' },
  ImpactFeedbackStyle: { Light: 'Light', Medium: 'Medium', Heavy: 'Heavy' },
}));

console.log('[Jest] Pre-setup: Mocked expo-modules-core/src/polyfill/dangerous-internal');
