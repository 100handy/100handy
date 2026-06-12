// Notification settings management functions
import { createClient } from '@/lib/supabase-client';
import type { NotificationSettings } from './types';

/**
 * Get user's notification settings
 */
export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Get notification settings
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no settings exist, return defaults
      if (error.code === 'PGRST116') {
        return {
          user_id: user.id,
          push_notifications: true,
          sms_notifications: true,
          email_notifications: true,
          marketing_emails: false,
          marketing_sms: false,
          marketing_push: false,
        };
      }
      console.error('Error fetching notification settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getNotificationSettings:', error);
    return null;
  }
}

/**
 * Update user's notification settings
 */
export async function updateNotificationSettings(
  settings: Partial<Omit<NotificationSettings, 'user_id'>>
): Promise<NotificationSettings | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Check if settings exist
    const { data: existing } = await supabase
      .from('notification_settings')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('notification_settings')
        .update(settings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('notification_settings')
        .insert({
          user_id: user.id,
          ...settings,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    }
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error);
    throw error;
  }
}
