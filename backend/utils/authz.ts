import { TRPCError } from '@trpc/server';
import type { Context } from '../trpc/create-context.js';
import { supabase } from './supabase.js';

export const assertDeviceAccess = async (ctx: Context, deviceId: string): Promise<void> => {
  if (!ctx.auth) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  if (ctx.auth.role === 'child') {
    if (!ctx.auth.deviceId || ctx.auth.deviceId !== deviceId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return;
  }

  if (ctx.auth.role === 'parent') {
    if (!ctx.auth.parentId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    if (!supabase) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
    }
    const { data, error } = await supabase
      .from('children')
      .select('parent_id')
      .eq('device_id', deviceId)
      .single();

    if (error || !data || data.parent_id !== ctx.auth.parentId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return;
  }

  throw new TRPCError({ code: 'UNAUTHORIZED' });
};
