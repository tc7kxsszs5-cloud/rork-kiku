import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '@/constants/ThemeContext';
import { Gradients } from '@/constants/ColorSystem';

/**
 * Комплексный фон с эффектами глубины
 */
interface BackgroundWithDepthProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: 'default' | 'warm' | 'cool' | 'dramatic';
}

export const BackgroundWithDepth: React.FC<BackgroundWithDepthProps> = ({
  style,
  children,
  variant = 'default',
}) => {
  const { theme } = useThemeMode();

  const getGradientColors = (): [string, string, ...string[]] => {
    switch (variant) {
      case 'warm':
        return Gradients.warm as [string, string];
      case 'cool':
        return Gradients.trust as [string, string];
      case 'dramatic':
        return [theme.background.primary, theme.interactive.primary, theme.background.secondary];
      default:
        return [theme.background.primary, theme.background.secondary];
    }
  };
  
  const gradientColors = getGradientColors();

  return (
    <View style={[styles.container, style]}>
      {/* Базовый градиент */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Градиентная сетка */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[theme.interactive.primary + '20', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meshLayer1}
        />
        <LinearGradient
          colors={['transparent', theme.interactive.secondary + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meshLayer2}
        />
      </View>

      {/* Геометрический паттерн (точки) */}
      <View style={[styles.patternOverlay, { opacity: 0.05 }]}>
        {/* В production можно использовать SVG паттерн */}
      </View>

      {/* Зерно */}
      <View style={[styles.grainOverlay, { opacity: 0.1 }]} />

      {children}
    </View>
  );
};

/**
 * Карточка с эффектами глубины
 */
interface CardWithDepthProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
}

export const CardWithDepth: React.FC<CardWithDepthProps> = ({
  style,
  children,
  elevation = 'medium',
}) => {
  const { theme } = useThemeMode();

  const shadowConfig = {
    low: {
      shadowColor: theme.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: theme.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    high: {
      shadowColor: theme.text.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  }[elevation];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface.primary,
          ...shadowConfig,
        },
        style,
      ]}
    >
      {/* Многослойный эффект */}
      <View style={[styles.cardLayer, { backgroundColor: theme.surface.secondary, opacity: 0.1 }]} />
      <View style={[styles.cardLayer, { backgroundColor: theme.interactive.primary, opacity: 0.05 }]} />
      
      {/* Декоративная граница */}
      <LinearGradient
        colors={Gradients.warm as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardBorder}
      />

      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

/**
 * Контейнер с орнаментальной границей
 */
interface OrnamentalContainerProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const OrnamentalContainer: React.FC<OrnamentalContainerProps> = ({
  style,
  children,
}) => {
  const { theme } = useThemeMode();

  return (
    <View style={[styles.ornamentalContainer, style]}>
      {/* Внешняя граница */}
      <View
        style={[
          styles.ornamentalBorder,
          {
            borderColor: theme.border.accent,
            borderWidth: 2,
          },
        ]}
      />
      {/* Внутренняя граница */}
      <View
        style={[
          styles.ornamentalBorderInner,
          {
            borderColor: theme.border.warm,
            borderWidth: 1,
          },
        ]}
      />
      {/* Градиентный акцент */}
      <LinearGradient
        colors={[theme.interactive.primary + '30', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ornamentalGradient}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  meshLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '60%',
  },
  meshLayer2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '60%',
    height: '60%',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  grainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardLayer: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 14,
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.3,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
  },
  ornamentalContainer: {
    position: 'relative',
    borderRadius: 12,
    padding: 2,
  },
  ornamentalBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  ornamentalBorderInner: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 8,
  },
  ornamentalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
});

