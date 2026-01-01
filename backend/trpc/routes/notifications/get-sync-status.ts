import { z } from 'zod';
import { publicProcedure } from '../../create-context';
import { getDeviceRecord, listDeviceRecords } from './store';

export const getSyncStatusProcedure = publicProcedure
  .input(z.object({ 
    deviceId: z.string().min(3).max(100).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid deviceId format').optional() 
  }).optional())
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
