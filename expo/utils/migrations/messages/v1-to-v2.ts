/**
 * Миграция Messages данных с версии 1 на версию 2
 * 
 * Добавляет:
 * - metadata к сообщениям (source, editedAt, reactions)
 * - version к сообщениям
 */

import { Migration } from '../types';

export const messagesV1ToV2: Migration = {
  fromVersion: 1,
  toVersion: 2,
  name: 'Add metadata to messages',
  description: 'Добавляет metadata (source, editedAt, reactions) к сообщениям',

  async migrate(data: any) {
    // Мигрируем чаты
    if (data.chats && Array.isArray(data.chats)) {
      data.chats = data.chats.map((chat: any) => {
        // Мигрируем сообщения в чате
        if (chat.messages && Array.isArray(chat.messages)) {
          chat.messages = chat.messages.map((message: any) => {
            // Добавляем metadata если его нет
            if (!message.metadata) {
              return {
                ...message,
                metadata: {
                  source: 'sms', // Дефолтное значение для старых сообщений
                },
                version: 2,
              };
            }

            // Если metadata есть, добавляем version
            return {
              ...message,
              version: 2,
            };
          });
        }

        return chat;
      });
    }

    // Если данные на верхнем уровне (старая структура)
    if (data.messages && Array.isArray(data.messages)) {
      data.messages = data.messages.map((message: any) => {
        if (!message.metadata) {
          return {
            ...message,
            metadata: {
              source: 'sms',
            },
            version: 2,
          };
        }
        return {
          ...message,
          version: 2,
        };
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
    if (data.chats && Array.isArray(data.chats)) {
      data.chats = data.chats.map((chat: any) => {
        if (chat.messages && Array.isArray(chat.messages)) {
          chat.messages = chat.messages.map((message: any) => {
            const { metadata, version, ...rest } = message;
            // Удаляем metadata если это дефолтное значение
            if (metadata && metadata.source === 'sms' && Object.keys(metadata).length === 1) {
              return rest;
            }
            // Иначе оставляем metadata но удаляем version
            return { ...rest, metadata };
          });
        }
        return chat;
      });
    }

    if (data.messages && Array.isArray(data.messages)) {
      data.messages = data.messages.map((message: any) => {
        const { metadata, version, ...rest } = message;
        if (metadata && metadata.source === 'sms' && Object.keys(metadata).length === 1) {
          return rest;
        }
        return { ...rest, metadata };
      });
    }

    data.version = 1;
    return data;
  },
};
