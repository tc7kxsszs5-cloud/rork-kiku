import { TRPCError } from '@trpc/server';
import { supabase } from './supabase.js';

export type CommunicationMode = 'open' | 'groups' | 'invites';

const DEFAULT_MODE: CommunicationMode = 'open';

export const getChildByDeviceId = async (deviceId: string): Promise<{ id: string; parent_id: string; is_active: boolean } | null> => {
  if (!supabase) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
  }

  const { data, error } = await supabase
    .from('children')
    .select('id,parent_id,is_active')
    .eq('device_id', deviceId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as { id: string; parent_id: string; is_active: boolean };
};

export const getCommunicationMode = async (deviceId: string): Promise<CommunicationMode> => {
  if (!supabase) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
  }

  const { data, error } = await supabase
    .from('settings')
    .select('settings_data')
    .eq('device_id', deviceId)
    .single();

  if (error || !data) {
    return DEFAULT_MODE;
  }

  const mode = (data.settings_data as any)?.communicationMode;
  if (mode === 'open' || mode === 'groups' || mode === 'invites') {
    return mode;
  }

  return DEFAULT_MODE;
};

export const assertChildrenVerified = async (childIds: string[]): Promise<void> => {
  if (!supabase) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
  }

  if (childIds.length === 0) return;

  const { data, error } = await supabase
    .from('children')
    .select('id,is_active')
    .in('id', childIds);

  if (error || !data) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Child verification failed' });
  }

  const activeIds = new Set(data.filter((row) => row.is_active).map((row) => row.id));

  for (const id of childIds) {
    if (!activeIds.has(id)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Unverified child participant' });
    }
  }
};

export const assertConnectionsApproved = async (childId: string, otherChildIds: string[]): Promise<void> => {
  if (!supabase) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
  }

  if (otherChildIds.length === 0) return;

  const { data, error } = await supabase
    .from('child_connections')
    .select('child_id,other_child_id,status')
    .or(`child_id.eq.${childId},other_child_id.eq.${childId}`);

  if (error) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Connection verification failed' });
  }

  const approved = new Set<string>();
  for (const row of data || []) {
    if (row.status !== 'approved') continue;
    const otherId = row.child_id === childId ? row.other_child_id : row.child_id;
    if (otherId) approved.add(otherId);
  }

  for (const otherId of otherChildIds) {
    if (!approved.has(otherId)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Connection not approved' });
    }
  }
};

export const assertSharedGroup = async (childId: string, otherChildIds: string[]): Promise<void> => {
  if (!supabase) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Supabase client not initialized' });
  }

  if (otherChildIds.length === 0) return;

  const { data: childGroups, error: childGroupsError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('child_id', childId)
    .eq('status', 'approved');

  if (childGroupsError || !childGroups || childGroups.length === 0) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No approved groups' });
  }

  const groupIds = childGroups.map((row) => row.group_id);

  const { data: sharedRows, error: sharedError } = await supabase
    .from('group_members')
    .select('child_id,group_id')
    .in('child_id', otherChildIds)
    .in('group_id', groupIds)
    .eq('status', 'approved');

  if (sharedError) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Group verification failed' });
  }

  const sharedChildren = new Set(sharedRows?.map((row) => row.child_id) || []);

  for (const otherId of otherChildIds) {
    if (!sharedChildren.has(otherId)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'No shared approved group' });
    }
  }
};

