/**
 * СУПЕР ЯРКАЯ цветовая система KIKU для детей (обновленная версия)
 * 
 * Принципы:
 * - ОЧЕНЬ яркие, веселые цвета для детской аудитории
 * - Максимально насыщенные цвета с резкими акцентами
 * - Контекстно-специфичные цвета для детской безопасности
 * - СУПЕР яркие, дружелюбные цвета для привлечения детей
 * 
 * Обновлено: Цвета сделаны еще более яркими и насыщенными для детской версии
 */

/**
 * Яркие цвета для детской безопасности
 * Яркие, веселые, привлекательные для детей
 */
export const ColorTokens = {
  // Safety Orange - СУПЕР ЯРКИЙ оранжевый для безопасности (детская версия)
  // Очень яркий, дружелюбный, привлекательный для детей
  safety: {
    50: '#FFF0E6',
    100: '#FFD4B8',
    200: '#FFB88A',
    300: '#FF9C5C',
    400: '#FF8042',
    500: '#FF6B35', // СУПЕР ЯРКИЙ оранжевый (более яркий чем раньше)
    600: '#FF5722',
    700: '#FF4500',
    800: '#FF3300',
    900: '#FF2200',
  },
  
  // Trust Blue - СУПЕР ЯРКИЙ голубой для доверия (детская версия)
  // Очень яркий, веселый, привлекательный для детей
  trust: {
    50: '#E6F4FF',
    100: '#B3DEFF',
    200: '#80C8FF',
    300: '#4DB2FF',
    400: '#1A9CFF',
    500: '#4A90E2', // СУПЕР ЯРКИЙ голубой (более яркий чем раньше)
    600: '#0080FF',
    700: '#0070E6',
    800: '#0060CC',
    900: '#0050B3',
  },
  
  // Care Green - СУПЕР ЯРКИЙ зеленый для заботы (детская версия)
  // Очень яркий, свежий, привлекательный для детей
  care: {
    50: '#E8FFE8',
    100: '#B3FFB3',
    200: '#7FFF7F',
    300: '#4CFF4C',
    400: '#19FF19',
    500: '#52C41A', // СУПЕР ЯРКИЙ зеленый лайм (более яркий)
    600: '#00E600',
    700: '#00CC00',
    800: '#00B300',
    900: '#009900',
  },
  
  // Alert Amber - СУПЕР ЯРКИЙ золотой для предупреждений (детская версия)
  // Очень яркий, заметный, веселый для детей
  alert: {
    50: '#FFFBE6',
    100: '#FFF5B3',
    200: '#FFEF80',
    300: '#FFE94D',
    400: '#FFE31A',
    500: '#FFD700', // СУПЕР ЯРКИЙ золотой (более яркий)
    600: '#FFC700',
    700: '#FFB700',
    800: '#FFA700',
    900: '#FF9700',
  },
  
  // Danger Red - СУПЕР ЯРКИЙ красный для критических рисков (детская версия)
  // Очень яркий, заметный, но дружелюбный для детей
  danger: {
    50: '#FFE6E6',
    100: '#FFB3B3',
    200: '#FF8080',
    300: '#FF4D4D',
    400: '#FF1A1A',
    500: '#FF1744', // СУПЕР ЯРКИЙ красный (более яркий и насыщенный)
    600: '#FF0033',
    700: '#E6002E',
    800: '#CC0029',
    900: '#B30024',
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
    primary: ColorTokens.safety[50],      // СУПЕР ЯРКИЙ теплый фон для детей
    secondary: '#FFFFFF',
    tertiary: ColorTokens.alert[50],      // СУПЕР ЯРКИЙ золотой оттенок
    elevated: '#FFFFFF',
    warm: ColorTokens.alert[100],         // СУПЕР ЯРКИЙ теплый акцент
  },
  surface: {
    primary: '#FFFFFF',
    secondary: ColorTokens.safety[50],    // Яркий оранжевый оттенок
    muted: ColorTokens.neutral[100],
    elevated: '#FFFFFF',
    accent: ColorTokens.safety[100],      // СУПЕР ЯРКАЯ акцентная поверхность
  },
  text: {
    primary: ColorTokens.neutral[900],    // Четкий контраст
    secondary: ColorTokens.neutral[700],
    tertiary: ColorTokens.neutral[600],
    inverse: '#FFFFFF',
    accent: ColorTokens.safety[500],      // СУПЕР ЯРКИЙ акцент (более яркий)
    warm: ColorTokens.safety[600],        // СУПЕР ЯРКИЙ теплый текст
  },
  border: {
    primary: ColorTokens.neutral[300],
    secondary: ColorTokens.safety[300],   // Более яркая граница
    muted: ColorTokens.neutral[200],
    accent: ColorTokens.safety[500],      // СУПЕР ЯРКИЙ акцент
    warm: ColorTokens.alert[400],         // СУПЕР ЯРКАЯ теплая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],     // СУПЕР ЯРКИЙ доминирующий (#FF6B35)
    primaryHover: ColorTokens.safety[600],
    secondary: ColorTokens.trust[500],    // СУПЕР ЯРКИЙ акцент (#4A90E2)
    secondaryHover: ColorTokens.trust[600],
    accent: ColorTokens.alert[500],       // СУПЕР ЯРКИЙ акцент (#FFD700)
    accentHover: ColorTokens.alert[600],
    safety: ColorTokens.safety[500],      // СУПЕР ЯРКИЙ
    trust: ColorTokens.trust[500],        // СУПЕР ЯРКИЙ
  },
  status: {
    safe: ColorTokens.care[500],          // СУПЕР ЯРКИЙ зеленый (#52C41A)
    warning: ColorTokens.alert[500],      // СУПЕР ЯРКИЙ золотой (#FFD700)
    danger: ColorTokens.danger[500],      // СУПЕР ЯРКИЙ красный (#FF1744)
    info: ColorTokens.trust[500],         // СУПЕР ЯРКИЙ синий (#4A90E2)
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
    warm: ColorTokens.safety[800],       // СУПЕР ЯРКИЙ теплый акцент
  },
  surface: {
    primary: ColorTokens.neutral[900],
    secondary: ColorTokens.neutral[800],
    muted: ColorTokens.neutral[700],
    elevated: ColorTokens.neutral[800],
    accent: ColorTokens.safety[700],     // СУПЕР ЯРКАЯ акцентная поверхность
  },
  text: {
    primary: ColorTokens.neutral[50],    // Резкий контраст
    secondary: ColorTokens.neutral[300],
    tertiary: ColorTokens.neutral[500],
    inverse: ColorTokens.neutral[950],
    accent: ColorTokens.safety[400],     // СУПЕР ЯРКИЙ неоновый акцент
    warm: ColorTokens.alert[400],        // СУПЕР ЯРКИЙ неоновый текст
  },
  border: {
    primary: ColorTokens.neutral[700],
    secondary: ColorTokens.neutral[600],
    muted: ColorTokens.neutral[800],
    accent: ColorTokens.safety[500],     // СУПЕР ЯРКИЙ неоновый акцент
    warm: ColorTokens.alert[500],       // СУПЕР ЯРКАЯ неоновая граница
  },
  interactive: {
    primary: ColorTokens.safety[500],    // СУПЕР ЯРКИЙ доминирующий (#FF6B35)
    primaryHover: ColorTokens.safety[400],
    secondary: ColorTokens.trust[500],   // СУПЕР ЯРКИЙ акцент (#4A90E2)
    secondaryHover: ColorTokens.trust[400],
    accent: ColorTokens.alert[500],      // СУПЕР ЯРКИЙ неоновый акцент (#FFD700)
    accentHover: ColorTokens.alert[400],
    safety: ColorTokens.safety[500],     // СУПЕР ЯРКИЙ
    trust: ColorTokens.trust[500],       // СУПЕР ЯРКИЙ
  },
  status: {
    safe: ColorTokens.care[500],         // СУПЕР ЯРКИЙ зеленый (#52C41A)
    warning: ColorTokens.alert[500],     // СУПЕР ЯРКИЙ золотой (#FFD700)
    danger: ColorTokens.danger[500],     // СУПЕР ЯРКИЙ красный (#FF1744)
    info: ColorTokens.trust[500],        // СУПЕР ЯРКИЙ синий (#4A90E2)
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
 * Уникальные СУПЕР ЯРКИЕ градиенты для KIKU (детская версия)
 */
export const Gradients = {
  safety: [ColorTokens.safety[400], ColorTokens.safety[600]],  // Яркий оранжевый градиент
  trust: [ColorTokens.trust[400], ColorTokens.trust[600]],      // Яркий голубой градиент
  care: [ColorTokens.care[400], ColorTokens.care[600]],         // Яркий зеленый градиент
  warm: [ColorTokens.alert[300], ColorTokens.safety[400]],      // Яркий золотой-оранжевый градиент
  danger: [ColorTokens.danger[400], ColorTokens.danger[600]],   // Яркий красный градиент
};
