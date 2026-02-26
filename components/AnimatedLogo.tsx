import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

const logoHands = require('@/assets/images/logo-hands-gold-trimmed.png');

interface AnimatedLogoProps {
  size?: number;
  /** Длительность одного полного оборота в мс (по умолчанию 9000 = 9 сек) */
  duration?: number;
  style?: ViewStyle;
}

export function AnimatedLogo({ size = 120, duration = 9000, style }: AnimatedLogoProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: (t) => t, // линейная скорость
      })
    );
    anim.start();
    return () => anim.stop();
  }, [duration, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = size * 0.22;
  const handsSize = size * 0.7;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: '#0F1E38',
        },
        style,
      ]}
    >
      <Animated.Image
        source={logoHands}
        style={{
          width: handsSize,
          height: handsSize,
          transform: [{ rotate }],
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
