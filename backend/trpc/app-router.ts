import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerDeviceProcedure } from "./routes/notifications/register-device";
import { getSyncStatusProcedure } from "./routes/notifications/get-sync-status";
import { logDeviceTestProcedure } from "./routes/notifications/log-device-test";
import { getUserChatsProcedure } from "./routes/chat/get-user-chats";
import { getChatMessagesProcedure } from "./routes/chat/get-chat-messages";
import { createChatProcedure } from "./routes/chat/create-chat";
import { analyzeContentProcedure } from "./routes/chat/analyze-content";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  notifications: createTRPCRouter({
    registerDevice: registerDeviceProcedure,
    getSyncStatus: getSyncStatusProcedure,
    logDeviceTest: logDeviceTestProcedure,
  }),
  chat: createTRPCRouter({
    getUserChats: getUserChatsProcedure,
    getChatMessages: getChatMessagesProcedure,
    createChat: createChatProcedure,
    analyzeContent: analyzeContentProcedure,
  }),
});

export type AppRouter = typeof appRouter;
