/**
 * Утилиты для измерения и оптимизации производительности
 */

import React, { useEffect } from 'react';

/**
 * Измеряет время выполнения функции
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  log = true
): T {
  if (__DEV__ && log) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Асинхронное измерение производительности
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  log = true
): Promise<T> {
  if (__DEV__ && log) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Дебаунс функция для оптимизации частых вызовов
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Троттлинг функция для ограничения частоты вызовов
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Ленивая загрузка компонента с fallback
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  return React.lazy(importFn);
}

/**
 * Мемоизация результата функции
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Измерение времени рендера компонента
 */
export function withPerformanceMeasurement<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return (props: P) => {
    useEffect(() => {
      if (__DEV__) {
        const start = performance.now();
        return () => {
          const end = performance.now();
          console.log(`[Render] ${componentName}: ${(end - start).toFixed(2)}ms`);
        };
      }
    });
    
    return React.createElement(Component, props);
  };
}
