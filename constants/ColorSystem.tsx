/**
 * УНИКАЛЬНАЯ цветовая система KIKU
 * 
 * Принципы:
 * - Избегаем клишированных схем (фиолетовые градиенты на белом)
 * - Доминирующие цвета с резкими акцентами
 * - Контекстно-специфичные цвета для детской безопасности
 * - Теплые, защищающие цвета вместо холодных
 */

/**
 * Уникальные цвета для детской безопасности
 * Теплые, защищающие, но не клишированные
 */
export const ColorTokens = {
  // Safety Orange - доминирующий цвет безопасности
  // Теплый, предупреждающий, но дружелюбный
  safety: {
    50: '#FFF4E6',
    100: '#FFE8CC',
    200: '#FFD199',
    300: '#FFBA66',
    400: '#FFA333',
    500: '#FF8C00', // Основной цвет безопасности
    600: '#E67E00',
    700: '#CC7000',
    800: '#B36200',
    900: '#995400',
  },
  
  // Trust Blue - доверие и надежность
  // Не яркий неоновый, а глубокий, спокойный
  trust: {
    50: '#E8F4F8',
    100: '#D1E9F1',
    200: '#A3D3E3',
    300: '#75BDD5',
    400: '#47A7C7',
    500: '#1E90B8', // Основной цвет доверия
    600: '#1A7A9E',
    700: '#166484',
    800: '#124E6A',
    900: '#0E3850',
  },
  
  // Care Green - забота и безопасность
  // Мягкий, успокаивающий, не кислотный
  care: {
    50: '#F0F9F4',
    100: '#E1F3E9',
    200: '#C3E7D3',
    300: '#A5DBBD',
    400: '#87CFA7',
    500: '#69C391', // Основной цвет заботы
    600: '#5AA67A',
    700: '#4B8963',
    800: '#3C6C4C',
    900: '#2D4F35',
  },
  
  // Alert Amber - предупреждения
  // Теплый, но заметный
  alert: {
    50: '#FFFBF0',
    100: '#FFF7E1',
    200: '#FFEFC3',
    300: '#FFE7A5',
    400: '#FFDF87',
    500: '#FFD769', // Основной цвет предупреждения
    600: '#E6C25F',
    700: '#CCAD55',
    800: '#B3984B',
    900: '#998341',
  },
  
  // Danger Red - критические риски
  // Не яркий красный, а глубокий, серьезный
  danger: {
    50: '#FEF2F2',
    100: '#FCE5E5',
    200: '#F9CBCB',
    300: '#F6B1B1',
    400: '#F39797',
    500: '#F07D7D', // Основной цвет опасности
    600: '#D87171',
    700: '#C06565',
    800: '#A85959',
    900: '#904D4D',
  },
  
  // Neutral - для текста и фонов
  // Теплые нейтральные, не холодные серые
  neutral: {
    50: '#FAF9F7',
    100: '#F5F3F0',
    200: '#EBE7E0',
    300: '#E1DBD0',
    400: '#D7CFC0',
    500: '#CDC3B0',
    600: '#B8AE9E',
    700: '#A3998C',
    800: '#8E847A',
    900: '#796F68',
    950: '#4A4540',
  },
};

/**
 * Семантические цвета для тем
 * Уникальные, не клишированные
 */
export interface SemanticColors {
  // Backgrounds - теплые, защищающие
  background: {
    primary: string;      // Доминирующий фон
    secondary: string;    // Вторичный фон
    tertiary: string;     // Третичный фон
    elevated: string;    // Приподнятые поверхности
    warm: string;        // Теплый акцентный фон
  };
  
  // Surfaces - структурированные поверхности
  surface: {
    primary: string;
    secondary: string;
    muted: string;
    elevated: string;
    accent: string;      // Акцентная поверхность
  };
  
  // Text - высокий контраст, но теплый
  text: {
    primary: string;     // Основной текст
    secondary: string;   // Вторичный текст
    tertiary: string;    // Третичный текст
    inverse: string;     // Инверсный текст
    accent: string;      // Акцентный текст (резкий)
    warm: string;       // Теплый текст
  };
  
  // Borders - мягкие, но заметные
  border: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;      // Резкий акцент
    warm: string;       // Теплая граница
  };
  
  // Interactive - резкие, но не кричащие
  interactive: {
    primary: string;     // Доминирующий
    primaryHover: string;
    secondary: string;   // Резкий акцент
    secondaryHover: string;
    accent: string;     // Яркий акцент
    accentHover: string;
    safety: string;     // Цвет безопасности
    trust: string;      // Цвет доверия
  };
  
  // Status - контекстно-специфичные
  status: {
    safe: string;       // Безопасно (care green)
    warning: string;    // Предупреждение (alert amber)
    danger: string;    // Опасность (danger red)
    info: string;       // Информация (trust blue)
  };
}

