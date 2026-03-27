/**
 * Sentry Configuration for KIKU
 * Error tracking and performance monitoring.
 * Optional: install @sentry/react-native to enable. Without it, all exports are no-ops.
 */

import Constants from 'expo-constants';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.EXPO_PUBLIC_SENTRY_DSN;

// Optional Sentry: only used when package is installed
let Sentry: typeof import('@sentry/react-native') | null = null;
try {
  Sentry = require('@sentry/react-native');
} catch {
  Sentry = null;
}

/**
 * Initialize Sentry
 * Call this in app/_layout.tsx before rendering
 */
export function initSentry() {
  if (!Sentry) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sentry] @sentry/react-native not installed. Skipping.');
    }
    return;
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  const enableSentry = process.env.EXPO_PUBLIC_ENABLE_SENTRY === 'true';

  if (isDevelopment && !enableSentry) {
    console.log('[Sentry] Disabled in development');
    return;
  }

  if (!SENTRY_DSN) {
    console.warn('[Sentry] DSN not configured. Skipping initialization.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_ENV || 'development',
    release: `kiku@${Constants.expoConfig?.version || '1.0.0'}`,
    dist:
      Constants.expoConfig?.android?.versionCode?.toString() ||
      Constants.expoConfig?.ios?.buildNumber ||
      '1',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
        enableStallTracking: true,
        enableAppStartTracking: true,
      }),
    ],
    beforeSend(
      event: import('@sentry/react-native').Event,
      hint: import('@sentry/react-native').EventHint
    ): import('@sentry/react-native').Event | null {
      if (isDevelopment && !enableSentry) return null;
      const error = hint.originalException;
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) return null;
        if (error.message.includes('timeout') || error.name === 'AbortError') return null;
      }
      return event;
    },
    maxBreadcrumbs: 50,
    debug: isDevelopment,
    enableNative: true,
    enableNativeCrashHandling: true,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
  });

  console.log('[Sentry] Initialized successfully');
}

export function setSentryUser(userId: string, email?: string, role?: string) {
  Sentry?.setUser({ id: userId, email, role });
}

export function clearSentryUser() {
  Sentry?.setUser(null);
}

export function addSentryBreadcrumb(
  message: string,
  category: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, unknown>
) {
  Sentry?.addBreadcrumb({ message, category, level, data, timestamp: Date.now() / 1000 });
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry?.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
}

export function captureMessage(
  message: string,
  level: 'debug' | 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
) {
  Sentry?.captureMessage(message, {
    level,
    contexts: context ? { custom: context } : undefined,
  });
}

export function startSentryTransaction(
  name: string,
  op: string
): ReturnType<typeof import('@sentry/react-native').startTransaction> | undefined {
  return Sentry?.startTransaction?.({ name, op }) as
    | ReturnType<typeof import('@sentry/react-native').startTransaction>
    | undefined;
}

export const SentryErrorBoundary =
  Sentry?.wrap ?? (<T>(Component: T): T => Component);
