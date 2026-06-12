// Profile management functions
import { createClient } from '@/lib/supabase-client';
import type { ProfileWithAuth, UpdateProfileData } from './types';

/**
 * Get the current user's profile with auth data
 */
export async function getProfile(): Promise<ProfileWithAuth | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Combine auth and profile data
    return {
      ...profile,
      email: user.email || '',
      emailVerified: !!user.email_confirmed_at,
    };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(updates: UpdateProfileData): Promise<ProfileWithAuth | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return {
      ...profile,
      email: user.email || '',
      emailVerified: !!user.email_confirmed_at,
    };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
}

/**
 * Upload avatar image to Supabase Storage
 */
export async function uploadAvatar(file: File): Promise<string> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    throw error;
  }
}

/**
 * Delete user's avatar
 */
export async function deleteAvatar(): Promise<void> {
  try {
    const supabase = createClient();
    
    const profile = await getProfile();
    
    if (!profile?.avatar_url) {
      return; // No avatar to delete
    }

    // Extract file path from URL
    const url = new URL(profile.avatar_url);
    const pathParts = url.pathname.split('/');
    const filePath = `avatars/${pathParts[pathParts.length - 1]}`;

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting avatar from storage:', deleteError);
    }

    // Update profile to remove avatar URL
    await updateProfile({ avatar_url: null as any });
  } catch (error) {
    console.error('Error in deleteAvatar:', error);
    throw error;
  }
}
