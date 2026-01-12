/**
 * ЯРКАЯ цветовая система KIKU для детей
 * 
 * Принципы:
 * - Яркие, веселые цвета для детской аудитории
 * - Доминирующие цвета с резкими акцентами
 * - Контекстно-специфичные цвета для детской безопасности
 * - Яркие, дружелюбные цвета
 */

/**
 * Яркие цвета для детской безопасности
 * Яркие, веселые, привлекательные для детей
 */
export const ColorTokens = {
  // Safety Orange - яркий оранжевый для безопасности
  // Яркий, дружелюбный, привлекательный
  safety: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Яркий основной цвет безопасности
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  
  // Trust Blue - яркий синий для доверия
  // Яркий, веселый, привлекательный
  trust: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Яркий основной цвет доверия
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Care Green - яркий зеленый для заботы
  // Яркий, свежий, привлекательный
  care: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Яркий основной цвет заботы
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  // Alert Amber - яркий желтый для предупреждений
  // Яркий, заметный, веселый
  alert: {
    50: '#FFFDE7',
    100: '#FFF9C4',
    200: '#FFF59D',
    300: '#FFF176',
    400: '#FFEE58',
    500: '#FFEB3B', // Яркий основной цвет предупреждения
    600: '#FDD835',
    700: '#FBC02D',
    800: '#F9A825',
    900: '#F57F17',
  },
  
  // Danger Red - яркий красный для критических рисков
  // Яркий, заметный, но дружелюбный
  danger: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336', // Яркий основной цвет опасности
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  
  // Neutral - для текста и фонов
  // Яркие, чистые нейтральные цвета
  neutral: {
    50: '#FFFFFF',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#000000',
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
 * Light Theme - яркий, дружелюбный для детей
 * Яркие цвета с насыщенными акцентами
 */
export const lightThemeColors: SemanticColors = {
  background: {
    primary: ColorTokens.safety[50],      // Яркий теплый фон
    secondary: '#FFFFFF',
    tertiary: ColorTokens.alert[50],      // Яркий желтый оттенок
    elevated: '#FFFFFF',
    warm: ColorTokens.alert[100],         // Яркий теплый акцент
  },
  surface: {
    primary: '#FFFFFF',
    secondary: ColorTokens.safety[50],
    muted: ColorTokens.neutral[100],
    elevated: '#FFFFFF',
    accent: ColorTokens.safety[100],      // Яркая акцентная поверхность
  },
  text: {
    primary: ColorTokens.neutral[900],    // Четкий контраст
    secondary: ColorTokens.neutral[700],
    tertiary: ColorTokens.neutral[600],
    inverse: '#FFFFFF',
    accent: ColorTokens.safety[600],      // Яркий акцент
    warm: ColorTokens.safety[700],        // Яркий теплый текст
  },
  border: {
    primary: ColorTokens.neutral[300],
    secondary: ColorTokens.safety[300],
    muted: ColorTokens.neutral[200],
    accent: ColorTokens.safety[500],      // Яркий акцент
    warm: ColorTokens.alert[400],         // Яркая теплая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],     // Яркий доминирующий
    primaryHover: ColorTokens.safety[600],
    secondary: ColorTokens.trust[500],    // Яркий акцент
    secondaryHover: ColorTokens.trust[600],
    accent: ColorTokens.alert[500],       // Яркий акцент
    accentHover: ColorTokens.alert[600],
    safety: ColorTokens.safety[500],
    trust: ColorTokens.trust[500],
  },
  status: {
    safe: ColorTokens.care[500],          // Яркий зеленый
    warning: ColorTokens.alert[500],      // Яркий желтый
    danger: ColorTokens.danger[500],      // Яркий красный
    info: ColorTokens.trust[500],         // Яркий синий
  },
};

/**
 * Dark Theme - глубокий с яркими акцентами
 * Доминирующий темный с яркими неоновыми акцентами для детей
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
    accent: ColorTokens.safety[400],     // Яркий неоновый акцент
    warm: ColorTokens.alert[400],        // Яркий неоновый текст
  },
  border: {
    primary: ColorTokens.neutral[700],
    secondary: ColorTokens.neutral[600],
    muted: ColorTokens.neutral[800],
    accent: ColorTokens.safety[500],     // Яркий неоновый акцент
    warm: ColorTokens.alert[500],       // Яркая неоновая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],    // Яркий доминирующий
    primaryHover: ColorTokens.safety[400],
    secondary: ColorTokens.trust[500],   // Яркий акцент
    secondaryHover: ColorTokens.trust[400],
    accent: ColorTokens.alert[500],      // Яркий неоновый акцент
    accentHover: ColorTokens.alert[400],
    safety: ColorTokens.safety[500],
    trust: ColorTokens.trust[500],
  },
  status: {
    safe: ColorTokens.care[500],         // Яркий зеленый
    warning: ColorTokens.alert[500],      // Яркий желтый
    danger: ColorTokens.danger[500],      // Яркий красный
    info: ColorTokens.trust[500],         // Яркий синий
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
