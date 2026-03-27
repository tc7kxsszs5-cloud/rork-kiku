import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography, TypographyStyles, createTypographyStyle } from '@/constants/Typography';
import { useThemeMode } from '@/constants/ThemeContext';

/**
 * УНИКАЛЬНЫЕ Typography компоненты
 * Избегаем cookie-cutter дизайна
 */

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?: keyof TypographyStyles;
  color?: string;
  style?: TextProps['style'];
}

/**
 * Базовый Typography компонент
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyRegular',
  color,
  style,
  children,
  ...props
}) => {
  const { theme } = useThemeMode();
  const textColor = color || theme.text.primary;
  const typographyStyle = createTypographyStyle(typography[variant], textColor);

  return (
    <Text style={[typographyStyle, style]} {...props}>
      {children}
    </Text>
  );
};

/**
 * Display компоненты - характерные, отличительные заголовки
 */
export const DisplayHero: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayHero" {...props} />
);

export const DisplayLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayLarge" {...props} />
);

export const DisplayMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayMedium" {...props} />
);

export const DisplaySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displaySmall" {...props} />
);

/**
 * Headline компоненты - сильные подзаголовки
 */
export const HeadlineBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineBold" {...props} />
);

export const HeadlineRegular: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineRegular" {...props} />
);

/**
 * Title компоненты - структурированные секции
 */
export const TitleBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleBold" {...props} />
);

export const TitleRegular: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleRegular" {...props} />
);

/**
 * Body компоненты - изысканный, читаемый текст
 */
export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodyRegular: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyRegular" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

/**
 * Accent компоненты - резкие, заметные сообщения
 */
export const AccentBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => {
  const { theme } = useThemeMode();
  return <Typography variant="accentBold" color={theme.text.accent} {...props} />;
};

export const AccentRegular: React.FC<Omit<TypographyProps, 'variant'>> = (props) => {
  const { theme } = useThemeMode();
  return <Typography variant="accentRegular" color={theme.text.accent} {...props} />;
};

/**
 * Special компоненты
 */
export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" {...props} />
);
