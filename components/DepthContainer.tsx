import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '@/constants/ThemeContext';
import { Gradients } from '@/constants/ColorSystem';
import { BackgroundWithDepth, CardWithDepth, OrnamentalContainer } from './BackgroundEffects';

/**
 * Универсальный контейнер с эффектами глубины
 * Объединяет все визуальные эффекты
 */
interface DepthContainerProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'background' | 'card' | 'ornamental';
  elevation?: 'low' | 'medium' | 'high';
  withGradient?: boolean;
  withNoise?: boolean;
  withPattern?: boolean;
  withGrain?: boolean;
}

export const DepthContainer: React.FC<DepthContainerProps> = ({
  style,
  children,
  variant = 'card',
  elevation = 'medium',
  withGradient = true,
  withNoise = true,
  withPattern = true,
  withGrain = true,
}) => {
  if (variant === 'background') {
    return (
      <BackgroundWithDepth style={style} variant="warm">
        {children}
      </BackgroundWithDepth>
    );
  }

  if (variant === 'ornamental') {
    return (
      <OrnamentalContainer style={style}>
        {children}
      </OrnamentalContainer>
    );
  }

  return (
    <CardWithDepth style={style} elevation={elevation}>
      {withGradient && <GradientOverlay />}
      {withNoise && <NoiseOverlay />}
      {withPattern && <PatternOverlay />}
      {withGrain && <GrainOverlay />}
      {children}
    </CardWithDepth>
  );
};

/**
 * Вспомогательные компоненты для эффектов
 */
const GradientOverlay: React.FC = () => {
  const { theme } = useThemeMode();
  
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[theme.interactive.primary + '10', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const NoiseOverlay: React.FC = () => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: 0.05,
          backgroundColor: 'transparent',
        },
      ]}
      pointerEvents="none"
    />
  );
};

const PatternOverlay: React.FC = () => {
  const { theme } = useThemeMode();
  
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: 0.03,
          backgroundColor: 'transparent',
        },
      ]}
      pointerEvents="none"
    />
  );
};

const GrainOverlay: React.FC = () => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: 0.08,
          backgroundColor: 'transparent',
        },
      ]}
      pointerEvents="none"
    />
  );
};


