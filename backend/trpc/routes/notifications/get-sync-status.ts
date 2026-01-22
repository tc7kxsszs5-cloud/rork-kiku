import { z } from 'zod';
import { publicProcedure } from '../../create-context.js';
import { getDeviceRecord, listDeviceRecords } from './store.js';

export const getSyncStatusProcedure = publicProcedure
  .input(z.object({ deviceId: z.string().optional() }).optional())
  .query(({ input }) => {
    if (input?.deviceId) {
      const device = getDeviceRecord(input.deviceId);
      return {
        devices: device ? [device] : [],
        device: device ?? null,
      };
    }

    return {
      devices: listDeviceRecords(),
      device: null,
    };
  });
