import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { upsertDeviceRecord } from './store';

export const registerDeviceProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid deviceId format'),
      pushToken: z.string().min(10).max(500),
      platform: z.enum(['ios', 'android', 'web']),
      appVersion: z.string().optional(),
      userId: z.string().min(1).max(100).optional(),
      permissions: z.string().optional(),
    }),
  )
  .mutation(({ input }) => {
    // Validate that userId is not just whitespace if provided
    if (input.userId && input.userId.trim().length === 0) {
      throw new Error('userId cannot be empty or whitespace');
    }
    
    const device = upsertDeviceRecord(input);
    return {
      device,
      syncedAt: device.lastSyncedAt,
    };
  });
