import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { appendTestResults } from './store';

const testResultSchema = z.object({
  id: z.string().min(3).max(100),
  type: z.enum(['permissions', 'token', 'delivery', 'sync']),
  status: z.enum(['passed', 'failed']),
  message: z.string().min(1).max(500),
  timestamp: z.number().int().min(946684800000), // Min: Jan 1, 2000 in milliseconds
  deviceLabel: z.string().max(200).optional(),
});

export const logDeviceTestProcedure = publicProcedure
  .input(
    z.object({
      deviceId: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid deviceId format'),
      results: z.array(testResultSchema).min(1).max(20), // Limit to prevent abuse
    }),
  )
  .mutation(({ input }) => {
    const device = appendTestResults(input.deviceId, input.results);
    if (!device) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Device not registered' });
    }

    return {
      device,
      lastTestedAt: device.lastTestedAt,
    };
  });
