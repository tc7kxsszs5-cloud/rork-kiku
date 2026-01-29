// Mock for lucide-react-native to fix ESM import issues in Jest
const React = require('react');

const mockIcon = React.forwardRef((props, ref) => 
  React.createElement('View', { ...props, ref, testID: props.testID || 'mock-icon' })
);

// Export all possible icons as the same mock
const iconProxy = new Proxy({}, {
  get: (target, prop) => {
    if (prop === '__esModule') return true;
    if (prop === 'default') return mockIcon;
    return mockIcon;
  }
});

module.exports = iconProxy;
