// packages/shared/supabase/profile.ts
import { supabase } from './supabaseClient';
import { readFileAsBase64 } from './fileUtils';
import { decode } from 'base64-arraybuffer';

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
  referral_code?: string;
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
  identity_verified?: boolean;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  postcode?: string;
  avatar_url?: string | null;
  referral_code?: string;
}

function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function buildReferralDeepLink(code: string): string {
  const normalized = code.trim().toUpperCase();
  return `handy://(auth)/role-selection?ref=${encodeURIComponent(normalized)}`;
}

/**
 * Ensure the current user has a referral_code set on profiles.
 * Generates and stores an 8-char code if missing.
 */
export async function ensureReferralCode(): Promise<string | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data: existing, error: existingError } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('user_id', user.id)
      .single();

    if (existingError) {
      console.error('Error fetching existing referral_code:', existingError);
      return null;
    }

    if (existing?.referral_code) {
      return String(existing.referral_code).toUpperCase();
    }

    // Retry a few times in case of unique constraint collision.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateReferralCode(8);
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: code })
        .eq('user_id', user.id)
        .select('referral_code')
        .single();

      if (!updateError && updated?.referral_code) {
        return String(updated.referral_code).toUpperCase();
      }

      // 23505 = unique_violation
      if (updateError?.code === '23505') {
        continue;
      }

      console.error('Error updating referral_code:', updateError);
      return null;
    }

    console.error('Failed to generate unique referral_code after retries');
    return null;
  } catch (error) {
    console.error('Error in ensureReferralCode:', error);
    return null;
  }
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
      emailVerified: user.email_confirmed_at ? true : false,
      identity_verified: data.identity_verified ?? false,
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

    // Read image file as base64
    const base64 = await readFileAsBase64(imageUri);

    // Decode base64 to ArrayBuffer for Supabase upload
    const arrayBuffer = decode(base64);

    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload image to Supabase storage (scoped to user directory)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

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
    // New format: avatars/{userId}/{filename} (user-scoped)
    // Old format: avatars/{userId}-{filename} (flat)
    const url = new URL(profile.avatar_url);
    const segments = url.pathname.split('/');
    const bucketIdx = segments.indexOf('avatars');
    // Everything after "avatars/" is the storage path
    const filePath = bucketIdx >= 0 && bucketIdx < segments.length - 1
      ? segments.slice(bucketIdx + 1).join('/')
      : segments[segments.length - 1] || '';

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting avatar from storage:', deleteError);
    }

    // Update profile to remove image URL
    await updateUserProfile({ avatar_url: null });

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
  display_order: number;
  created_at: string;
}

/**
 * Upload a business photo for a specific skill
 * Saves to both Supabase Storage and business_photos table
 */
export async function uploadBusinessPhoto(
  userSkillId: string,
  imageUri: string
): Promise<BusinessPhoto | null> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Read image file as base64
    const base64 = await readFileAsBase64(imageUri);

    // Decode base64 to ArrayBuffer for Supabase upload
    const arrayBuffer = decode(base64);

    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${user.id}-${userSkillId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload image to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('business-photos')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading business photo:', uploadError);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('business-photos').getPublicUrl(filePath);

    // Get current max display_order for this skill
    const { data: existingPhotos } = await supabase
      .from('business_photos')
      .select('display_order')
      .eq('user_skill_id', userSkillId)
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = existingPhotos?.[0]?.display_order ?? -1;

    // Save photo reference to database
    const { data: photoRecord, error: dbError } = await supabase
      .from('business_photos')
      .insert({
        user_id: user.id,
        user_skill_id: userSkillId,
        photo_url: publicUrl,
        display_order: nextOrder + 1,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving photo to database:', dbError);
      // Clean up storage if DB insert failed
      await supabase.storage.from('business-photos').remove([filePath]);
      return null;
    }

    return photoRecord;
  } catch (error) {
    console.error('Error in uploadBusinessPhoto:', error);
    return null;
  }
}

/**
 * Delete a business photo from both storage and database
 */
export async function deleteBusinessPhoto(photoId: string): Promise<boolean> {
  try {
    // Get the photo record to get the URL
    const { data: photo, error: fetchError } = await supabase
      .from('business_photos')
      .select('photo_url')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.error('Error fetching photo record:', fetchError);
      return false;
    }

    // Extract file path from URL
    const url = new URL(photo.photo_url);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];

    if (!fileName) {
      console.error('Could not extract file name from URL:', photo.photo_url);
      return false;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('business-photos')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue to delete DB record anyway
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('business_photos')
      .delete()
      .eq('id', photoId);

    if (dbError) {
      console.error('Error deleting photo from database:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBusinessPhoto:', error);
    return false;
  }
}

