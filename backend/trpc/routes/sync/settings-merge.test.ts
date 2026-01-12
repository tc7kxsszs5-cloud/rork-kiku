/**
 * Unit тесты для merge логики настроек
 */

import { describe, it, expect } from 'bun:test';

const mergeSettings = (serverSettings: any, clientSettings: any): any => {
  if (!serverSettings) return clientSettings || {};
  if (!clientSettings) return serverSettings || {};

  const serverUpdatedAt = serverSettings.updatedAt || 0;
  const clientUpdatedAt = clientSettings.updatedAt || 0;

  if (serverUpdatedAt && clientUpdatedAt) {
    if (clientUpdatedAt > serverUpdatedAt) {
      return { ...clientSettings, updatedAt: clientUpdatedAt };
    } else {
      return { ...serverSettings, updatedAt: serverUpdatedAt };
    }
  }

  return { ...serverSettings, ...clientSettings };
};

describe('mergeSettings', () => {
  it('должен возвращать клиентские настройки если серверных нет', () => {
    const clientSettings = { theme: 'dark', notifications: true };
    
    const result = mergeSettings(null, clientSettings);
    
    expect(result).toEqual(clientSettings);
  });

  it('должен возвращать серверные настройки если клиентских нет', () => {
    const serverSettings = { theme: 'light', notifications: false };
    
    const result = mergeSettings(serverSettings, null);
    
    expect(result).toEqual(serverSettings);
  });

  it('должен использовать более свежие настройки при конфликте', () => {
    const serverSettings = { theme: 'light', updatedAt: 1000 };
    const clientSettings = { theme: 'dark', updatedAt: 2000 };
    
    const result = mergeSettings(serverSettings, clientSettings);
    
    expect(result.theme).toBe('dark');
    expect(result.updatedAt).toBe(2000);
  });

  it('должен использовать серверные настройки если они новее', () => {
    const serverSettings = { theme: 'light', updatedAt: 2000 };
    const clientSettings = { theme: 'dark', updatedAt: 1000 };
    
    const result = mergeSettings(serverSettings, clientSettings);
    
    expect(result.theme).toBe('light');
    expect(result.updatedAt).toBe(2000);
  });

  it('должен объединять настройки если нет timestamp', () => {
    const serverSettings = { theme: 'light', language: 'ru' };
    const clientSettings = { theme: 'dark' };
    
    const result = mergeSettings(serverSettings, clientSettings);
    
    expect(result.theme).toBe('dark'); // Клиентские имеют приоритет
    expect(result.language).toBe('ru'); // Серверные сохраняются
  });

  it('должен обрабатывать пустые объекты', () => {
    expect(mergeSettings({}, {})).toEqual({});
    expect(mergeSettings(null, {})).toEqual({});
    expect(mergeSettings({}, null)).toEqual({});
  });
});


