import { supabase } from './supabaseClient';

export type DevicePlatform = 'ios' | 'android';

export interface UpsertDevicePushTokenInput {
  expoPushToken: string;
  platform: DevicePlatform;
  deviceId?: string | null;
}

export async function upsertDevicePushToken(input: UpsertDevicePushTokenInput): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from('device_push_tokens')
    .upsert(
      {
        user_id: user.id,
        expo_push_token: input.expoPushToken,
        platform: input.platform,
        device_id: input.deviceId ?? null,
        updated_at: now,
        last_seen_at: now,
      },
      { onConflict: 'user_id,expo_push_token' }
    );

  if (error) {
    throw error;
  }
}

export async function deleteDevicePushToken(expoPushToken: string): Promise<void> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('device_push_tokens')
    .delete()
    .eq('user_id', user.id)
    .eq('expo_push_token', expoPushToken);

  if (error) {
    throw error;
  }
}


