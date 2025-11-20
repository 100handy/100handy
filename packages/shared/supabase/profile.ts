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