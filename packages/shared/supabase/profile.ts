// packages/shared/supabase/profile.ts
import { supabase } from './supabaseClient.native';

export interface UserProfile {
  user_id: string;
  role: 'customer' | 'handy' | 'admin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  postcode?: string;
  avatar_url?: string;
  rating?: number;
  jobs_completed?: number;
  created_at: string;
  // Auth user data
  email: string;
  emailVerified: boolean;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  postcode?: string;
  avatar_url?: string;
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Query the profiles table for additional profile data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // Combine auth user data with profile data
    return {
      ...data,
      email: user.email || '',
      emailVerified: user.email_confirmed_at ? true : false
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: UpdateProfileData): Promise<UserProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Update the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    // Combine auth user data with profile data
    return {
      ...data,
      email: user.email || '',
      emailVerified: user.email_confirmed_at ? true : false
    };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

/**
 * Update user avatar/profile image
 */
export async function updateUserAvatar(imageUri: string): Promise<string | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Convert image URI to blob for upload
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const fileExt = imageUri.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob);

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user profile with new image URL
    await updateUserProfile({ avatar_url: publicUrl });

    return publicUrl;
  } catch (error) {
    console.error('Error in updateUserAvatar:', error);
    return null;
  }
}

/**
 * Delete user avatar
 */
export async function deleteUserAvatar(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    
    if (!profile?.avatar_url) {
      return true; // No avatar to delete
    }

    // Extract file path from URL
    const url = new URL(profile.avatar_url);
    const filePath = url.pathname.split('/').slice(-2).join('/'); // Get 'avatars/filename'

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting avatar from storage:', deleteError);
    }

    // Update profile to remove image URL
    await updateUserProfile({ avatar_url: undefined });

    return true;
  } catch (error) {
    console.error('Error in deleteUserAvatar:', error);
    return false;
  }
}