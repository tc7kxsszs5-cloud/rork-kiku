import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerDeviceProcedure } from "./routes/notifications/register-device";
import { getSyncStatusProcedure } from "./routes/notifications/get-sync-status";
import { logDeviceTestProcedure } from "./routes/notifications/log-device-test";
import {
  sendMessageProcedure,
  getMessagesProcedure,
  getMessageProcedure,
  deleteMessageProcedure,
  markAsReadProcedure,
  getUnreadCountProcedure,
  sendTypingProcedure,
  getMessageStatsProcedure,
} from "./routes/messaging/procedures";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  notifications: createTRPCRouter({
    registerDevice: registerDeviceProcedure,
    getSyncStatus: getSyncStatusProcedure,
    logDeviceTest: logDeviceTestProcedure,
  }),
  messaging: createTRPCRouter({
    send: sendMessageProcedure,
    getMessages: getMessagesProcedure,
    getMessage: getMessageProcedure,
    delete: deleteMessageProcedure,
    markAsRead: markAsReadProcedure,
    getUnreadCount: getUnreadCountProcedure,
    sendTyping: sendTypingProcedure,
    getStats: getMessageStatsProcedure,
  }),
});

export type AppRouter = typeof appRouter;
