// Business information and VAT management functions
import { createClient } from '@/lib/supabase';
import type { BusinessInfo } from './types';

/**
 * Get user's business information
 */
export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }

    // Get business info
    const { data, error } = await supabase
      .from('business_info')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no business info exists, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching business info:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getBusinessInfo:', error);
    return null;
  }
}

/**
 * Update or create business information
 */
export async function updateBusinessInfo(updates: {
  vat_id?: string | null;
  company_name?: string | null;
  business_type?: string | null;
}): Promise<BusinessInfo | null> {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Check if business info exists
    const existing = await getBusinessInfo();

    if (existing) {
      // Update existing business info
      const { data, error } = await supabase
        .from('business_info')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } else {
      // Insert new business info
      const { data, error } = await supabase
        .from('business_info')
        .insert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    }
  } catch (error) {
    console.error('Error in updateBusinessInfo:', error);
    throw error;
  }
}

/**
 * Update VAT ID
 */
export async function updateVatId(vatId: string): Promise<BusinessInfo | null> {
  // Validate UK VAT ID format (GB followed by 9 or 12 digits)
  const vatRegex = /^GB\d{9}(?:\d{3})?$/;
  
  if (vatId && !vatRegex.test(vatId.replace(/\s/g, ''))) {
    throw new Error('Invalid UK VAT ID format. Must be GB followed by 9 or 12 digits.');
  }

  return updateBusinessInfo({ vat_id: vatId });
}

/**
 * Delete business information
 */
export async function deleteBusinessInfo(): Promise<void> {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('business_info')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteBusinessInfo:', error);
    throw error;
  }
}
