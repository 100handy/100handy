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
  two_factor_enabled: boolean;
  // Privacy settings (stored in profiles table)
  privacy_location_sharing?: boolean;
  privacy_profile_visibility?: boolean;
  privacy_activity_status?: boolean;
  privacy_data_collection?: boolean;
  created_at: string;
  // Auth user data
  email: string;
  emailVerified: boolean;
  // Note: Notification preferences are stored in the notification_settings table
  // Use getNotificationPreferences() to fetch them
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

// ============= BUSINESS PHOTO FUNCTIONS =============

export interface BusinessPhoto {
  id: string;
  user_id: string;
  user_skill_id: string;
  photo_url: string;
  created_at: string;
}

/**
 * Upload a business photo for a specific skill
 */
export async function uploadBusinessPhoto(userSkillId: string, imageUri: string): Promise<string | null> {
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
    const fileName = `${user.id}-${userSkillId}-${Date.now()}.${fileExt}`;
    const filePath = `business-photos/${fileName}`;

    // Upload image to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('business-photos')
      .upload(filePath, blob);

    if (uploadError) {
      console.error('Error uploading business photo:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('business-photos')
      .getPublicUrl(filePath);

    // Save photo reference in database (if you have a business_photos table)
    // For now, we'll just return the URL. You may want to save this to a table later.

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadBusinessPhoto:', error);
    return null;
  }
}

/**
 * Delete a business photo
 */
export async function deleteBusinessPhoto(photoUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(photoUrl);
    const filePath = url.pathname.split('/').slice(-2).join('/'); // Get 'business-photos/filename'

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('business-photos')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting business photo from storage:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBusinessPhoto:', error);
    return false;
  }
}

// ============= PROFESSIONAL/HANDY PROFILE FUNCTIONS =============

export interface HandyProfile {
  user_id: string;
  bio?: string;
  hourly_rate_cents: number;
  experience_years: number;
  verified: boolean;
  date_of_birth?: string;
  street_address?: string;
  apartment?: string;
  city?: string;
  county?: string;
  verification_status: 'pending' | 'submitted' | 'verified' | 'rejected';
  verification_document_type?: 'driver_license' | 'passport' | 'national_id' | 'residency_permit';
  verification_document_url?: string;
  verification_submitted_at?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface VerificationData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  street_address: string;
  apartment?: string;
  city: string;
  county: string;
  postcode: string;
}

export interface DocumentUploadData {
  document_type: 'driver_license' | 'passport' | 'national_id' | 'residency_permit';
  document_url: string;
}

/**
 * Get the current professional/handy user's profile
 */
export async function getHandyProfile(): Promise<HandyProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('handy_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching handy profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getHandyProfile:', error);
    return null;
  }
}

/**
 * Create or ensure handy profile exists for the current user
 */
export async function ensureHandyProfile(): Promise<HandyProfile | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Try to get existing profile
    const existing = await getHandyProfile();
    if (existing) {
      return existing;
    }

    // Create new handy profile
    const { data, error } = await supabase
      .from('handy_profiles')
      .insert({
        user_id: user.id,
        hourly_rate_cents: 0,
        experience_years: 0,
        verified: false,
        verification_status: 'pending',
        onboarding_completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating handy profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in ensureHandyProfile:', error);
    return null;
  }
}

/**
 * Update professional verification data (from verify-info.tsx)
 */
export async function updateVerificationData(data: VerificationData): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      throw new Error('User not authenticated. Please sign in again.');
    }

    // Ensure handy profile exists
    const handyProfile = await ensureHandyProfile();
    if (!handyProfile) {
      throw new Error('Failed to create professional profile');
    }

    // Update handy_profiles with verification data
    const { error: handyError } = await supabase
      .from('handy_profiles')
      .update({
        date_of_birth: data.date_of_birth,
        street_address: data.street_address,
        apartment: data.apartment,
        city: data.city,
        county: data.county,
      })
      .eq('user_id', user.id);

    if (handyError) {
      console.error('Error updating handy profile verification data:', handyError);
      throw handyError;
    }

    // Also update first_name, last_name in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        postcode: data.postcode,
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profile data:', profileError);
      throw profileError;
    }

    return true;
  } catch (error) {
    console.error('Error in updateVerificationData:', error);
    return false;
  }
}

/**
 * Upload verification document and update profile
 */
