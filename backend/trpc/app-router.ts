import { createTRPCRouter } from "./create-context.js";
import hiRoute from "./routes/example/hi/route.js";
import { registerDeviceProcedure } from "./routes/notifications/register-device.js";
import { getSyncStatusProcedure } from "./routes/notifications/get-sync-status.js";
import { logDeviceTestProcedure } from "./routes/notifications/log-device-test.js";
import { sendPushToDeviceProcedure, sendPushToUserProcedure, sendRiskAlertPushProcedure } from "./routes/notifications/send-push.js";
import { syncChatsRouter } from "./routes/sync/chats.js";
import { syncAlertsRouter } from "./routes/sync/alerts.js";
import { syncSettingsRouter } from "./routes/sync/settings.js";
import { dbCheckProcedure } from "./routes/test/db-check.js";
import { registerParentProcedure } from "./routes/auth/register-parent.js";
import { registerChildProcedure } from "./routes/auth/register-child.js";
import { validateParentCodeProcedure } from "./routes/auth/validate-code.js";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  notifications: createTRPCRouter({
    registerDevice: registerDeviceProcedure,
    getSyncStatus: getSyncStatusProcedure,
    logDeviceTest: logDeviceTestProcedure,
    sendPushToDevice: sendPushToDeviceProcedure,
    sendPushToUser: sendPushToUserProcedure,
    sendRiskAlertPush: sendRiskAlertPushProcedure,
  }),
  sync: createTRPCRouter({
    chats: syncChatsRouter,
    alerts: syncAlertsRouter,
    settings: syncSettingsRouter,
  }),
  test: createTRPCRouter({
    dbCheck: dbCheckProcedure,
  }),
  auth: createTRPCRouter({
    registerParent: registerParentProcedure,
    registerChild: registerChildProcedure,
    validateParentCode: validateParentCodeProcedure,
  }),
});

export type AppRouter = typeof appRouter;
