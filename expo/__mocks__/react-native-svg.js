// Mock for react-native-svg
const React = require('react');

const mockSvgComponent = (name) => {
  const Component = React.forwardRef((props, ref) => 
    React.createElement(name, { ...props, ref, testID: `mock-svg-${name}` })
  );
  Component.displayName = `Mock${name}`;
  return Component;
};

module.exports = {
  __esModule: true,
  Svg: mockSvgComponent('Svg'),
  Circle: mockSvgComponent('Circle'),
  Ellipse: mockSvgComponent('Ellipse'),
  G: mockSvgComponent('G'),
  Text: mockSvgComponent('Text'),
  TSpan: mockSvgComponent('TSpan'),
  TextPath: mockSvgComponent('TextPath'),
  Path: mockSvgComponent('Path'),
  Polygon: mockSvgComponent('Polygon'),
  Polyline: mockSvgComponent('Polyline'),
  Line: mockSvgComponent('Line'),
  Rect: mockSvgComponent('Rect'),
  Use: mockSvgComponent('Use'),
  Image: mockSvgComponent('Image'),
  Symbol: mockSvgComponent('Symbol'),
  Defs: mockSvgComponent('Defs'),
  LinearGradient: mockSvgComponent('LinearGradient'),
  RadialGradient: mockSvgComponent('RadialGradient'),
  Stop: mockSvgComponent('Stop'),
  ClipPath: mockSvgComponent('ClipPath'),
  Pattern: mockSvgComponent('Pattern'),
  Mask: mockSvgComponent('Mask'),
};
