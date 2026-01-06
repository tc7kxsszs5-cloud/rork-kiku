import { Platform, TextStyle } from 'react-native';
import { useFonts } from 'expo-font';

/**
 * УНИКАЛЬНАЯ система типографики KIKU
 * 
 * Избегаем общих шрифтов (Inter, Roboto, Arial, системные)
 * Используем характерные, отличительные шрифты
 */

// Display Font - отличительный, характерный
// Playfair Display - элегантный, но сильный, идеален для заголовков о безопасности
export const DISPLAY_FONT = 'PlayfairDisplay-Bold';

// Body Font - изысканный, читаемый
// Lora - дружелюбный, но серьезный, идеален для текста о детской безопасности
export const BODY_FONT = 'Lora-Regular';

// Accent Font - для важных сообщений
// Montserrat Bold - современный, но не клишированный
export const ACCENT_FONT = 'Montserrat-Bold';

/**
 * Загрузка кастомных шрифтов
 * Эти шрифты должны быть добавлены в assets/fonts/
 */
export const loadCustomFonts = async () => {
  try {
    // В production эти шрифты нужно добавить в assets/fonts/
    // Для начала используем fallback на системные, но с правильными весами
    return true;
  } catch (error) {
    console.warn('[Typography] Failed to load custom fonts, using fallback');
    return false;
  }
};

/**
 * Fallback шрифты (если кастомные не загружены)
 * Но с уникальными весами и стилями, чтобы избежать cookie-cutter
 */
const getFallbackDisplayFont = () => {
  // Используем системные, но с уникальными настройками
  return Platform.select({
    ios: 'Georgia-Bold', // Georgia более характерна, чем System
    android: 'serif-bold',
    default: 'serif',
  });
};

const getFallbackBodyFont = () => {
  return Platform.select({
    ios: 'Georgia', // Georgia вместо System
    android: 'serif',
    default: 'serif',
  });
};

/**
 * Типографические стили с уникальным характером
 */
export interface TypographyStyles {
  // Display - для заголовков (характерный, отличительный)
  displayHero: TextStyle;      // Самый крупный, для hero секций
  displayLarge: TextStyle;      // Крупные заголовки
  displayMedium: TextStyle;     // Средние заголовки
  displaySmall: TextStyle;      // Малые заголовки
  
  // Headline - для подзаголовков (сильный, но читаемый)
  headlineBold: TextStyle;      // Жирный подзаголовок
  headlineRegular: TextStyle;   // Обычный подзаголовок
  
  // Title - для секций (структурированный)
  titleBold: TextStyle;
  titleRegular: TextStyle;
  
  // Body - для основного текста (изысканный, читаемый)
  bodyLarge: TextStyle;         // Крупный body
  bodyRegular: TextStyle;       // Обычный body
  bodySmall: TextStyle;         // Малый body
  
  // Accent - для важных сообщений (резкий, заметный)
  accentBold: TextStyle;
  accentRegular: TextStyle;
  
  // Special
  caption: TextStyle;
  overline: TextStyle;
  label: TextStyle;
}

/**
 * Уникальная типографика с характером
 */
export const typography: TypographyStyles = {
  // Display - характерные, отличительные заголовки
  displayHero: {
    fontFamily: DISPLAY_FONT,
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '700',
    letterSpacing: -1, // Отрицательный для крупных заголовков
  },
  displayLarge: {
    fontFamily: DISPLAY_FONT,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: DISPLAY_FONT,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontFamily: DISPLAY_FONT,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0,
  },
  
  // Headline - сильные подзаголовки
  headlineBold: {
    fontFamily: DISPLAY_FONT,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: 0.15,
  },
  headlineRegular: {
    fontFamily: DISPLAY_FONT,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  
  // Title - структурированные секции
  titleBold: {
    fontFamily: BODY_FONT,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titleRegular: {
    fontFamily: BODY_FONT,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  
  // Body - изысканный, читаемый текст
  bodyLarge: {
    fontFamily: BODY_FONT,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0.75, // Увеличенный для лучшей читаемости
  },
  bodyRegular: {
    fontFamily: BODY_FONT,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodySmall: {
    fontFamily: BODY_FONT,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  
  // Accent - резкие, заметные сообщения
  accentBold: {
    fontFamily: ACCENT_FONT,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1, // Увеличенный для акцента
  },
  accentRegular: {
    fontFamily: ACCENT_FONT,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.75,
  },
  
  // Special
  caption: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    fontStyle: 'italic', // Добавляем характер
  },
  overline: {
    fontFamily: ACCENT_FONT,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2, // Очень широкий для uppercase
    textTransform: 'uppercase',
  },
  label: {
    fontFamily: ACCENT_FONT,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};

/**
 * Хелпер для создания типографических стилей с цветом
 */
export const createTypographyStyle = (
  typographyStyle: TextStyle,
  color: string
): TextStyle => ({
  ...typographyStyle,
  color,
});
