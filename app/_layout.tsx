import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
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
import { AnalyticsProvider } from "@/constants/AnalyticsContext";
import { AgeComplianceProvider } from "@/constants/AgeComplianceContext";
import { ABTestingProvider } from "@/constants/ABTestingContext";
import { PersonalizedAIProvider } from "@/constants/PersonalizedAIContext";
import { GamificationProvider } from "@/constants/GamificationContext";
import { PredictiveAnalyticsProvider } from "@/constants/PredictiveAnalyticsContext";
import { AIParentingAssistantProvider } from "@/constants/AIParentingAssistantContext";
import { ReferralProgramProvider } from "@/constants/ReferralProgramContext";
import { SyncSettingsProvider } from "@/constants/SyncSettingsContext";
import { SecuritySettingsProvider } from "@/constants/SecuritySettingsContext";
import { trpc, trpcClient } from "@/lib/trpc";
import "@/constants/i18n";
import { applyGlobalCursorStyles } from "@/utils/cursorStyles";

// Применяем пользовательские курсоры для web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  applyGlobalCursorStyles();
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
    console.log('[HeaderBackButton] Back pressed. canGoBack=', router.canGoBack(), 'forceFallback=', forceFallback);
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
    console.error('[AppErrorBoundary] Caught error', error, info);
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
                <AnalyticsProvider>
                  <ABTestingProvider>
                    <PersonalizedAIProvider>
                      <MonitoringProvider>
                        <ParentalControlsProvider>
                          <GamificationProvider>
                            <PredictiveAnalyticsProvider>
                              <AIParentingAssistantProvider>
                                <ReferralProgramProvider>
                                  <SyncSettingsProvider>
                                    <SecuritySettingsProvider>
                                      <NotificationsProvider>
                                        {children}
                                      </NotificationsProvider>
                                    </SecuritySettingsProvider>
                                  </SyncSettingsProvider>
                                </ReferralProgramProvider>
                              </AIParentingAssistantProvider>
                            </PredictiveAnalyticsProvider>
                          </GamificationProvider>
                        </ParentalControlsProvider>
                      </MonitoringProvider>
                    </PersonalizedAIProvider>
                  </ABTestingProvider>
                </AnalyticsProvider>
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
    if (Platform.OS === 'web') {
      return;
    }

    let isMounted = true;

    SplashScreen.hideAsync()
      .catch((error) => {
        console.error('[RootLayout] Failed to hide splash screen', error);
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
