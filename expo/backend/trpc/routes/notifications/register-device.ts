import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { upsertDeviceRecord } from './store.js';
import { TRPCError } from '@trpc/server';

export const registerDeviceProcedure = protectedProcedure
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
  .mutation(({ input, ctx }) => {
    if (ctx.auth?.role === 'child' && ctx.auth.deviceId && ctx.auth.deviceId !== input.deviceId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    if (input.userId && ctx.auth?.userId && input.userId !== ctx.auth.userId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    const device = upsertDeviceRecord(input);
    return {
      device,
      syncedAt: device.lastSyncedAt,
    };
  });