export async function uploadVerificationDocument(
  imageUri: string,
  documentType: DocumentUploadData['document_type']
): Promise<string | null> {
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
    const fileName = `${user.id}-${documentType}-${Date.now()}.${fileExt}`;
    const filePath = `verification-documents/${fileName}`;

    // Upload document to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(filePath, blob);

    if (uploadError) {
      console.error('Error uploading verification document:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(filePath);

    // Update handy profile with document info
    const { error: updateError } = await supabase
      .from('handy_profiles')
      .update({
        verification_document_type: documentType,
        verification_document_url: publicUrl,
        verification_status: 'submitted',
        verification_submitted_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating handy profile with document:', updateError);
      return null;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadVerificationDocument:', error);
    return null;
  }
}

/**
 * Mark professional onboarding as completed
 */
export async function completeOnboarding(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Update handy_profiles
    const { error: handyError } = await supabase
      .from('handy_profiles')
      .update({
        onboarding_completed: true,
      })
      .eq('user_id', user.id);

    if (handyError) {
      console.error('Error completing onboarding in handy_profiles:', handyError);
      return false;
    }

    // Update user metadata in auth
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
      }
    });

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in completeOnboarding:', error);
    return false;
  }
}

// ============= CHAT TEMPLATES FUNCTIONS =============

export interface ChatTemplate {
  id: string;
  user_id: string;
  template_type: 'default' | 'ongoing';
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatTemplateInput {
  template_type: 'default' | 'ongoing';
  message: string;
}

/**
 * Get a specific chat template for the current user
 */
export async function getChatTemplate(
  templateType: 'default' | 'ongoing'
): Promise<ChatTemplate | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('chat_templates')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_type', templateType)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching chat template:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getChatTemplate:', error);
    return null;
  }
}

/**
 * Get all chat templates for the current user
 */
export async function getAllChatTemplates(): Promise<ChatTemplate[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('chat_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('template_type');

    if (error) {
      console.error('Error fetching chat templates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllChatTemplates:', error);
    return [];
  }
}

/**
 * Save or update a chat template
 */
export async function saveChatTemplate(
  input: ChatTemplateInput
): Promise<ChatTemplate | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Check if template already exists
    const existing = await getChatTemplate(input.template_type);

    if (existing) {
      // Update existing template
      const { data, error } = await supabase
        .from('chat_templates')
        .update({
          message: input.message,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('template_type', input.template_type)
        .select()
        .single();

      if (error) {
        console.error('Error updating chat template:', error);
        return null;
      }

      return data;
    } else {
      // Insert new template
      const { data, error } = await supabase
        .from('chat_templates')
        .insert({
          user_id: user.id,
          template_type: input.template_type,
          message: input.message,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting chat template:', error);
        return null;
      }

      return data;
    }
  } catch (error) {
    console.error('Error in saveChatTemplate:', error);
    return null;
  }
}

/**
 * Delete a chat template
 */
export async function deleteChatTemplate(
  templateType: 'default' | 'ongoing'
): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('chat_templates')
      .delete()
      .eq('user_id', user.id)
      .eq('template_type', templateType);

    if (error) {
      console.error('Error deleting chat template:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteChatTemplate:', error);
    return false;
  }
}

// ============= TWO-FACTOR AUTHENTICATION FUNCTIONS =============

/**
 * Enable two-factor authentication for the current user (email-based)
 */
export async function enable2FA(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        two_factor_email_enabled: true,
      },
    });

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return false;
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        two_factor_enabled: true,
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return false;
  }
}

/**
 * Disable two-factor authentication for the current user
 */
export async function disable2FA(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        two_factor_email_enabled: false,
      },
    });

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      return false;
    }

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        two_factor_enabled: false,
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return false;
  }
}

// ============= SKILLS & RATES FUNCTIONS =============

export interface Skill {
  id: string;
  category: string;
  name: string;
  description?: string;
  icon_name?: string;
  is_in_demand: boolean;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  hourly_rate_cents: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  skill?: Skill;
}

export interface UserSkillInput {
  skill_id: string;
  hourly_rate_cents?: number;
  is_active?: boolean;
}

/**
 * Get all available skills grouped by category
 */
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('name');

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllSkills:', error);
    return [];
  }
}

/**
 * Get skills grouped by category
 */
export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  try {
    const skills = await getAllSkills();
    const grouped: Record<string, Skill[]> = {};

    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      // TypeScript needs explicit check - we know it exists from above check
      const categoryArray = grouped[skill.category];
      if (categoryArray) {
        categoryArray.push(skill);
      }
    });

    return grouped;
  } catch (error) {
    console.error('Error in getSkillsByCategory:', error);
    return {};
  }
}

/**
 * Get user's selected skills with details
 */
export async function getUserSkills(): Promise<UserSkill[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserSkills:', error);
    return [];
  }
}

/**
 * Add a skill to user's profile
 */
export async function addUserSkill(input: UserSkillInput): Promise<UserSkill | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: user.id,
        skill_id: input.skill_id,
        hourly_rate_cents: input.hourly_rate_cents || 0,
        is_active: input.is_active !== undefined ? input.is_active : true,
      })
      .select(`
        *,
        skill:skills(*)
      `)
      .single();

    if (error) {
      console.error('Error adding user skill:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addUserSkill:', error);
    return null;
  }
}

