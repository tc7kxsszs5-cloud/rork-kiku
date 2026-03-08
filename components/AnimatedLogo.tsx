import React, { useEffect, useRef } from 'react';
import { Animated, Image, View, ViewStyle } from 'react-native';

interface AnimatedLogoProps {
  size?: number;
  /** Длительность одного полного оборота в мс */
  duration?: number;
  style?: ViewStyle;
  /** Если true — логотип статичный, без вращения */
  static?: boolean;
}

export function AnimatedLogo({ size = 120, duration = 9000, style, static: isStatic = false }: AnimatedLogoProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isStatic) return;
    const anim = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: (t) => t,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [duration, rotation, isStatic]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
          backgroundColor: '#1B2B47',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {/* Статичный фон — логотип (тёмно-синий квадрат) */}
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: size, height: size, position: 'absolute' }}
        resizeMode="cover"
        fadeDuration={0}
      />
      {/* Вращающиеся руки поверх фона */}
      <Animated.View
        style={{
          width: size,
          height: size,
          position: 'absolute',
          transform: isStatic ? [] : [{ rotate }],
        }}
      >
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
          fadeDuration={0}
        />
      </Animated.View>
    </View>
  );
}
