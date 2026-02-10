/**
 * Цветовая система Safe Zone
 * 
 * Палитра на основе логотипа:
 * - Navy (тёмно-синий) — основной фон, доверие, защита
 * - Gold (золотой) — акценты, тепло, забота
 * - Off-white — светлый фон, чистота
 * 
 * Принципы:
 * - Премиальный, строгий, но тёплый стиль
 * - Золотые акценты на тёмном фоне = ощущение безопасности
 * - Контекстно-специфичные цвета для детской безопасности
 */

/**
 * Safe Zone Color Tokens
 * Navy + Gold + статусные цвета
 */
export const ColorTokens = {
  // Navy — основной бренд-цвет (защита, доверие)
  navy: {
    50: '#F0F3F7',
    100: '#D6DDE6',
    200: '#B0BFCF',
    300: '#8A9DB8',
    400: '#6580A0',
    500: '#4A6484',
    600: '#3A5070',
    700: '#2F4260',
    800: '#2A3441',
    900: '#1E2A3A',
    950: '#151E2B',
  },

  // Gold — акцентный бренд-цвет (тепло, забота, ценность)
  gold: {
    50: '#FDF8ED',
    100: '#F9EDD0',
    200: '#F2DCA3',
    300: '#E8C76E',
    400: '#D4AD4A',
    500: '#C9A84C',
    600: '#B8923A',
    700: '#9A7830',
    800: '#7D6128',
    900: '#5E4A1F',
    950: '#3D3014',
  },

  // Care Green — безопасность
  care: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Amber — предупреждения
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Red — опасность, критические риски
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral — тексты и фоны
  neutral: {
    50: '#F5F3EF',    // Off-white (из логотипа)
    100: '#EDE9E1',
    200: '#DDD8CE',
    300: '#C5BFB5',
    400: '#A09A90',
    500: '#7D786F',
    600: '#5E5A53',
    700: '#45423C',
    800: '#2E2C28',
    900: '#1A1917',
    950: '#0D0C0B',
  },
};

/**
 * Семантические цвета для тем
 */
export interface SemanticColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    warm: string;
  };

  surface: {
    primary: string;
    secondary: string;
    muted: string;
    elevated: string;
    accent: string;
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
    warm: string;
  };

  border: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    warm: string;
  };

  interactive: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;
    safety: string;
    trust: string;
  };

  status: {
    safe: string;
    warning: string;
    danger: string;
    info: string;
  };
}

/**
 * Light Theme — тёплый, светлый с золотыми акцентами
 */
export const lightThemeColors: SemanticColors = {
  background: {
    primary: ColorTokens.neutral[50],         // Off-white фон
    secondary: '#FFFFFF',
    tertiary: ColorTokens.gold[50],
    elevated: '#FFFFFF',
    warm: ColorTokens.gold[100],
  },
  surface: {
    primary: '#FFFFFF',
    secondary: ColorTokens.neutral[50],
    muted: ColorTokens.neutral[100],
    elevated: '#FFFFFF',
    accent: ColorTokens.gold[50],
  },
  text: {
    primary: ColorTokens.navy[900],
    secondary: ColorTokens.navy[600],
    tertiary: ColorTokens.navy[400],
    inverse: '#FFFFFF',
    accent: ColorTokens.gold[600],
    warm: ColorTokens.gold[700],
  },
  border: {
    primary: ColorTokens.neutral[200],
    secondary: ColorTokens.gold[200],
    muted: ColorTokens.neutral[100],
    accent: ColorTokens.gold[500],
    warm: ColorTokens.gold[300],
  },
  interactive: {
    primary: ColorTokens.navy[800],
    primaryHover: ColorTokens.navy[700],
    secondary: ColorTokens.gold[500],
    secondaryHover: ColorTokens.gold[600],
    accent: ColorTokens.gold[400],
    accentHover: ColorTokens.gold[500],
    safety: ColorTokens.navy[800],
    trust: ColorTokens.navy[600],
  },
  status: {
    safe: ColorTokens.care[500],
    warning: ColorTokens.amber[500],
    danger: ColorTokens.danger[500],
    info: ColorTokens.navy[500],
  },
};

/**
 * Dark Theme — глубокий navy с золотыми акцентами
 * Основан на цветах логотипа (тёмный квадрат + золотые руки)
 */
export const darkThemeColors: SemanticColors = {
  background: {
    primary: ColorTokens.navy[950],
    secondary: ColorTokens.navy[900],
    tertiary: ColorTokens.navy[800],
    elevated: ColorTokens.navy[800],
    warm: ColorTokens.gold[900],
  },
  surface: {
    primary: ColorTokens.navy[900],
    secondary: ColorTokens.navy[800],
    muted: ColorTokens.navy[700],
    elevated: ColorTokens.navy[800],
    accent: ColorTokens.gold[900],
  },
  text: {
    primary: ColorTokens.neutral[50],
    secondary: ColorTokens.neutral[300],
    tertiary: ColorTokens.neutral[400],
    inverse: ColorTokens.navy[950],
    accent: ColorTokens.gold[400],
    warm: ColorTokens.gold[300],
  },
  border: {
    primary: ColorTokens.navy[700],
    secondary: ColorTokens.navy[600],
    muted: ColorTokens.navy[800],
    accent: ColorTokens.gold[500],
    warm: ColorTokens.gold[600],
  },
  interactive: {
    primary: ColorTokens.gold[500],
    primaryHover: ColorTokens.gold[400],
    secondary: ColorTokens.navy[400],
    secondaryHover: ColorTokens.navy[300],
    accent: ColorTokens.gold[400],
    accentHover: ColorTokens.gold[300],
    safety: ColorTokens.gold[500],
    trust: ColorTokens.navy[400],
  },
  status: {
    safe: ColorTokens.care[400],
    warning: ColorTokens.amber[400],
    danger: ColorTokens.danger[400],
    info: ColorTokens.navy[300],
  },
};

/**
 * Хелпер для получения цвета из токена
 */
export const getColor = (token: keyof typeof ColorTokens, shade: number): string => {
  const tokenObj = ColorTokens[token] as Record<number, string>;
  return tokenObj[shade] || '';
};

/**
 * Хелпер для создания градиентов
 */
export const createGradient = (colors: string[]): string[] => colors;

/**
 * Градиенты Safe Zone
 */
export const Gradients = {
  brand: [ColorTokens.navy[800], ColorTokens.navy[950]],
  gold: [ColorTokens.gold[400], ColorTokens.gold[600]],
  safety: [ColorTokens.navy[700], ColorTokens.navy[900]],
  trust: [ColorTokens.navy[600], ColorTokens.navy[800]],
  care: [ColorTokens.care[400], ColorTokens.care[600]],
  warm: [ColorTokens.gold[300], ColorTokens.gold[500]],
  danger: [ColorTokens.danger[400], ColorTokens.danger[600]],
};
