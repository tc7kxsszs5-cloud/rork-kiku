/**
 * Мок react-native для Jest.
 * Используется через moduleNameMapper, чтобы не загружать настоящий react-native
 * (в нём Flow-синтаксис "import typeof", который Node не понимает).
 */
const React = require('react');

const createMock = (name) => {
  const C = (props) => React.createElement(name, props, props?.children);
  C.displayName = name;
  return C;
};

module.exports = {
  Platform: {
    OS: 'ios',
    select: (dict) => dict.ios ?? dict.default,
  },
  View: createMock('View'),
  Text: createMock('Text'),
  TouchableOpacity: createMock('TouchableOpacity'),
  ScrollView: createMock('ScrollView'),
  FlatList: (props) => {
    const { data = [], renderItem, keyExtractor, ...rest } = props;
    if (!data.length || !renderItem) return React.createElement('FlatList', props, null);
    const children = data.map((item, index) =>
      renderItem({ item, index, separators: {} })
    );
    return React.createElement('View', {}, ...children);
  },
  ActivityIndicator: createMock('ActivityIndicator'),
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => {
      if (style == null) return {};
      if (Array.isArray(style)) {
        return Object.assign({}, ...style.filter(Boolean));
      }
      return typeof style === 'object' ? style : {};
    },
  },
  Animated: {
    Value: class AnimatedValue {
      constructor(initial) {
        this._value = initial;
      }
      setValue(v) { this._value = v; }
      interpolate() { return this; }
    },
    timing: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
    parallel: jest.fn((animations) => ({ start: jest.fn((cb) => cb && cb()) })),
    sequence: jest.fn((animations) => ({ start: jest.fn((cb) => cb && cb()) })),
    spring: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
    View: createMock('Animated.View'),
    Text: createMock('Animated.Text'),
    create: jest.fn((c) => c),
  },
  Alert: {
    alert: jest.fn(),
    prompt: jest.fn(),
  },
  // Дополнительные экспорты, которые могут использовать тесты и контексты
  TouchableHighlight: createMock('TouchableHighlight'),
  TouchableWithoutFeedback: createMock('TouchableWithoutFeedback'),
  TextInput: createMock('TextInput'),
  Image: createMock('Image'),
  SafeAreaView: createMock('SafeAreaView'),
  Modal: createMock('Modal'),
  KeyboardAvoidingView: createMock('KeyboardAvoidingView'),
  Pressable: createMock('Pressable'),
  Switch: createMock('Switch'),
  ImageBackground: createMock('ImageBackground'),
  RefreshControl: createMock('RefreshControl'),
  StatusBar: createMock('StatusBar'),
  Linking: { openURL: jest.fn() },
  NativeModules: {},
  NativeEventEmitter: jest.fn().mockImplementation(() => ({ addListener: jest.fn(), removeListeners: jest.fn() })),
  Dimensions: { get: jest.fn(() => ({ width: 390, height: 844 })) },
  Appearance: { getColorScheme: jest.fn(() => 'light'), addChangeListener: jest.fn() },
};
