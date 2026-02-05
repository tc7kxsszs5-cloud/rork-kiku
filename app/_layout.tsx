import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { StyleSheet, Platform, View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MonitoringProvider } from "@/constants/MonitoringContext";
import { UserProvider } from "@/constants/UserContext";
import { ParentalControlsProvider } from "@/constants/ParentalControlsContext";
import { ThemeProvider } from "@/constants/ThemeContext";
import { NotificationsProvider } from "@/constants/NotificationsContext";
import { AgeComplianceProvider } from "@/constants/AgeComplianceContext";
import { ABTestingProvider } from "@/constants/ABTestingContext";
import * as AnalyticsContext from "@/constants/AnalyticsContext";
import { PersonalizedAIProvider } from "@/constants/PersonalizedAIContext";
import { GamificationProvider } from "@/constants/GamificationContext";
import { PredictiveAnalyticsProvider } from "@/constants/PredictiveAnalyticsContext";
import { AIParentingAssistantProvider } from "@/constants/AIParentingAssistantContext";
import { ReferralProgramProvider } from "@/constants/ReferralProgramContext";
import { SyncSettingsProvider } from "@/constants/SyncSettingsContext";
import { SecuritySettingsProvider } from "@/constants/SecuritySettingsContext";
import { PremiumProvider } from "@/constants/PremiumContext";
import { ChatBackgroundsProvider } from "@/constants/ChatBackgroundsContext";
import { AuthProvider, useAuth } from "@/constants/AuthContext";
import { ActivationTracker } from "@/components/ActivationTracker";
import { trpc, trpcClient } from "@/lib/trpc";
import "@/constants/i18n";
import { applyGlobalCursorStyles } from "@/utils/cursorStyles";
import { initializeTestCustomEmojis } from "@/utils/initCustomEmojis";

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
      // Only log in development
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
    // Import logger dynamically to avoid circular dependencies
    import('@/utils/logger').then(({ logger }) => {
      logger.critical('App error boundary caught error', error, { component: 'AppErrorBoundary', componentStack: info.componentStack });
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      const msg = this.state.message ?? 'Попробуйте обновить приложение.';
      if (__DEV__ && typeof console !== 'undefined') {
        console.error('[AppErrorBoundary]', msg);
      }
      return (
        <View style={styles.errorContainer} testID="app-error-boundary">
          <Text style={styles.errorTitle}>Что-то пошло не так</Text>
          <Text style={styles.errorMessage} numberOfLines={5}>{msg}</Text>
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
  const isAuthLoaded = authData?.isLoaded ?? false;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || !isAuthLoaded || !router || !Array.isArray(segments)) return;
    
    const currentRoute = String(segments[0] ?? '');
    const authRoutes = ['role-selection', 'register-parent', 'register-child'];
    const inAuthGroup = authRoutes.includes(currentRoute);

    // Не авторизован: всегда вести на выбор роли, кроме экранов регистрации
    if (!isAuthenticated) {
      if (!inAuthGroup) {
        const timer = setTimeout(() => {
          try {
            router.replace('/role-selection' as never);
          } catch (error) {
            console.error('[RootLayoutNav] Navigation error:', error);
          }
        }, 150);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Авторизован и на экране выбора роли или регистрации ребенка — вести в чаты
    // register-parent не редиректим: родитель должен успеть скопировать код
    if (isAuthenticated && (currentRoute === 'role-selection' || currentRoute === 'register-child')) {
      const timer = setTimeout(() => {
        try {
          router.replace('/(tabs)' as never);
        } catch (error) {
          console.error('[RootLayoutNav] Navigation to tabs error:', error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthLoaded, segments, router, isReady]);

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

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AppErrorBoundary>
          <ThemeProvider>
            <AgeComplianceProvider>
              <UserProvider>
                <AuthProvider>
                  <AnalyticsContext.AnalyticsProvider>
                    <PremiumProvider>
                      <ABTestingProvider>
                        <PersonalizedAIProvider>
                          <MonitoringProvider>
                            <ChatBackgroundsProvider>
                              <ParentalControlsProvider>
                              <GamificationProvider>
                              <PredictiveAnalyticsProvider>
                                <AIParentingAssistantProvider>
                                  <ReferralProgramProvider>
                                    <SyncSettingsProvider>
                                    <SecuritySettingsProvider>
                                      <NotificationsProvider>
                                        <ActivationTracker />
                                        {children}
                                      </NotificationsProvider>
                                    </SecuritySettingsProvider>
                                    </SyncSettingsProvider>
                                  </ReferralProgramProvider>
                                </AIParentingAssistantProvider>
                              </PredictiveAnalyticsProvider>
                              </GamificationProvider>
                              </ParentalControlsProvider>
                            </ChatBackgroundsProvider>
                          </MonitoringProvider>
                        </PersonalizedAIProvider>
                      </ABTestingProvider>
                    </PremiumProvider>
                  </AnalyticsContext.AnalyticsProvider>
                </AuthProvider>
              </UserProvider>
            </AgeComplianceProvider>
          </ThemeProvider>
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
        // Инициализация тестовых кастомных эмодзи
        // Не блокируем запуск, если инициализация не удалась
        await initializeTestCustomEmojis().catch((err) => {
          console.warn('[RootLayout] Custom emojis init failed (non-critical):', err);
        });
      } catch (error) {
        console.error('[RootLayout] Failed to initialize app:', error);
        // Не блокируем запуск приложения из-за ошибок инициализации
      }
    };

    // Для веб сразу помечаем как готово, инициализация идет в фоне
    if (Platform.OS === 'web') {
      setIsReady(true);
      // Запускаем инициализацию асинхронно, не блокируя запуск
      initializeApp();
      return;
    }
    
    // Для нативных платформ запускаем инициализацию
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
});
