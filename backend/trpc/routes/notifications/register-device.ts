import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { upsertDeviceRecord } from './store';

export const registerDeviceProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string().min(3),
      pushToken: z.string().min(10),
      platform: z.enum(['ios', 'android', 'web']),
      appVersion: z.string().optional(),
      userId: z.string().optional(),
      permissions: z.string().optional(),
    }),
  )
  .mutation(({ input }) => {
    const device = upsertDeviceRecord(input);
    return {
      device,
      syncedAt: device.lastSyncedAt,
    };
  });