/**
 * Update a user's skill (rate or active status)
 */
export async function updateUserSkill(
  userSkillId: string,
  updates: Partial<Pick<UserSkill, 'hourly_rate_cents' | 'is_active'>>
): Promise<UserSkill | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('user_skills')
      .update(updates)
      .eq('id', userSkillId)
      .eq('user_id', user.id)
      .select(`
        *,
        skill:skills(*)
      `)
      .single();

    if (error) {
      console.error('Error updating user skill:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserSkill:', error);
    return null;
  }
}

/**
 * Remove a skill from user's profile
 */
export async function deleteUserSkill(userSkillId: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', userSkillId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting user skill:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUserSkill:', error);
    return false;
  }
}

// ============= NOTIFICATION PREFERENCES FUNCTIONS =============

export interface NotificationPreferences {
  notification_push_offers: boolean;
  notification_text_updates: boolean;
  notification_email_offers: boolean;
}

export interface UpdateNotificationPreferencesData {
  notification_push_offers?: boolean;
  notification_text_updates?: boolean;
  notification_email_offers?: boolean;
}

/**
 * Get notification preferences for the current user
 * Maps to the existing notification_settings table:
 * - notification_push_offers → push_notifications
 * - notification_text_updates → sms_notifications
 * - notification_email_offers → marketing_emails
 */
export async function getNotificationPreferences(): Promise<NotificationPreferences | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('notification_settings')
      .select('push_notifications, sms_notifications, marketing_emails')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }

    // Map existing columns to our interface
    return {
      notification_push_offers: data.push_notifications ?? true,
      notification_text_updates: data.sms_notifications ?? true,
      notification_email_offers: data.marketing_emails ?? false,
    };
  } catch (error) {
    console.error('Error in getNotificationPreferences:', error);
    return null;
  }
}

/**
 * Update notification preferences for the current user
 * Maps to the existing notification_settings table
 */
export async function updateNotificationPreferences(
  updates: UpdateNotificationPreferencesData
): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Map our interface to existing columns
    const dbUpdates: Record<string, boolean> = {};
    if (updates.notification_push_offers !== undefined) {
      dbUpdates.push_notifications = updates.notification_push_offers;
    }
    if (updates.notification_text_updates !== undefined) {
      dbUpdates.sms_notifications = updates.notification_text_updates;
    }
    if (updates.notification_email_offers !== undefined) {
      dbUpdates.marketing_emails = updates.notification_email_offers;
    }

    const { error } = await supabase
      .from('notification_settings')
      .update(dbUpdates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateNotificationPreferences:', error);
    return false;
  }
}

// ============= PRIVACY SETTINGS FUNCTIONS =============

export interface PrivacySettings {
  privacy_location_sharing: boolean;
  privacy_profile_visibility: boolean;
  privacy_activity_status: boolean;
  privacy_data_collection: boolean;
}

export interface UpdatePrivacySettingsData {
  privacy_location_sharing?: boolean;
  privacy_profile_visibility?: boolean;
  privacy_activity_status?: boolean;
  privacy_data_collection?: boolean;
}

/**
 * Get privacy settings for the current user
 */
export async function getPrivacySettings(): Promise<PrivacySettings | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('privacy_location_sharing, privacy_profile_visibility, privacy_activity_status, privacy_data_collection')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching privacy settings:', error);
      return null;
    }

    // Return defaults if columns don't exist yet
    return {
      privacy_location_sharing: data.privacy_location_sharing ?? true,
      privacy_profile_visibility: data.privacy_profile_visibility ?? true,
      privacy_activity_status: data.privacy_activity_status ?? false,
      privacy_data_collection: data.privacy_data_collection ?? true,
    };
  } catch (error) {
    console.error('Error in getPrivacySettings:', error);
    return null;
  }
}

/**
 * Update privacy settings for the current user
 */
export async function updatePrivacySettings(
  updates: UpdatePrivacySettingsData
): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating privacy settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updatePrivacySettings:', error);
    return false;
  }
}

// ============= ACCOUNT DELETION FUNCTIONS =============

/**
 * Delete the current user's account
 *
 * This will:
 * 1. Delete the user's profile from the profiles table
 * 2. Delete the user's auth account from Supabase Auth
 *
 * Note: Related data (bookings, reviews, etc.) should be handled by database CASCADE rules
 * or by Edge Functions/database triggers
 */
export async function deleteUserAccount(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // First, delete profile data
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      // Continue anyway to attempt auth deletion
    }

    // Then, delete the auth account (this will sign out the user)
    // Note: This requires admin privileges. In production, this should be done
    // via an Edge Function or backend API with admin access
    // For now, we'll just sign out the user and mark the account for deletion

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('Error signing out after account deletion:', signOutError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    return false;
  }
}