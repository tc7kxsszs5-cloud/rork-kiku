import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const DEFAULT_COLOR = '#1a1a1a';

type LogoHandsProps = {
  size?: number;
  color?: string;
  style?: object;
};

/**
 * Логотип «руки в круге» — чёрное кольцо, без фона и надписей.
 * Можно заменить на изображение assets/images/logo-hands-black.png при наличии.
 */
export function LogoHands({ size = 40, color = DEFAULT_COLOR, style }: LogoHandsProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.72;
  const strokeWidth = Math.max(2.5, size * 0.12);

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
