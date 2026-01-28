// Jest setup file for React Native / Expo
// Этот файл выполняется перед каждым тестом

// КРИТИЧЕСКИЙ МОК: Должен быть ДО всех других импортов
// Мок для expo-modules-core/src/polyfill/dangerous-internal.ts (ESM проблема)
jest.mock('expo-modules-core/src/polyfill/dangerous-internal', () => ({}), { virtual: true });
jest.mock('expo-modules-core/src/polyfill/dangerous-internal.ts', () => ({}), { virtual: true });

// Общий мок для expo-modules-core
jest.mock('expo-modules-core', () => ({
  requireNativeViewManager: jest.fn(),
  NativeModulesProxy: {},
  EventEmitter: jest.fn(),
  Platform: {
    OS: 'ios',
  },
}));

// Моки для React Native модулей (require внутри factory — Jest sandbox)
jest.mock('react-native', () => {
  const mockReact = require('react');
  return {
    Platform: {
      OS: 'ios',
      select: (dict) => dict.ios || dict.default,
    },
    View: ({ children, testID, ...props }) =>
      mockReact.createElement('View', { testID, ...props }, children),
    Text: ({ children, testID, ...props }) =>
      mockReact.createElement('Text', { testID, ...props }, children),
    TouchableOpacity: ({ children, onPress, testID, ...props }) =>
      mockReact.createElement('TouchableOpacity', { onPress, testID, ...props }, children),
    StyleSheet: {
      create: (styles) => styles,
    },
  };
});

// Мок для Expo модулей
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
  executionEnvironment: 'storeClient',
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const mock = {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
  };
  return { ...mock, default: mock };
});

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  AndroidNotificationPriority: {
    MIN: 'min',
    LOW: 'low',
    DEFAULT: 'default',
    HIGH: 'high',
    MAX: 'max',
  },
  AndroidImportance: {
    MIN: 'min',
    LOW: 'low',
    DEFAULT: 'default',
    HIGH: 'high',
    MAX: 'max',
  },
}));

jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 55.7558,
        longitude: 37.6173,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    })
  ),
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
}));

// Мок для expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSegments: () => [],
  useGlobalSearchParams: () => ({}),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
}));

// Глобальные моки
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Увеличиваем timeout для async операций
if (typeof jest !== 'undefined') {
  jest.setTimeout(10000);
}

// Подавляем console.warn в тестах (можно включить для отладки)
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };
