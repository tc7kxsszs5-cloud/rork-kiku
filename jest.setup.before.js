// Jest setup file that runs BEFORE jest-expo preset
// This is critical for mocking ESM modules

// КРИТИЧЕСКИЙ МОК: Должен быть ДО загрузки jest-expo preset
jest.mock('expo-modules-core/src/polyfill/dangerous-internal', () => ({}), { virtual: true });
jest.mock('expo-modules-core/src/polyfill/dangerous-internal.ts', () => ({}), { virtual: true });

// Мок для lucide-react-native (ESM проблема)
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const mockIcon = React.forwardRef((props, ref) => 
    React.createElement('View', { ...props, ref, testID: props.testID || 'mock-icon' })
  );
  
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '__esModule') return true;
      if (prop === 'default') return mockIcon;
      return mockIcon;
    }
  });
});

console.log('[Jest] Pre-setup: Mocked expo-modules-core/src/polyfill/dangerous-internal and lucide-react-native');