/**
 * Get all business photos for a user, grouped by skill
 */
export async function getBusinessPhotosByUser(
  userId?: string
): Promise<BusinessPhoto[]> {
  try {
    let query = supabase
      .from('business_photos')
      .select('*')
      .order('user_skill_id')
      .order('display_order', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      // Get current user's photos
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching business photos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBusinessPhotosByUser:', error);
    return [];
  }
}

/**
 * Get business photos for a specific skill
 */
export async function getBusinessPhotosForSkill(
  userSkillId: string
): Promise<BusinessPhoto[]> {
  try {
    const { data, error } = await supabase
      .from('business_photos')
      .select('*')
      .eq('user_skill_id', userSkillId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching photos for skill:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBusinessPhotosForSkill:', error);
    return [];
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
      .maybeSingle();

    if (error) {
      console.error('Error fetching handy profile:', error);
      return null;
    }

    return data ?? null;
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
 * Switch the current authenticated user to professional (handy) mode.
 *
 * Updates:
 * - auth user metadata: role = 'handy'
 * - profiles.role = 'handy'
 * - ensures a handy_profiles row exists
 */
export async function switchToProfessionalRole(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Save previous role for rollback
    const previousRole = user.user_metadata?.role || 'customer';

    // Ensure handy profile exists first (so onboarding screens can load safely)
    const handyProfile = await ensureHandyProfile();
    if (!handyProfile) {
      console.error('Failed to ensure handy profile exists');
      return false;
    }

    // Step 1: Update profiles table role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'handy' })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profiles.role:', profileError);
      return false;
    }

    // Step 2: Update auth user metadata role (used by client routing)
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { role: 'handy' },
    });

    if (metadataError) {
      console.error('Error updating auth user metadata role:', metadataError);
      // Rollback profiles table to previous role
      await supabase
        .from('profiles')
        .update({ role: previousRole })
        .eq('user_id', user.id);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in switchToProfessionalRole:', error);
    return false;
  }
}

/**
 * Switch the current authenticated user to customer mode.
 *
 * Updates:
 * - auth user metadata: role = 'customer'
 * - profiles.role = 'customer'
 */
export async function switchToCustomerRole(): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    // Save previous role for rollback
    const previousRole = user.user_metadata?.role || 'handy';

    // Step 1: Update profiles table role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'customer' })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Error updating profiles.role:', profileError);
      return false;
    }

    // Step 2: Update auth user metadata role (used by client routing)
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { role: 'customer' },
    });

    if (metadataError) {
      console.error('Error updating auth user metadata role:', metadataError);
      // Rollback profiles table to previous role
      await supabase
        .from('profiles')
        .update({ role: previousRole })
        .eq('user_id', user.id);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in switchToCustomerRole:', error);
    return false;
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

    // Read image file as base64
    const base64 = await readFileAsBase64(imageUri);

    // Decode base64 to ArrayBuffer for Supabase upload
    const arrayBuffer = decode(base64);

    const fileExt = imageUri.split('.').pop() || 'jpg';
    const fileName = `${user.id}-${documentType}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload document to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

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

// ============= PROFESSIONAL PROFILE EXTRAS FUNCTIONS =============

export interface HandyProfileExtras {
  tools: string[];
  vehicles: string[];
  quick_facts: string[];
  about_me: string | null;
  sync_calendars: boolean;
}

/**
 * Get professional profile extras (tools, vehicles, quick facts, about me)
 */
export async function getHandyProfileExtras(): Promise<HandyProfileExtras | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('handy_profiles')
      .select('tools, vehicles, quick_facts, about_me, sync_calendars')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching handy profile extras:', error);
      return null;
    }

    return {
      tools: (data.tools as string[]) || [],
      vehicles: (data.vehicles as string[]) || [],
      quick_facts: (data.quick_facts as string[]) || [],
      about_me: data.about_me || null,
      sync_calendars: data.sync_calendars ?? true,
    };
  } catch (error) {
    console.error('Error in getHandyProfileExtras:', error);
    return null;
  }
}

/**
 * Update professional tools
 */
export async function updateHandyTools(tools: string[]): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('handy_profiles')
      .update({ tools })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating handy tools:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateHandyTools:', error);
    return false;
  }
}

/**
 * Update professional vehicles
 */
export async function updateHandyVehicles(vehicles: string[]): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('handy_profiles')
      .update({ vehicles })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating handy vehicles:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateHandyVehicles:', error);
    return false;
  }
}

/**
 * Update professional quick facts
 */
export async function updateHandyQuickFacts(quickFacts: string[]): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('handy_profiles')
      .update({ quick_facts: quickFacts })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating handy quick facts:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateHandyQuickFacts:', error);
    return false;
  }
}

/**
 * Update professional about me
 */
export async function updateHandyAboutMe(aboutMe: string): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('handy_profiles')
      .update({ about_me: aboutMe })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating handy about me:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateHandyAboutMe:', error);
    return false;
  }
}

/**
 * Update sync calendars setting
 */
export async function updateHandySyncCalendars(syncCalendars: boolean): Promise<boolean> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return false;
    }

    const { error } = await supabase
      .from('handy_profiles')
      .update({ sync_calendars: syncCalendars })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating handy sync calendars:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateHandySyncCalendars:', error);
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
  template_type: 'default' | 'ongoing' | string;
  message: string;
}

/**
 * Get a specific chat template for the current user
 */
export async function getChatTemplate(
  templateType: 'default' | 'ongoing' | string
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
 * Delete a chat template by type
 */
export async function deleteChatTemplate(
  templateType: 'default' | 'ongoing' | string
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

/**
 * Delete a chat template by ID
 */
export async function deleteChatTemplateById(
  templateId: string
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
      .eq('id', templateId)
      .eq('user_id', user.id); // Ensure user can only delete their own templates

    if (error) {
      console.error('Error deleting chat template by ID:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteChatTemplateById:', error);
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
  experience_description?: string;
  supplies_owned?: string[];
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
 * Uses upsert to handle cases where the skill already exists (will update instead of failing)
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
      .upsert(
        {
          user_id: user.id,
          skill_id: input.skill_id,
          hourly_rate_cents: input.hourly_rate_cents || 0,
          is_active: input.is_active !== undefined ? input.is_active : true,
        },
        {
          onConflict: 'user_id,skill_id',
        }
      )
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
 * Update user skill details (experience description and supplies)
 */
export async function updateUserSkillDetails(
  userSkillId: string,
  updates: {
    experience_description?: string;
    supplies_owned?: string[];
  }
): Promise<UserSkill | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    const updateData: any = {};
    if (updates.experience_description !== undefined) {
      updateData.experience_description = updates.experience_description || null;
    }
    if (updates.supplies_owned !== undefined) {
      // Ensure supplies_owned is always an array for JSONB
      updateData.supplies_owned = Array.isArray(updates.supplies_owned) ? updates.supplies_owned : [];
    }

    const { data, error } = await supabase
      .from('user_skills')
      .update(updateData)
      .eq('id', userSkillId)
      .eq('user_id', user.id)
      .select(`
        *,
        skill:skills(*)
      `)
      .single();

    if (error) {
      console.error('Error updating user skill details:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserSkillDetails:', error);
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

// ============= SKILL SETS & TOOLS FUNCTIONS =============

export interface SkillSet {
  id: string;
  skill_id: string;
  skill_type: 'required' | 'additional';
  description: string;
  display_order: number;
  created_at: string;
}

export interface SkillTool {
  id: string;
  skill_id: string;
  tool_name: string;
  is_required: boolean;
  display_order: number;
  created_at: string;
}

/**
 * Get skill sets for a specific skill
 */
export async function getSkillSets(skillId: string): Promise<SkillSet[]> {
  try {
    const { data, error } = await supabase
      .from('skill_sets')
      .select('*')
      .eq('skill_id', skillId)
      .order('skill_type', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching skill sets:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSkillSets:', error);
    return [];
  }
}

/**
 * Get tools for a specific skill
 */
export async function getSkillTools(skillId: string): Promise<SkillTool[]> {
  try {
    const { data, error } = await supabase
      .from('skill_tools')
      .select('*')
      .eq('skill_id', skillId)
      .order('is_required', { ascending: false })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching skill tools:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSkillTools:', error);
    return [];
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
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      console.error('Error getting authenticated session:', authError);
      return false;
    }

    // Call the edge function which uses admin privileges to fully delete the account
    const { error } = await supabase.functions.invoke('delete-user-account', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) {
      console.error('Error deleting user account:', error);
      return false;
    }

    // Sign out locally after successful deletion
    await supabase.auth.signOut();

    return true;
  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    return false;
  }
}