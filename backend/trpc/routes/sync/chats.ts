import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../../create-context.js";
import { getDeltaChats } from "../../../utils/syncHelpers.js";
import { supabase } from "../../../utils/supabase.js";
import { syncChatsInputSchema, getChatsInputSchema } from "../../../utils/validationSchemas.js";
import { rateLimiters } from "../../middleware/rateLimit.js";

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

// Получить чаты из базы данных
const getChatsFromDB = async (deviceId: string): Promise<any[]> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('device_id', deviceId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[getChatsFromDB] Error:', error);
    return [];
  }

  return data || [];
};

// Сохранить чаты в базу данных
const saveChatsToDB = async (deviceId: string, chats: any[]): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const timestamp = Date.now();
  const chatsToSave = chats.map((chat) => ({
    id: chat.id,
    device_id: deviceId,
    contact_name: chat.contactName || chat.contact_name || '',
    contact_phone: chat.contactPhone || chat.contact_phone,
    last_message: chat.lastMessage || chat.last_message,
    last_message_timestamp: chat.lastMessageTimestamp || chat.last_message_timestamp,
    risk_level: chat.riskLevel || chat.risk_level || 'safe',
    unread_count: chat.unreadCount || chat.unread_count || 0,
    created_at: chat.createdAt || chat.created_at || timestamp,
    updated_at: chat.updatedAt || chat.updated_at || timestamp,
  }));

  // Используем upsert для обновления существующих и создания новых
  const { error } = await supabase
    .from('chats')
    .upsert(chatsToSave, { onConflict: 'id' });

  if (error) {
    console.error('[saveChatsToDB] Error:', error);
    throw error;
  }

  // Сохраняем сообщения отдельно
  for (const chat of chats) {
    if (chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0) {
      await saveMessagesToDB(chat.id, deviceId, chat.messages);
    }
  }
};

// Сохранить сообщения в базу данных
const saveMessagesToDB = async (chatId: string, deviceId: string, messages: any[]): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase клиент не инициализирован");
  }

  const messagesToSave = messages.map((msg) => ({
    id: msg.id,
    chat_id: chatId,
    device_id: deviceId,
    sender: msg.sender || '',
    content: msg.content || msg.text || '',
    timestamp: msg.timestamp || Date.now(),
    message_type: msg.messageType || msg.message_type || 'text',
    risk_level: msg.riskLevel || msg.risk_level || 'safe',
    ai_analysis: msg.aiAnalysis || msg.ai_analysis || null,
    created_at: msg.createdAt || msg.created_at || Date.now(),
  }));

  const { error } = await supabase
    .from('messages')
    .upsert(messagesToSave, { onConflict: 'id' });

  if (error) {
    console.error('[saveMessagesToDB] Error:', error);
    // Не бросаем ошибку, чтобы не прервать сохранение чатов
  }
};

// Получить сообщения из базы данных
const getMessagesFromDB = async (chatId: string): Promise<any[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('[getMessagesFromDB] Error:', error);
    return [];
  }

  return data || [];
};

// Обновить статус синхронизации
const updateSyncStatus = async (deviceId: string, timestamp: number): Promise<void> => {
  if (!supabase) {
    return;
  }

  await supabase
    .from('sync_status')
    .upsert({
      device_id: deviceId,
      last_sync_timestamp: timestamp,
      last_chats_sync: timestamp,
      updated_at: timestamp,
    }, { onConflict: 'device_id' });
};

