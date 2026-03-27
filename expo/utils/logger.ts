/**
 * Production-ready logger utility
 * Provides structured logging with levels and context
 * IMPROVEMENT: Better logging without changing functionality
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private buffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;

  private log(level: LogLevel, message: string, error?: Error, context?: LogContext): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      error,
    };

    // Add to buffer
    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    // Output to console (in production, this would go to a logging service)
    const logMessage = `[${level.toUpperCase()}] ${message}`;
    const logData = context ? { ...context, ...(error && { error: error.message, stack: error.stack }) } : undefined;

    switch (level) {
      case 'debug':
        if (__DEV__) {
          console.debug(logMessage, logData || '');
        }
        break;
      case 'info':
        console.log(logMessage, logData || '');
        break;
      case 'warn':
        console.warn(logMessage, logData || '');
        break;
      case 'error':
      case 'critical':
        console.error(logMessage, logData || '', error || '');
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, undefined, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, undefined, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, undefined, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, error, context);
  }

  critical(message: string, error?: Error, context?: LogContext): void {
    this.log('critical', message, error, context);
  }

  getRecentLogs(count: number = 10): LogEntry[] {
    return this.buffer.slice(-count);
  }

  clearBuffer(): void {
    this.buffer = [];
  }
}

export const logger = new Logger();
