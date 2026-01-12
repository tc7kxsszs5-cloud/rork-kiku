import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerDeviceProcedure } from "./routes/notifications/register-device";
import { getSyncStatusProcedure } from "./routes/notifications/get-sync-status";
import { logDeviceTestProcedure } from "./routes/notifications/log-device-test";
import { sendPushProcedure, sendPushToUserProcedure, sendPushToTokenProcedure } from "./routes/notifications/send-push";
import { syncChatsRouter } from "./routes/sync/chats";
import { syncAlertsRouter } from "./routes/sync/alerts";
import { syncSettingsRouter } from "./routes/sync/settings";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  notifications: createTRPCRouter({
    registerDevice: registerDeviceProcedure,
    getSyncStatus: getSyncStatusProcedure,
    logDeviceTest: logDeviceTestProcedure,
    sendPush: sendPushProcedure,
    sendPushToUser: sendPushToUserProcedure,
    sendPushToToken: sendPushToTokenProcedure,
  }),
  sync: createTRPCRouter({
    chats: syncChatsRouter,
    alerts: syncAlertsRouter,
    settings: syncSettingsRouter,
  }),
});

export type AppRouter = typeof appRouter;
