import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { createTRPCRouter } from "@/backend/trpc/create-context";

// In-memory хранилище для синхронизации (в production использовать БД)
const chatsStore = new Map<string, any>();
const lastSyncStore = new Map<string, number>();

export const syncChatsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
      chats: z.array(z.any()).optional(),
      lastSyncTimestamp: z.number().optional(),
    })
  )
  .mutation(({ input }) => {
    const { deviceId, chats, lastSyncTimestamp } = input;
    const timestamp = Date.now();

    if (chats) {
      // Сохраняем чаты от клиента
      chatsStore.set(deviceId, {
        chats,
        timestamp,
      });
    }

    lastSyncStore.set(deviceId, timestamp);

    // Возвращаем синхронизированные данные
    const stored = chatsStore.get(deviceId);
    const lastSync = lastSyncStore.get(deviceId) || 0;

    return {
      success: true,
      chats: stored?.chats || [],
      lastSyncTimestamp: lastSync,
      serverTimestamp: timestamp,
    };
  });

export const getChatsProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string(),
    })
  )
  .query(({ input }) => {
    const { deviceId } = input;
    const stored = chatsStore.get(deviceId);
    const lastSync = lastSyncStore.get(deviceId) || 0;

    return {
      chats: stored?.chats || [],
      lastSyncTimestamp: lastSync,
      serverTimestamp: Date.now(),
    };
  });

export const syncChatsRouter = createTRPCRouter({
  sync: syncChatsProcedure,
  get: getChatsProcedure,
});

