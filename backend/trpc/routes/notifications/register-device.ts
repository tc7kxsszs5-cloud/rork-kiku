import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { upsertDeviceRecord } from './store';
import { isValidUserId } from '@/lib/error-utils';

export const registerDeviceProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid deviceId format'),
      pushToken: z.string().min(10).max(500),
      platform: z.enum(['ios', 'android', 'web']),
      appVersion: z.string().optional(),
      userId: z.string().min(1).max(100).optional().refine(
        isValidUserId,
        { message: 'userId cannot be empty or whitespace' }
      ),
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
