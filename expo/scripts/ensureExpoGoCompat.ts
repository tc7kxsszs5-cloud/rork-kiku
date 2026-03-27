import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function ensureExpoGoCompatibility(): void {
  const appJsonPath = path.resolve(__dirname, '../app.json');

  try {
    const rawConfig = readFileSync(appJsonPath, 'utf-8');
    const parsedConfig = JSON.parse(rawConfig);

    if (!parsedConfig.expo) {
      console.warn('[compat] Поле "expo" не найдено в app.json, изменений нет.');
      return;
    }

    if (parsedConfig.expo.newArchEnabled === false) {
      console.log('[compat] Новая архитектура уже отключена для Expo Go.');
      return;
    }

    parsedConfig.expo.newArchEnabled = false;

    writeFileSync(appJsonPath, `${JSON.stringify(parsedConfig, null, 2)}\n`);
    console.log('[compat] newArchEnabled отключен. Теперь проект можно запускать в Expo Go.');
  } catch (error) {
    console.error('[compat] Не удалось обновить app.json:', error);
  }
}

ensureExpoGoCompatibility();
