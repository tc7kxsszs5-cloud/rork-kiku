/**
 * Утилиты для отслеживания активации пользователей
 * Используется для KPI: activation rate, retention (D1, D7, D30)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const INSTALL_DATE_KEY = '@kiku_install_date';
const FIRST_LAUNCH_KEY = '@kiku_first_launch';
const ACTIVATION_KEY = '@kiku_activation';
const LAST_SESSION_KEY = '@kiku_last_session';

export interface ActivationData {
  installDate: number;
  firstLaunchDate: number;
  activationDate: number | null;
  lastSessionDate: number;
  isActivated: boolean;
}

/**
 * Отслеживание установки приложения (первый запуск)
 */
export async function trackInstall(): Promise<number | null> {
  try {
    const existing = await AsyncStorage.getItem(INSTALL_DATE_KEY);
    if (existing) {
      return parseInt(existing, 10);
    }

    const installDate = Date.now();
    await AsyncStorage.setItem(INSTALL_DATE_KEY, installDate.toString());
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, installDate.toString());
    return installDate;
  } catch (error) {
    console.error('[ActivationTracking] Failed to track install:', error);
    return null;
  }
}

/**
 * Отслеживание первого запуска
 */
export async function trackFirstLaunch(): Promise<number | null> {
  try {
    const existing = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    if (existing) {
      return parseInt(existing, 10);
    }

    const firstLaunchDate = Date.now();
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, firstLaunchDate.toString());
    return firstLaunchDate;
  } catch (error) {
    console.error('[ActivationTracking] Failed to track first launch:', error);
    return null;
  }
}

/**
 * Отслеживание активации пользователя
 * Активация = onboarding завершен + первое значимое действие (добавлен ребенок, просмотрен чат и т.д.)
 */
export async function trackActivation(): Promise<number | null> {
  try {
    const existing = await AsyncStorage.getItem(ACTIVATION_KEY);
    if (existing) {
      return parseInt(existing, 10);
    }

    const activationDate = Date.now();
    await AsyncStorage.setItem(ACTIVATION_KEY, activationDate.toString());
    return activationDate;
  } catch (error) {
    console.error('[ActivationTracking] Failed to track activation:', error);
    return null;
  }
}

/**
 * Отслеживание сессии (каждый раз при открытии приложения)
 */
export async function trackSession(): Promise<number> {
  try {
    const sessionDate = Date.now();
    await AsyncStorage.setItem(LAST_SESSION_KEY, sessionDate.toString());
    return sessionDate;
  } catch (error) {
    console.error('[ActivationTracking] Failed to track session:', error);
    return Date.now();
  }
}

/**
 * Получить данные активации
 */
export async function getActivationData(): Promise<ActivationData> {
  try {
    const [installDateStr, firstLaunchStr, activationStr, lastSessionStr] = await Promise.all([
      AsyncStorage.getItem(INSTALL_DATE_KEY),
      AsyncStorage.getItem(FIRST_LAUNCH_KEY),
      AsyncStorage.getItem(ACTIVATION_KEY),
      AsyncStorage.getItem(LAST_SESSION_KEY),
    ]);

    return {
      installDate: installDateStr ? parseInt(installDateStr, 10) : Date.now(),
      firstLaunchDate: firstLaunchStr ? parseInt(firstLaunchStr, 10) : Date.now(),
      activationDate: activationStr ? parseInt(activationStr, 10) : null,
      lastSessionDate: lastSessionStr ? parseInt(lastSessionStr, 10) : Date.now(),
      isActivated: activationStr !== null,
    };
  } catch (error) {
    console.error('[ActivationTracking] Failed to get activation data:', error);
    return {
      installDate: Date.now(),
      firstLaunchDate: Date.now(),
      activationDate: null,
      lastSessionDate: Date.now(),
      isActivated: false,
    };
  }
}

/**
 * Проверка, является ли это первым запуском
 */
export async function isFirstLaunch(): Promise<boolean> {
  try {
    const existing = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
    return existing === null;
  } catch (error) {
    console.error('[ActivationTracking] Failed to check first launch:', error);
    return true;
  }
}

/**
 * Проверка, активирован ли пользователь
 */
export async function isActivated(): Promise<boolean> {
  try {
    const activation = await AsyncStorage.getItem(ACTIVATION_KEY);
    return activation !== null;
  } catch (error) {
    console.error('[ActivationTracking] Failed to check activation:', error);
    return false;
  }
}
