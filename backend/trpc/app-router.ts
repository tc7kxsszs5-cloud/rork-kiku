import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { registerDeviceProcedure } from "./routes/notifications/register-device";
import { getSyncStatusProcedure } from "./routes/notifications/get-sync-status";
import { logDeviceTestProcedure } from "./routes/notifications/log-device-test";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  notifications: createTRPCRouter({
    registerDevice: registerDeviceProcedure,
    getSyncStatus: getSyncStatusProcedure,
    logDeviceTest: logDeviceTestProcedure,
  }),
});

export type AppRouter = typeof appRouter;
