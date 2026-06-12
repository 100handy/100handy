import { createClient } from '@/lib/supabase';

export interface HandymanProfile {
  user_id: string;
  bio: string | null;
  hourly_rate_cents: number;
  experience_years: number;
  verified: boolean;
  created_at: string;
  // Joined from profiles table
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  postcode: string | null;
  avatar_url: string | null;
  rating: number;
  jobs_completed: number;
  // Computed fields
  display_name?: string;
  review_count?: number;
  recent_review?: {
    text: string;
    author: string;
    date: string;
  };
  vehicle?: string;
}

export interface HandymanFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  postcode?: string;
  date?: string;
  timeSlot?: string;
  isElite?: boolean;
  sortBy?: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'reviews';
}

/**
 * Get all handymen profiles with optional filters
 */
export async function getHandymen(filters?: HandymanFilters): Promise<HandymanProfile[]> {
  const supabase = createClient();

  // Get user IDs filtered by category first
  let userIds: string[] | undefined;
  if (filters?.categoryId) {
    const { data: categoryHandymen } = await supabase
      .from('handy_categories')
      .select('handy_id')
      .eq('category_id', filters.categoryId);

    if (!categoryHandymen || categoryHandymen.length === 0) {
      return [];
    }
    userIds = categoryHandymen.map(item => item.handy_id);
  }

  // Build handy_profiles query
  let handyQuery = supabase.from('handy_profiles').select('*');

  if (userIds) {
    handyQuery = handyQuery.in('user_id', userIds);
  }

  // Apply price filter
  if (filters?.minPrice !== undefined) {
    handyQuery = handyQuery.gte('hourly_rate_cents', filters.minPrice * 100);
  }
  if (filters?.maxPrice !== undefined) {
    handyQuery = handyQuery.lte('hourly_rate_cents', filters.maxPrice * 100);
  }

  // Apply elite filter
  if (filters?.isElite) {
    handyQuery = handyQuery.eq('verified', true);
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'recommended';
  switch (sortBy) {
    case 'price_low':
      handyQuery = handyQuery.order('hourly_rate_cents', { ascending: true });
      break;
    case 'price_high':
      handyQuery = handyQuery.order('hourly_rate_cents', { ascending: false });
      break;
    default:
      handyQuery = handyQuery.order('verified', { ascending: false });
      handyQuery = handyQuery.order('experience_years', { ascending: false });
      break;
  }

  const { data: handyProfiles, error: handyError } = await handyQuery;

  if (handyError) {
    console.error('Error fetching handy_profiles:', handyError);
    throw handyError;
  }

  if (!handyProfiles || handyProfiles.length === 0) return [];

  // Get all profile IDs
  const profileIds = handyProfiles.map(h => h.user_id);

  // Fetch profiles separately
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed')
    .in('user_id', profileIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  // Create a map for quick lookup
  const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

  // Combine data
  let handymen = handyProfiles.map((handy) => {
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

  // Apply elite filter in frontend (rating >= 4.8)
  if (filters?.isElite) {
    handymen = handymen.filter(h => h.rating >= 4.8);
  }

  // Apply frontend sorting for fields we can't sort in the database
  if (sortBy === 'rating' || sortBy === 'recommended') {
    handymen.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    handymen.sort((a, b) => b.jobs_completed - a.jobs_completed);
  }

  return handymen;
}

/**
 * Get a single handyman's detailed profile
 */
export async function getHandymanProfile(handyId: string): Promise<HandymanProfile | null> {
  const supabase = createClient();

  // Fetch handy_profile
  const { data: handyProfile, error: handyError } = await supabase
    .from('handy_profiles')
    .select('*')
    .eq('user_id', handyId)
    .single();

  if (handyError || !handyProfile) {
    console.error(`Error fetching handyman profile ${handyId}:`, handyError);
    return null;
  }

  // Fetch profile separately
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id, first_name, last_name, phone, postcode, avatar_url, rating, jobs_completed')
    .eq('user_id', handyId)
    .single();

  if (profileError) {
    console.error(`Error fetching profile ${handyId}:`, profileError);
  }

  return {
    user_id: handyProfile.user_id,
    bio: handyProfile.bio,
    hourly_rate_cents: handyProfile.hourly_rate_cents,
    experience_years: handyProfile.experience_years,
    verified: handyProfile.verified,
    created_at: handyProfile.created_at,
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
}

/**
 * Get handyman reviews
 */
export async function getHandymanReviews(handyId: string, limit: number = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles!reviews_customer_id_fkey (
        first_name,
        last_name
      )
    `)
    .eq('handy_id', handyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Error fetching reviews for handyman ${handyId}:`, error);
    return [];
  }

  return data || [];
}

/**
 * Get handyman categories/specializations
 */
export async function getHandymanCategories(handyId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('handy_categories')
    .select(`
      categories (
        id,
        name,
        description
      )
    `)
    .eq('handy_id', handyId);

  if (error) {
    console.error(`Error fetching categories for handyman ${handyId}:`, error);
    return [];
  }

  return data?.map((item: any) => item.categories) || [];
}

/**
 * Check if handyman is available on a specific date/time
 * This is a simplified version - real implementation would check bookings table
 */
export async function checkHandymanAvailability(
  handyId: string,
  date: string,
  time: string
): Promise<boolean> {
  const supabase = createClient();

  // Check for existing bookings at the same date/time
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('handy_id', handyId)
    .eq('scheduled_date', date)
    .in('status', ['pending', 'accepted', 'in_progress']);

  if (error) {
    console.error(`Error checking availability for handyman ${handyId}:`, error);
    return false;
  }

  // If no bookings found, handyman is available
  return !data || data.length === 0;
}

/**
 * Get handymen by category with full filtering
 */
export async function getHandymenByCategory(
  categoryId: string,
  filters?: Omit<HandymanFilters, 'categoryId'>
): Promise<HandymanProfile[]> {
  return getHandymen({ ...filters, categoryId });
}
