/**
 * Миграция User данных с версии 1 на версию 2
 * 
 * Добавляет:
 * - language к пользователю
 * - preferences к пользователю
 * - createdAt, updatedAt timestamps
 */

import { Migration } from '../types';

export const userV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add language and preferences to user',
  description: 'Добавляет language, preferences и timestamps к пользователю',

  async migrate(data: any) {
    // Мигрируем пользователя
    if (data.user) {
      const user = data.user;
      
      // Добавляем language если его нет
      if (!user.language) {
        user.language = 'ru'; // Дефолтный язык
      }

      // Добавляем preferences если их нет
      if (!user.preferences) {
        user.preferences = {
          theme: 'sunrise',
          notifications: true,
          analytics: true,
        };
      }

      // Добавляем timestamps если их нет
      if (!user.createdAt) {
        user.createdAt = user.addedAt || Date.now(); // Используем addedAt если есть
      }
      if (!user.updatedAt) {
        user.updatedAt = Date.now();
      }

      data.user = user;
    }

    // Мигрируем детей если есть
    if (data.children && Array.isArray(data.children)) {
      data.children = data.children.map((child: any) => {
        if (!child.language) {
          child.language = 'ru';
        }
        if (!child.createdAt) {
          child.createdAt = child.addedAt || Date.now();
        }
        if (!child.updatedAt) {
          child.updatedAt = Date.now();
        }
        return child;
      });
    }

    // Обновляем версию
    data.version = 2;
    data.migratedAt = Date.now();
    data.migratedFrom = 1;

    return data;
  },

  async rollback(data: any) {
    // Откат миграции
    if (data.user) {
      const user = data.user;
      
      // Удаляем language если это дефолтное значение
      if (user.language === 'ru') {
        delete user.language;
      }

      // Удаляем preferences если это дефолтные значения
      if (user.preferences) {
        const isDefault = 
          user.preferences.theme === 'sunrise' &&
          user.preferences.notifications === true &&
          user.preferences.analytics === true &&
          Object.keys(user.preferences).length === 3;
        
        if (isDefault) {
          delete user.preferences;
        }
      }

      // Удаляем timestamps если они были добавлены при миграции
      if (user.createdAt && user.addedAt && user.createdAt === user.addedAt) {
        delete user.createdAt;
      }
      if (user.updatedAt) {
        delete user.updatedAt;
      }

      data.user = user;
    }

    if (data.children && Array.isArray(data.children)) {
      data.children = data.children.map((child: any) => {
        if (child.language === 'ru') {
          delete child.language;
        }
        if (child.createdAt && child.addedAt && child.createdAt === child.addedAt) {
          delete child.createdAt;
        }
        if (child.updatedAt) {
          delete child.updatedAt;
        }
        return child;
      });
    }

    data.version = 1;
    return data;
  },
};
