import React, { useEffect, useRef } from 'react';
import { Animated, Image, View, ViewStyle, Platform, StyleSheet } from 'react-native';

const logoHands = require('@/assets/images/logo-hands-gold-trimmed.png');

interface AnimatedLogoProps {
  size?: number;
  /** Длительность одного полного оборота в мс */
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
        // useNativeDriver: false обязателен для web; на нативе чуть медленнее, но работает везде
        useNativeDriver: false,
        easing: (t) => t,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [duration, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handsSize = size * 0.75;

  // На web: mix-blend-mode: multiply убирает белый фон изображения
  // (белый × тёмно-синий = тёмно-синий, золото остаётся видимым)
  const webImageStyle = Platform.OS === 'web'
    ? ({ mixBlendMode: 'multiply' } as any)
    : {};

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
        },
        style,
      ]}
    >
      {/* Тёмно-синий фон — статичен */}
      <View style={[StyleSheet.absoluteFillObject, { borderRadius: size * 0.22, backgroundColor: '#0F1E38' }]} />

      {/* Золотые руки вращаются */}
      <Animated.View
        style={{
          width: handsSize,
          height: handsSize,
          transform: [{ rotate }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={logoHands}
          style={[{ width: handsSize, height: handsSize }, webImageStyle]}
          resizeMode="contain"
        />
      </Animated.View>
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