export const syncChatsProcedure = publicProcedure
  .use(rateLimiters.sync)
  .input(syncChatsInputSchema)
  .mutation(async ({ input }) => {
    const { deviceId, chats, lastSyncTimestamp = 0 } = input;
    const timestamp = Date.now();

    try {
      // Получаем существующие чаты из базы данных
      const serverChats = await getChatsFromDB(deviceId);

      // Загружаем сообщения для каждого чата
      const chatsWithMessages = await Promise.all(
        serverChats.map(async (chat) => {
          const messages = await getMessagesFromDB(chat.id);
          return {
            ...chat,
            messages,
            contactName: chat.contact_name,
            contactPhone: chat.contact_phone,
            lastMessage: chat.last_message,
            lastMessageTimestamp: chat.last_message_timestamp,
            riskLevel: chat.risk_level,
            unreadCount: chat.unread_count,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
          };
        })
      );

      if (chats && chats.length > 0) {
        // Merge логика - объединяем серверные и клиентские чаты
        const mergedChats = mergeChats(chatsWithMessages, chats);
        
        // Добавляем updatedAt если нет
        const chatsWithTimestamp = mergedChats.map((chat) => ({
          ...chat,
          updatedAt: chat.updatedAt || timestamp,
        }));

        // Сохраняем объединенные чаты в базу данных
        await saveChatsToDB(deviceId, chatsWithTimestamp);
      }

      // Обновляем статус синхронизации
      await updateSyncStatus(deviceId, timestamp);

      // Если запрошен incremental sync - возвращаем только изменения
      if (lastSyncTimestamp > 0) {
        const allChats = await getChatsFromDB(deviceId);
        const chatsWithMessagesForDelta = await Promise.all(
          allChats.map(async (chat) => {
            const messages = await getMessagesFromDB(chat.id);
            return {
              ...chat,
              messages,
              contactName: chat.contact_name,
              contactPhone: chat.contact_phone,
              lastMessage: chat.last_message,
              lastMessageTimestamp: chat.last_message_timestamp,
              riskLevel: chat.risk_level,
              unreadCount: chat.unread_count,
              createdAt: chat.created_at,
              updatedAt: chat.updated_at,
            };
          })
        );
        const deltaChats = getDeltaChats(chatsWithMessagesForDelta, lastSyncTimestamp);
        
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
      const allChats = await getChatsFromDB(deviceId);
      const chatsWithMessagesForFull = await Promise.all(
        allChats.map(async (chat) => {
          const messages = await getMessagesFromDB(chat.id);
          return {
            ...chat,
            messages,
            contactName: chat.contact_name,
            contactPhone: chat.contact_phone,
            lastMessage: chat.last_message,
            lastMessageTimestamp: chat.last_message_timestamp,
            riskLevel: chat.risk_level,
            unreadCount: chat.unread_count,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
          };
        })
      );

      return {
        success: true,
        chats: chatsWithMessagesForFull,
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
        isDelta: false,
        count: chatsWithMessagesForFull.length,
      };
    } catch (error) {
      console.error('[syncChatsProcedure] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        chats: [],
        lastSyncTimestamp: timestamp,
        serverTimestamp: timestamp,
      };
    }
  });

export const getChatsProcedure = publicProcedure
  .use(rateLimiters.sync)
  .input(getChatsInputSchema)
  .query(async ({ input }) => {
    const { deviceId, lastSyncTimestamp = 0 } = input;

    try {
      const allChats = await getChatsFromDB(deviceId);
      
      // Загружаем сообщения для каждого чата
      const chatsWithMessages = await Promise.all(
        allChats.map(async (chat) => {
          const messages = await getMessagesFromDB(chat.id);
          return {
            ...chat,
            messages,
            contactName: chat.contact_name,
            contactPhone: chat.contact_phone,
            lastMessage: chat.last_message,
            lastMessageTimestamp: chat.last_message_timestamp,
            riskLevel: chat.risk_level,
            unreadCount: chat.unread_count,
            createdAt: chat.created_at,
            updatedAt: chat.updated_at,
          };
        })
      );

      // Получаем последний timestamp синхронизации
      let lastSync = 0;
      if (supabase) {
        const { data } = await supabase
          .from('sync_status')
          .select('last_chats_sync')
          .eq('device_id', deviceId)
          .single();
        lastSync = data?.last_chats_sync || 0;
      }

      // Incremental sync если запрошен
      if (lastSyncTimestamp > 0) {
        const deltaChats = getDeltaChats(chatsWithMessages, lastSyncTimestamp);
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
        chats: chatsWithMessages,
        lastSyncTimestamp: lastSync,
        serverTimestamp: Date.now(),
        isDelta: false,
        count: chatsWithMessages.length,
      };
    } catch (error) {
      console.error('[getChatsProcedure] Error:', error);
      return {
        chats: [],
        lastSyncTimestamp: 0,
        serverTimestamp: Date.now(),
        isDelta: false,
        count: 0,
      };
    }
  });

export const syncChatsRouter = createTRPCRouter({
  sync: syncChatsProcedure,
  get: getChatsProcedure,
});
