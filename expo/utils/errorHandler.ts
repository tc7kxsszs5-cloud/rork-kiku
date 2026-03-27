/**
 * User-friendly error handling utility
 * Converts technical errors into user-friendly messages
 */

import { Alert, Platform } from 'react-native';
import { logger } from './logger';
import i18n from '@/constants/i18n';

export interface ErrorContext {
  component?: string;
  action?: string;
  [key: string]: unknown;
}

/**
 * Error type to translation key mapping
 */
const ERROR_TYPE_MAP: Record<string, string> = {
  'Network error': 'common.errors.networkError',
  'Sync failed': 'common.errors.syncFailed',
  'Failed to load': 'common.errors.loadFailed',
  'Failed to save': 'common.errors.saveFailed',
  'Permission denied': 'common.errors.permissionDenied',
  'Storage error': 'common.errors.storageError',
  'Analysis failed': 'common.errors.analysisFailed',
  'SOS failed': 'common.errors.sosFailed',
  'Auth failed': 'common.errors.authFailed',
};

/**
 * Get user-friendly error message using i18n
 */
function getUserFriendlyMessage(error: Error | unknown, context?: ErrorContext): string {
  if (error instanceof Error) {
    // Check for specific error messages and map to translation keys
    for (const [errorKey, translationKey] of Object.entries(ERROR_TYPE_MAP)) {
      if (error.message.includes(errorKey) || error.name.includes(errorKey)) {
        return i18n.t(translationKey);
      }
    }
    // Fallback to error message if it's user-friendly
    if (error.message.length < 100 && !error.message.includes('Error:') && !error.message.includes('at ')) {
      return error.message;
    }
  }
  return i18n.t('common.errors.default');
}

/**
 * Show user-friendly error alert
 */
export async function showUserFriendlyError(
  error: Error | unknown,
  component?: string,
  context?: ErrorContext
): Promise<void> {
  const message = getUserFriendlyMessage(error, context);
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Log error with full details
  logger.error('User-friendly error shown', errorObj, {
    component: component || context?.component,
    action: context?.action,
    ...context,
  });

  // Show alert to user
  if (Platform.OS !== 'web') {
    Alert.alert(i18n.t('common.error'), message);
  } else {
    // On web, use console as fallback
    console.error('[Error]', message, errorObj);
  }
}

/**
 * Handle error silently (log only, no user notification)
 */
export function handleErrorSilently(
  error: Error | unknown,
  component?: string,
  context?: ErrorContext
): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  logger.error('Error handled silently', errorObj, {
    component: component || context?.component,
    action: context?.action,
    ...context,
  });
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  component?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleErrorSilently(error, component);
      throw error;
    }
  }) as T;
}

/**
 * Create error handler for specific component
 */
export function createErrorHandler(component: string) {
  return {
    show: (error: Error | unknown, context?: ErrorContext) =>
      showUserFriendlyError(error, component, context),
    silent: (error: Error | unknown, context?: ErrorContext) =>
      handleErrorSilently(error, component, context),
    wrap: <T extends (...args: unknown[]) => Promise<unknown>>(fn: T) =>
      withErrorHandling(fn, component),
  };
}
