/**
 * Optional type declaration for @sentry/react-native.
 * Install the package to enable Sentry; without it, utils/sentry.ts exports no-ops.
 */
declare module '@sentry/react-native' {
  export interface Event {
    [key: string]: unknown;
  }
  export interface EventHint {
    originalException?: unknown;
    [key: string]: unknown;
  }
  export function init(options: Record<string, unknown>): void;
  export function setUser(user: { id: string; email?: string; role?: string } | null): void;
  export function addBreadcrumb(crumb: Record<string, unknown>): void;
  export function captureException(error: Error, options?: Record<string, unknown>): void;
  export function captureMessage(message: string, options?: Record<string, unknown>): void;
  export function startTransaction(options: { name: string; op: string }): { [key: string]: unknown };
  export function wrap<T>(component: T): T;
  export class ReactNativeTracing {
    constructor(options: Record<string, unknown>);
  }
  export class ReactNavigationInstrumentation {}
}
