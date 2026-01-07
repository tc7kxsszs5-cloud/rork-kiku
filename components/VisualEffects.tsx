import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '@/constants/ThemeContext';
import { Gradients } from '@/constants/ColorSystem';

/**
 * Градиентная сетка для создания глубины
 */
interface GradientMeshProps {
  style?: ViewStyle;
  intensity?: 'subtle' | 'medium' | 'strong';
  children?: React.ReactNode;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({
  style,
  intensity = 'medium',
  children,
}) => {
  const { theme } = useThemeMode();
  
  const opacity = {
    subtle: 0.1,
    medium: 0.2,
    strong: 0.4,
  }[intensity];

  return (
    <View style={[styles.meshContainer, style]}>
      {/* Верхний левый градиент */}
      <LinearGradient
        colors={[theme.interactive.primary, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.meshGradient, { opacity }]}
      />
      {/* Нижний правый градиент */}
      <LinearGradient
        colors={['transparent', theme.interactive.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.meshGradient, styles.meshGradientBottom, { opacity }]}
      />
      {/* Центральный акцент */}
      <LinearGradient
        colors={Gradients.warm as [string, string]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.meshGradient, styles.meshGradientCenter, { opacity: opacity * 0.5 }]}
      />
      {children}
    </View>
  );
};

/**
 * Шумовая текстура для органичности
 */
interface NoiseTextureProps {
  style?: ViewStyle;
  intensity?: number;
  opacity?: number;
}

export const NoiseTexture: React.FC<NoiseTextureProps> = ({
  style,
  intensity = 0.3,
  opacity = 0.15,
}) => {
  // В React Native используем SVG паттерн для шума
  // Для web можно использовать CSS noise
  return (
    <View
      style={[
        styles.noiseTexture,
        {
          opacity,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {/* В React Native шум создается через наложение точек */}
      {/* В production можно использовать react-native-svg для создания паттерна */}
    </View>
  );
};

/**
 * Геометрический паттерн
 */
interface GeometricPatternProps {
  style?: ViewStyle;
  pattern?: 'dots' | 'lines' | 'grid' | 'hexagons';
  color?: string;
  opacity?: number;
}

export const GeometricPattern: React.FC<GeometricPatternProps> = ({
  style,
  pattern = 'dots',
  opacity = 0.1,
}) => {
  return (
    <View style={[styles.geometricPattern, { opacity }, style]}>
      {/* В production можно использовать react-native-svg для создания паттернов */}
      {/* Пока используем стилизованные View элементы */}
    </View>
  );
};

/**
 * Многослойные прозрачные элементы
 */
interface LayeredGlassProps {
  style?: ViewStyle;
  layers?: number;
  children?: React.ReactNode;
}

export const LayeredGlass: React.FC<LayeredGlassProps> = ({
  style,
  layers = 3,
  children,
}) => {
  const { theme } = useThemeMode();

  return (
    <View style={[styles.layeredContainer, style]}>
      {Array.from({ length: layers }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.glassLayer,
            {
              backgroundColor: theme.surface.primary,
              opacity: 0.1 + (index * 0.05),
              zIndex: -layers + index,
            },
          ]}
        />
      ))}
      {children}
    </View>
  );
};

/**
 * Драматические тени
 */
interface DramaticShadowProps {
  style?: ViewStyle;
  intensity?: 'soft' | 'medium' | 'dramatic';
  color?: string;
  children?: React.ReactNode;
}

export const DramaticShadow: React.FC<DramaticShadowProps> = ({
  style,
  intensity = 'medium',
  color,
  children,
}) => {
  const { theme } = useThemeMode();
  const shadowColor = color || theme.text.primary;

  const shadowStyles = {
    soft: {
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    dramatic: {
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  }[intensity];

  return (
    <View style={[style, shadowStyles]}>
      {children}
    </View>
  );
};

/**
 * Декоративные границы
 */
interface DecorativeBorderProps {
  style?: ViewStyle;
  variant?: 'solid' | 'dashed' | 'gradient' | 'ornamental';
  color?: string;
  width?: number;
  children?: React.ReactNode;
}

export const DecorativeBorder: React.FC<DecorativeBorderProps> = ({
  style,
  variant = 'gradient',
  color,
  width = 2,
  children,
}) => {
  const { theme } = useThemeMode();
  const borderColor = color || theme.border.accent;

  if (variant === 'gradient') {
    return (
      <View style={[styles.borderContainer, style]}>
        <LinearGradient
          colors={Gradients.warm as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBorder, { borderWidth: width }]}
        />
        <View style={styles.borderContent}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.decorativeBorder,
        {
          borderColor,
          borderWidth: width,
          borderStyle: variant === 'dashed' ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/**
 * Наложение зерна для текстуры
 */
interface GrainOverlayProps {
  style?: ViewStyle;
  intensity?: number;
}

export const GrainOverlay: React.FC<GrainOverlayProps> = ({
  style,
  intensity = 0.2,
}) => {
  return (
    <View
      style={[
        styles.grainOverlay,
        {
          opacity: intensity,
        },
        style,
      ]}
      pointerEvents="none"
    >
      {/* В production можно использовать SVG паттерн или изображение */}
    </View>
  );
};

const styles = StyleSheet.create({
  meshContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  meshGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    height: '50%',
  },
  meshGradientBottom: {
    top: '50%',
    left: '50%',
  },
  meshGradientCenter: {
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
  },
  noiseTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  geometricPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  layeredContainer: {
    position: 'relative',
  },
  glassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  borderContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  borderContent: {
    margin: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  decorativeBorder: {
    borderRadius: 12,
  },
  grainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

