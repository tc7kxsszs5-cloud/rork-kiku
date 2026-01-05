import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { ReactNode, useEffect, useMemo, useState, useCallback, memo } from "react";
import { StyleSheet, Platform, View, Text, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MonitoringProvider } from "@/constants/MonitoringContext";
import { UserProvider } from "@/constants/UserContext";
import { ParentalControlsProvider } from "@/constants/ParentalControlsContext";
import { ThemeProvider } from "@/constants/ThemeContext";
import { NotificationsProvider } from "@/constants/NotificationsContext";
import { trpc, trpcClient } from "@/lib/trpc";
import "@/constants/i18n";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

// Optimize QueryClient - create once and reuse (singleton pattern)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // Prevent duplicate requests
      refetchOnReconnect: false,
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
  errorStack?: string;
  errorCount: number;
}

// Memoized HeaderBackButton to prevent unnecessary re-renders
const HeaderBackButton = memo(({ fallbackHref, forceFallback }: { fallbackHref: string; forceFallback?: boolean }) => {
  const router = useRouter();

  // Use useCallback to prevent function recreation on every render
  const handlePress = useCallback(() => {
    console.log('[HeaderBackButton] Back pressed. canGoBack=', router.canGoBack(), 'forceFallback=', forceFallback);
    if (!forceFallback && router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(fallbackHref as never);
  }, [router, fallbackHref, forceFallback]);

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
});

HeaderBackButton.displayName = 'HeaderBackButton';

class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Sanitize error message to prevent sensitive data leakage
    const sanitizedMessage = error?.message
      ? error.message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Remove emails
          .replace(/\b\d{10,}\b/g, '[NUMBER]') // Remove long numbers
          .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, '[TOKEN]') // Remove tokens
      : undefined;

    return { 
      hasError: true, 
      message: sanitizedMessage,
      errorCount: 1,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Enhanced error logging with security considerations
    const errorInfo = {
      message: error.message,
      // Only log first line of stack to avoid exposing file paths
      stack: error.stack?.split('\n')[0] || 'No stack trace',
      componentStack: info.componentStack?.split('\n').slice(0, 3).join('\n') || 'No component stack',
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
    };

    console.error('[AppErrorBoundary] Caught error:', errorInfo);

    // Prevent infinite error loops
    if (this.state.errorCount > 3) {
      console.error('[AppErrorBoundary] Too many errors, stopping boundary');
      return;
    }

    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }));
  }

  private handleReset = () => {
    console.log('[AppErrorBoundary] Resetting error boundary');
    this.setState({ 
      hasError: false, 
      message: undefined,
      errorStack: undefined,
      errorCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      // Show generic error if too many errors occurred
      const displayMessage = this.state.errorCount > 3
        ? 'Произошла критическая ошибка. Пожалуйста, перезапустите приложение.'
        : (this.state.message ?? 'Попробуйте обновить приложение.');

      return (
        <View style={styles.errorContainer} testID="app-error-boundary">
          <Text style={styles.errorTitle}>Что-то пошло не так</Text>
          <Text style={styles.errorMessage}>{displayMessage}</Text>
          {this.state.errorCount <= 3 && (
            <TouchableOpacity style={styles.errorButton} onPress={this.handleReset} testID="app-error-boundary-reset">
              <Text style={styles.errorButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
          )}
          {this.state.errorCount > 3 && (
            <Text style={[styles.errorMessage, { marginTop: 16, fontSize: 14 }]}>
              Пожалуйста, закройте и перезапустите приложение
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

// Memoize RootLayoutNav to prevent unnecessary re-renders
const RootLayoutNav = memo(() => {
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
});

RootLayoutNav.displayName = 'RootLayoutNav';

// Memoize AppProviders to prevent unnecessary provider re-renders
const AppProviders = memo(({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <AppErrorBoundary>
          <ThemeProvider>
            <UserProvider>
              <NotificationsProvider>
                <ParentalControlsProvider>
                  <MonitoringProvider>
                    {children}
                  </MonitoringProvider>
                </ParentalControlsProvider>
              </NotificationsProvider>
            </UserProvider>
          </ThemeProvider>
        </AppErrorBoundary>
      </trpc.Provider>
    </QueryClientProvider>
  );
});

AppProviders.displayName = 'AppProviders';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Add timeout as fallback in case splash screen hide fails
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('[RootLayout] Failed to hide splash screen:', error);
        // Still set ready even if splash screen fails
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    // Start hiding splash screen
    hideSplash();

    // Fallback timeout to ensure app becomes ready even if splash screen fails
    timeoutId = setTimeout(() => {
      if (isMounted && !isReady) {
        console.warn('[RootLayout] Splash screen timeout, forcing ready state');
        setIsReady(true);
      }
    }, 3000);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isReady]);

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
