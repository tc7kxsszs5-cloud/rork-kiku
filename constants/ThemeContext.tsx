import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'sunrise' | 'midnight';

export interface ThemePalette {
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
}

const THEME_STORAGE_KEY = '@theme_mode_preference';

const THEMES: Record<ThemeMode, ThemePalette> = {
  sunrise: {
    backgroundPrimary: '#fff9e6',
    backgroundSecondary: '#ffe8b5',
    card: '#ffffff',
    cardMuted: '#fff7e0',
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    accentPrimary: '#fbbf24',
    accentMuted: '#fde68a',
    borderSoft: '#f4d159',
    headerBackground: '#ffffff',
    headerText: '#0f172a',
    tabBarBackground: '#ffffff',
    tabBarActive: '#facc15',
    tabBarInactive: '#8f8f8f',
    heroGradient: ['#fff4d7', '#ffe4c4'],
    surfaceGradient: ['#ffd700', '#ffe9a7'],
    chipBackground: '#fff2c2',
    chipText: '#7c2d12',
    isDark: false,
  },
  midnight: {
    backgroundPrimary: '#0b1220',
    backgroundSecondary: '#111b2e',
    card: '#111b2e',
    cardMuted: '#1c2942',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5f5',
    accentPrimary: '#facc15',
    accentMuted: '#7c3aed',
    borderSoft: '#1f2937',
    headerBackground: '#0f172a',
    headerText: '#f8fafc',
    tabBarBackground: '#0f172a',
    tabBarActive: '#fbbf24',
    tabBarInactive: '#94a3b8',
    heroGradient: ['#111b2e', '#0b1220'],
    surfaceGradient: ['#1f2937', '#0f172a'],
    chipBackground: '#1f2937',
    chipText: '#f8fafc',
    isDark: true,
  },
};

const THEME_OPTIONS: { value: ThemeMode; label: string; description: string }[] = [
  {
    value: 'sunrise',
    label: 'Светлый',
    description: 'Теплый дневной фон и яркие акценты',
  },
  {
    value: 'midnight',
    label: 'Ночной',
    description: 'Контролируемый контраст и неоновые детали',
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
          console.log('[ThemeContext] Loaded mode from storage', storedMode);
        }
      } catch (error) {
        console.error('[ThemeContext] Failed to load theme mode', error);
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
      persistMode(mode).catch((error) => console.error(error));
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
