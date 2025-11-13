import { supabase } from './supabaseClient';
import type { HandymanProfile } from '../query/hooks/useHandymen';

export interface Favorite {
  customer_id: string;
  handy_id: string;
  created_at: string;
}

/**
 * Get all favorite handymen for a customer
 */
export async function getFavoriteHandymen(customerId: string): Promise<HandymanProfile[]> {
  try {
    // First, get favorite handy_ids
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('handy_id')
      .eq('customer_id', customerId);

    if (favError) {
      console.error('Error fetching favorites:', favError);
      throw new Error(`Failed to fetch favorites: ${favError.message}`);
    }

    if (!favorites || favorites.length === 0) {
      return [];
    }

    const handyIds = favorites.map(f => f.handy_id);

    // Fetch handy_profiles for these IDs
    const { data: handyProfiles, error: handyError } = await supabase
      .from('handy_profiles')
      .select('*')
      .in('user_id', handyIds);

    if (handyError) {
      console.error('Error fetching handy_profiles:', handyError);
      throw new Error(`Failed to fetch handyman profiles: ${handyError.message}`);
    }

    if (!handyProfiles || handyProfiles.length === 0) {
      return [];
    }

    // Fetch profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed')
      .in('user_id', handyIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // Create a map for quick lookup
    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    // Combine data
    const handymen: HandymanProfile[] = handyProfiles.map((handy) => {
      const profile = profileMap.get(handy.user_id);
      return {
        user_id: handy.user_id,
        bio: handy.bio,
        hourly_rate_cents: handy.hourly_rate_cents,
        experience_years: handy.experience_years,
        verified: handy.verified,
        created_at: handy.created_at,
        first_name: profile?.first_name || null,
        last_name: profile?.last_name || null,
        phone: profile?.phone || null,
        postcode: profile?.postcode || null,
        avatar_url: profile?.avatar_url || null,
        rating: profile?.rating || 0,
        jobs_completed: profile?.jobs_completed || 0,
        display_name: profile?.first_name ? `${profile.first_name} ${profile.last_name?.charAt(0) || ''}.` : 'Handyman',
        review_count: profile?.jobs_completed || 0,
      };
    });

    return handymen;
  } catch (error) {
    console.error('Error in getFavoriteHandymen:', error);
    throw error;
  }
}

/**
 * Add a handyman to favorites
 */
export async function addFavorite(customerId: string, handyId: string): Promise<Favorite> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        customer_id: customerId,
        handy_id: handyId,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate constraint (user already favorited this handyman)
      if (error.code === '23505') {
        console.log('Handyman already in favorites');
        // Fetch and return the existing favorite
        const { data: existing } = await supabase
          .from('favorites')
          .select('*')
          .eq('customer_id', customerId)
          .eq('handy_id', handyId)
          .single();

        if (existing) return existing;
      }

      console.error('Error adding favorite:', error);
      throw new Error(`Failed to add favorite: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in addFavorite:', error);
    throw error;
  }
}

/**
 * Remove a handyman from favorites
 */
export async function removeFavorite(customerId: string, handyId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('customer_id', customerId)
      .eq('handy_id', handyId);

    if (error) {
      console.error('Error removing favorite:', error);
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    throw error;
  }
}

/**
 * Check if a handyman is in favorites
 */
export async function isFavorite(customerId: string, handyId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('customer_id')
      .eq('customer_id', customerId)
      .eq('handy_id', handyId)
      .maybeSingle();

    if (error) {
      console.error('Error checking favorite:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isFavorite:', error);
    return false;
  }
}
