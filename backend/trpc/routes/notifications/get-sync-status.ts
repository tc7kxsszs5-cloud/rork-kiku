import { z } from 'zod';
import { protectedProcedure } from '../../create-context.js';
import { getDeviceRecord, listDeviceRecords } from './store.js';
import { assertDeviceAccess } from '../../../utils/authz.js';

export const getSyncStatusProcedure = protectedProcedure
  .input(z.object({ deviceId: z.string().optional() }).optional())
  .query(async ({ input, ctx }) => {
    if (input?.deviceId) {
      await assertDeviceAccess(ctx, input.deviceId);
      const device = getDeviceRecord(input.deviceId);
      return {
        devices: device ? [device] : [],
        device: device ?? null,
      };
    }

    return {
      devices: [],
      device: null,
    };
  });
