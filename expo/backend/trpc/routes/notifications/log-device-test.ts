import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { appendTestResults } from './store.js';
import { assertDeviceAccess } from '../../../utils/authz.js';

const testResultSchema = z.object({
  id: z.string().min(3),
  type: z.enum(['permissions', 'token', 'delivery', 'sync']),
  status: z.enum(['passed', 'failed']),
  message: z.string().min(1),
  timestamp: z.number().int(),
  deviceLabel: z.string().optional(),
});

export const logDeviceTestProcedure = protectedProcedure
  .input(
    z.object({
      deviceId: z.string().min(3),
      results: z.array(testResultSchema).min(1),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    await assertDeviceAccess(ctx, input.deviceId);
    const device = appendTestResults(input.deviceId, input.results);
    if (!device) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Device not registered' });
    }

    return {
      device,
      lastTestedAt: device.lastTestedAt,
    };
  });
