/**
 * ОПТИМИЗИРОВАННАЯ ВЕРСИЯ _layout.tsx
 * 
 * Оптимизации:
 * 1. Объединены связанные провайдеры
 * 2. Lazy loading для необязательных провайдеров
 * 3. Оптимизирован порядок инициализации
 * 
 * Ожидаемый эффект:
 * - Уменьшение времени запуска на 30-50%
 * - Уменьшение initial bundle size
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { ReactNode, useEffect, useMemo, useState, Suspense } from "react";
import { StyleSheet, Platform, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { trpc, trpcClient } from "@/lib/trpc";
import "@/constants/i18n";
import { applyGlobalCursorStyles } from "@/utils/cursorStyles";
import { initializeTestCustomEmojis } from "@/utils/initCustomEmojis";
import { BaseProviders, FunctionalProviders, LazyAIProviders, LazyOptionalProviders } from "@/constants/CombinedProviders";
import { ActivationTracker } from "@/components/ActivationTracker";
import { useAuth } from "@/constants/AuthContext";

// Применяем пользовательские курсоры для web
try {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    applyGlobalCursorStyles();
  }
} catch (error) {
  console.warn('[RootLayout] Failed to apply cursor styles:', error);
}

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // Оптимизация для веб: кэширование и ленивая загрузка
      ...(Platform.OS === 'web' && {
        gcTime: 10 * 60 * 1000, // 10 минут кэш
        refetchOnReconnect: false,
      }),
    },
    mutations: {
      retry: false,
    },
  },
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

function HeaderBackButton({ fallbackHref, forceFallback }: { fallbackHref: string; forceFallback?: boolean }) {
  const router = useRouter();

  const handlePress = () => {
    if (__DEV__) {
      import('@/utils/logger').then(({ logger }) => {
        logger.debug('Back button pressed', { component: 'HeaderBackButton', canGoBack: router.canGoBack(), forceFallback });
      });
    }
    if (!forceFallback && router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackHref as never);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.headerBackButton}
      testID="header-back-button"
      accessibilityRole="button"
      accessibilityLabel="Назад"
    >
      <ChevronLeft size={22} color={styles.headerBackIcon.color} />
      <Text style={styles.headerBackText}>Назад</Text>
    </TouchableOpacity>
  );
}

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    import('@/utils/logger').then(({ logger }) => {
      logger.critical('App error boundary caught error', error, { component: 'AppErrorBoundary', componentStack: info.componentStack });
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer} testID="app-error-boundary">
          <Text style={styles.errorTitle}>Что-то пошло не так</Text>
          <Text style={styles.errorMessage}>{this.state.message ?? 'Попробуйте обновить приложение.'}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={this.handleReset} testID="app-error-boundary-reset">
            <Text style={styles.errorButtonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

function RootLayoutNav() {
  const [isReady, setIsReady] = useState(false);
  
  const authData = useAuth();
  const isAuthenticated = authData?.isAuthenticated || false;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    if (!isAuthenticated) {
      const currentRoute = String(segments?.[0] || '');
      const authRoutes = ['role-selection', 'register-parent', 'register-child'];
      const inAuthGroup = authRoutes.includes(currentRoute);
      const isDevMode = __DEV__;
      const isOnTabs = currentRoute === '(tabs)';
      
      if (!inAuthGroup && !isOnTabs && router) {
        const timer = setTimeout(() => {
          try {
            router.replace('/role-selection' as any);
          } catch (error) {
            console.error('[RootLayoutNav] Navigation error:', error);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
      
      if (isDevMode && isOnTabs) {
        return;
      }
    }
  }, [isAuthenticated, segments, router, isReady]);

  const securityHeaderLeft = useMemo(() => {
    const HeaderLeftComponent = () => <HeaderBackButton fallbackHref="/(tabs)" forceFallback />;
    HeaderLeftComponent.displayName = 'SecuritySettingsHeaderLeft';
    return HeaderLeftComponent;
  }, []);

  return (
    <Stack screenOptions={{ headerBackTitle: "Назад" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="chat/[chatId]" 
        options={{ 
          headerShown: true,
          presentation: 'card',
        }} 
      />
      <Stack.Screen
        name="security-settings"
        options={{
          title: "Центр безопасности",
          presentation: 'card',
          headerLeft: securityHeaderLeft,
        }}
      />
      <Stack.Screen
        name="ai-recommendations"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="role-selection"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="register-parent"
        options={{
          title: "Регистрация родителя",
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="register-child"
        options={{
          title: "Регистрация ребенка",
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="status"
        options={{
          title: "Статусы",
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="call"
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
    </Stack>
  );
}

/**
 * Loading fallback для lazy провайдеров
 */
function LazyProviderFallback() {
  return (
    <View style={styles.lazyFallback}>
      <ActivityIndicator size="small" color="#4A90E2" />
    </View>
  );
}

/**
 * ОПТИМИЗИРОВАННЫЕ ПРОВАЙДЕРЫ
 * 
 * Структура:
 * 1. Базовые (критичные) - загружаются сразу
 * 2. Функциональные - загружаются после базовых
 * 3. AI провайдеры - lazy loading
 * 4. Опциональные - lazy loading
 */
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AppErrorBoundary>
          <BaseProviders>
            <FunctionalProviders>
              <Suspense fallback={<LazyProviderFallback />}>
                <LazyAIProviders>
                  <Suspense fallback={<LazyProviderFallback />}>
                    <LazyOptionalProviders>
                      <ActivationTracker />
                      {children}
                    </LazyOptionalProviders>
                  </Suspense>
                </LazyAIProviders>
              </Suspense>
            </FunctionalProviders>
          </BaseProviders>
        </AppErrorBoundary>
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        await initializeTestCustomEmojis().catch((err) => {
          console.warn('[RootLayout] Custom emojis init failed (non-critical):', err);
        });
      } catch (error) {
        console.error('[RootLayout] Failed to initialize app:', error);
      }
    };

    if (Platform.OS === 'web') {
      setIsReady(true);
      initializeApp();
      return;
    }
    
    initializeApp();

    SplashScreen.hideAsync()
      .catch((error) => {
        import('@/utils/logger').then(({ logger }) => {
          logger.error('Failed to hide splash screen', error instanceof Error ? error : new Error(String(error)), { component: 'RootLayout', action: 'hideSplashScreen' });
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AppProviders>
      <GestureHandlerRootView style={styles.container}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#f8fafc',
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  errorMessage: {
    fontSize: 16,
    color: '#cbd5f5',
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#facc15',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0f172a',
    textTransform: 'uppercase' as const,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
    gap: 4,
    backgroundColor: 'rgba(148,163,184,0.16)',
  },
  headerBackIcon: {
    color: '#0f172a',
  },
  headerBackText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#0f172a',
  },
  lazyFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