/**
 * Light Theme - теплый, защищающий
 * Доминирующий Safety Orange с резкими акцентами
 */
export const lightThemeColors: SemanticColors = {
  background: {
    primary: ColorTokens.safety[50],      // Доминирующий теплый фон
    secondary: '#FFFFFF',
    tertiary: ColorTokens.safety[100],
    elevated: '#FFFFFF',
    warm: ColorTokens.alert[50],         // Теплый акцент
  },
  surface: {
    primary: '#FFFFFF',
    secondary: ColorTokens.safety[50],
    muted: ColorTokens.neutral[100],
    elevated: '#FFFFFF',
    accent: ColorTokens.safety[100],     // Акцентная поверхность
  },
  text: {
    primary: ColorTokens.neutral[950],   // Резкий контраст
    secondary: ColorTokens.neutral[700],
    tertiary: ColorTokens.neutral[600],
    inverse: '#FFFFFF',
    accent: ColorTokens.safety[700],     // Резкий акцент
    warm: ColorTokens.safety[800],       // Теплый текст
  },
  border: {
    primary: ColorTokens.neutral[200],
    secondary: ColorTokens.safety[200],
    muted: ColorTokens.neutral[100],
    accent: ColorTokens.safety[500],    // Резкий акцент
    warm: ColorTokens.alert[300],       // Теплая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],    // Доминирующий
    primaryHover: ColorTokens.safety[600],
    secondary: ColorTokens.trust[500],   // Резкий акцент (не фиолетовый!)
    secondaryHover: ColorTokens.trust[600],
    accent: ColorTokens.alert[500],     // Яркий акцент
    accentHover: ColorTokens.alert[600],
    safety: ColorTokens.safety[500],
    trust: ColorTokens.trust[500],
  },
  status: {
    safe: ColorTokens.care[600],
    warning: ColorTokens.alert[600],
    danger: ColorTokens.danger[600],
    info: ColorTokens.trust[600],
  },
};

/**
 * Dark Theme - глубокий, защищающий
 * Доминирующий темный с теплыми неоновыми акцентами
 */
export const darkThemeColors: SemanticColors = {
  background: {
    primary: ColorTokens.neutral[950],   // Доминирующий темный
    secondary: ColorTokens.neutral[900],
    tertiary: ColorTokens.neutral[800],
    elevated: ColorTokens.neutral[800],
    warm: ColorTokens.safety[900],       // Теплый акцент
  },
  surface: {
    primary: ColorTokens.neutral[900],
    secondary: ColorTokens.neutral[800],
    muted: ColorTokens.neutral[700],
    elevated: ColorTokens.neutral[800],
    accent: ColorTokens.safety[800],     // Акцентная поверхность
  },
  text: {
    primary: ColorTokens.neutral[50],    // Резкий контраст
    secondary: ColorTokens.neutral[300],
    tertiary: ColorTokens.neutral[500],
    inverse: ColorTokens.neutral[950],
    accent: ColorTokens.safety[400],     // Резкий неоновый акцент
    warm: ColorTokens.alert[400],        // Теплый неоновый текст
  },
  border: {
    primary: ColorTokens.neutral[700],
    secondary: ColorTokens.neutral[600],
    muted: ColorTokens.neutral[800],
    accent: ColorTokens.safety[500],     // Резкий неоновый акцент
    warm: ColorTokens.alert[500],       // Теплая неоновая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],    // Доминирующий
    primaryHover: ColorTokens.safety[400],
    secondary: ColorTokens.trust[500],   // Резкий акцент
    secondaryHover: ColorTokens.trust[400],
    accent: ColorTokens.alert[500],      // Яркий неоновый акцент
    accentHover: ColorTokens.alert[400],
    safety: ColorTokens.safety[500],
    trust: ColorTokens.trust[500],
  },
  status: {
    safe: ColorTokens.care[500],
    warning: ColorTokens.alert[500],
    danger: ColorTokens.danger[500],
    info: ColorTokens.trust[500],
  },
};

/**
 * Хелпер для получения цвета из токена
 */
export const getColor = (token: keyof typeof ColorTokens, shade: keyof typeof ColorTokens.safety): string => {
  return ColorTokens[token][shade];
};

/**
 * Хелпер для создания градиентов
 * Уникальные, не клишированные
 */
export const createGradient = (colors: string[]): string[] => colors;

/**
 * Уникальные градиенты для KIKU
 */
export const Gradients = {
  safety: [ColorTokens.safety[400], ColorTokens.safety[600]],
  trust: [ColorTokens.trust[400], ColorTokens.trust[600]],
  care: [ColorTokens.care[400], ColorTokens.care[600]],
  warm: [ColorTokens.alert[300], ColorTokens.safety[400]],
  danger: [ColorTokens.danger[400], ColorTokens.danger[600]],
};
