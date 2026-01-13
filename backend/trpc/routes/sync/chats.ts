import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "@/backend/trpc/create-context";
import { getDeltaChats } from "@/utils/syncHelpers";

// In-memory хранилище для синхронизации (в production использовать БД)
const chatsStore = new Map<string, { chats: any[]; timestamp: number }>();
const lastSyncStore = new Map<string, number>();

// Улучшенная merge логика
const mergeChats = (serverChats: any[], clientChats: any[]): any[] => {
  const mergedMap = new Map<string, any>();

  // Добавляем серверные чаты
  serverChats.forEach((chat) => {
    mergedMap.set(chat.id, { ...chat, source: 'server' });
  });

  // Объединяем с клиентскими чатами
  clientChats.forEach((clientChat) => {
    const existing = mergedMap.get(clientChat.id);
    
    if (!existing) {
      // Новый чат с клиента
      mergedMap.set(clientChat.id, { ...clientChat, source: 'client' });
    } else {
      // Чат существует - merge логика
      // Используем последний timestamp (last-write-wins для конфликтов)
      if (clientChat.updatedAt && existing.updatedAt) {
        if (clientChat.updatedAt > existing.updatedAt) {
          // Клиент более свежий
          mergedMap.set(clientChat.id, {
            ...clientChat,
            // Объединяем сообщения (уникальные по ID)
            messages: mergeMessages(existing.messages || [], clientChat.messages || []),
          });
        } else {
          // Сервер более свежий, но добавляем новые сообщения с клиента
          mergedMap.set(clientChat.id, {
            ...existing,
            messages: mergeMessages(existing.messages || [], clientChat.messages || []),
          });
        }
      } else {
        // Нет timestamp - просто объединяем сообщения
        mergedMap.set(clientChat.id, {
          ...existing,
          messages: mergeMessages(existing.messages || [], clientChat.messages || []),
        });
      }
    }
  });

  return Array.from(mergedMap.values());
};

// Объединение сообщений (уникальные по ID)
const mergeMessages = (serverMessages: any[], clientMessages: any[]): any[] => {
  const messageMap = new Map<string, any>();

  // Добавляем серверные сообщения
  serverMessages.forEach((msg) => {
    messageMap.set(msg.id, msg);
  });

  // Добавляем/обновляем клиентские сообщения
  clientMessages.forEach((msg) => {
    const existing = messageMap.get(msg.id);
    if (!existing || (msg.timestamp && existing.timestamp && msg.timestamp > existing.timestamp)) {
      messageMap.set(msg.id, msg);
    }
  });

  // Сортируем по timestamp
  return Array.from(messageMap.values()).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
};

export const syncChatsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      chats: z.array(z.any()).optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, chats, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    // Получаем существующие чаты с сервера
    const stored = chatsStore.get(deviceId);
    const serverChats = stored?.chats || [];

    if (chats && chats.length > 0) {
      // Merge логика - объединяем серверные и клиентские чаты
      const mergedChats = mergeChats(serverChats, chats);
      
      // Добавляем updatedAt если нет
      const chatsWithTimestamp = mergedChats.map((chat) => ({
        ...chat,
        updatedAt: chat.updatedAt || timestamp,
      }));

      // Сохраняем объединенные чаты
      chatsStore.set(deviceId, {
        chats: chatsWithTimestamp,
        timestamp,
      });
    }

    lastSyncStore.set(deviceId, timestamp);

    // Если запрошен incremental sync - возвращаем только изменения
    if (lastSyncTimestamp > 0) {
      const storedData = chatsStore.get(deviceId);
      const allChats = storedData?.chats || [];
      const deltaChats = getDeltaChats(allChats, lastSyncTimestamp);
      
      return {
        success: true,
        chats: deltaChats,
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
        isDelta: true,
        count: deltaChats.length,
      };
    }

    // Полная синхронизация - возвращаем все чаты
    const storedData = chatsStore.get(deviceId);
    return {
      success: true,
      chats: storedData?.chats || [],
      lastSyncTimestamp: timestamp,
      serverTimestamp: timestamp,
      isDelta: false,
      count: stored?.chats?.length || 0,
    };
  });

export const getChatsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .query(({ input }) => {
    const { deviceId, lastSyncTimestamp = 0 } = input;
    const stored = chatsStore.get(deviceId);
    const allChats = stored?.chats || [];
    const lastSync = lastSyncStore.get(deviceId) || 0;

    // Incremental sync если запрошен
    if (lastSyncTimestamp > 0) {
      const deltaChats = getDeltaChats(allChats, lastSyncTimestamp);
      return {
        chats: deltaChats,
        lastSyncTimestamp: lastSync,
        serverTimestamp: Date.now(),
        isDelta: true,
        count: deltaChats.length,
      };
    }

    // Полная синхронизация
    return {
      chats: allChats,
      lastSyncTimestamp: lastSync,
      serverTimestamp: Date.now(),
      isDelta: false,
      count: allChats.length,
    };
  });

export const syncChatsRouter = createTRPCRouter({
  sync: syncChatsProcedure,
  get: getChatsProcedure,
});

