import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { lightThemeColors, darkThemeColors, SemanticColors } from './ColorSystem';
import { logger } from '@/utils/logger';

export type ThemeMode = 'sunrise' | 'midnight';

/**
 * Расширенная палитра темы с улучшенной цветовой системой
 */
export interface ThemePalette extends SemanticColors {
  // Legacy поддержка (для обратной совместимости)
  backgroundPrimary: string;
  backgroundSecondary: string;
  card: string;
  cardMuted: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentMuted: string;
  borderSoft: string;
  headerBackground: string;
  headerText: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  heroGradient: [string, string];
  surfaceGradient: [string, string];
  chipBackground: string;
  chipText: string;
  isDark: boolean;
  // Удобные алиасы для часто используемых цветов
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

const THEME_STORAGE_KEY = '@theme_mode_preference';

/**
 * Создание полной палитры темы из семантических цветов
 */
const createThemePalette = (semanticColors: SemanticColors, isDark: boolean): ThemePalette => {
  return {
    ...semanticColors,
    // Legacy поддержка
    backgroundPrimary: semanticColors.background.primary,
    backgroundSecondary: semanticColors.background.secondary,
    card: semanticColors.surface.primary,
    cardMuted: semanticColors.surface.muted,
    textPrimary: semanticColors.text.primary,
    textSecondary: semanticColors.text.secondary,
    accentPrimary: semanticColors.interactive.primary,
    accentMuted: semanticColors.interactive.secondary,
    borderSoft: semanticColors.border.muted,
    headerBackground: semanticColors.surface.elevated,
    headerText: semanticColors.text.primary,
    tabBarBackground: semanticColors.surface.elevated,
    tabBarActive: semanticColors.interactive.primary,
    tabBarInactive: semanticColors.text.tertiary,
    heroGradient: [semanticColors.background.primary, semanticColors.background.secondary],
    surfaceGradient: [semanticColors.surface.primary, semanticColors.surface.secondary],
    chipBackground: semanticColors.surface.secondary,
    chipText: semanticColors.text.primary,
    isDark,
    // Удобные алиасы
    primary: semanticColors.interactive.primary,
    success: semanticColors.status.safe,
    warning: semanticColors.status.warning,
    danger: semanticColors.status.danger,
  };
};

const THEMES: Record<ThemeMode, ThemePalette> = {
  sunrise: createThemePalette(lightThemeColors, false),
  midnight: createThemePalette(darkThemeColors, true),
};

// Уникальные названия тем с контекстом детской безопасности
const THEME_OPTIONS: { value: ThemeMode; label: string; description: string }[] = [
  {
    value: 'sunrise',
    label: 'Теплый день',
    description: 'Теплый защищающий фон с яркими акцентами безопасности',
  },
  {
    value: 'midnight',
    label: 'Ночной режим',
    description: 'Глубокий темный фон с теплыми неоновыми акцентами',
  },
];

interface ThemeContextValue {
  themeMode: ThemeMode;
  theme: ThemePalette;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  themeOptions: typeof THEME_OPTIONS;
  isReady: boolean;
}

export const [ThemeProvider, useThemeMode] = createContextHook<ThemeContextValue>(() => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('sunrise');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadTheme = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedMode && (storedMode === 'sunrise' || storedMode === 'midnight') && isMounted) {
          setThemeModeState(storedMode);
          logger.info('Loaded mode from storage', { context: 'ThemeContext', action: 'loadTheme', mode: storedMode });
        }
      } catch (error) {
        logger.error('Failed to load theme mode', error instanceof Error ? error : new Error(String(error)), { context: 'ThemeContext', action: 'loadTheme' });
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      console.log('[ThemeContext] Persisted theme mode', mode);
    } catch (error) {
      console.error('[ThemeContext] Failed to persist theme mode', error);
    }
  }, []);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState((current) => (current === mode ? current : mode));
      persistMode(mode).catch((error) => logger.error('Failed to persist theme mode in setThemeMode', error instanceof Error ? error : new Error(String(error)), { context: 'ThemeContext', action: 'setThemeMode', mode }));
    },
    [persistMode],
  );

  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === 'sunrise' ? 'midnight' : 'sunrise');
  }, [setThemeMode, themeMode]);

  const value = useMemo<ThemeContextValue>(() => ({
    themeMode,
    theme: THEMES[themeMode],
    setThemeMode,
    toggleThemeMode,
    themeOptions: THEME_OPTIONS,
    isReady,
  }), [themeMode, setThemeMode, toggleThemeMode, isReady]);

  return value;
});
