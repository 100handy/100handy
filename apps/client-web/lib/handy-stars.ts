import { createClient } from '@supabase/supabase-js';

function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export interface MonthlyHandyStarWinner {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  postcode: string | null;
  verified: boolean;
  average_rating: number;
  total_reviews: number;
  five_star_reviews: number;
  jobs_completed: number;
  month: string;
}

export function getCurrentMonthValue() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

export function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  if (!year || !monthNumber) {
    return month;
  }
  const date = new Date(year, monthNumber - 1, 1);
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function formatWinnerDisplayName(firstName: string | null, lastName: string | null) {
  const safeFirstName = firstName?.trim() || '100 Handy Pro';
  const lastInitial = lastName?.trim()?.charAt(0);
  return lastInitial ? `${safeFirstName} ${lastInitial}.` : safeFirstName;
}

export async function getMonthlyHandyStar(
  month = getCurrentMonthValue(),
): Promise<MonthlyHandyStarWinner | null> {
  const [year, monthNumber] = month.split('-').map(Number);
  if (!year || !monthNumber) {
    throw new Error('Invalid month selection');
  }

  const supabase = createPublicSupabaseClient();
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));

  const { data: fiveStarReviews, error: fiveStarError } = await supabase
    .from('reviews')
    .select('handy_id, rating, reviewer_type, created_at')
    .eq('reviewer_type', 'customer')
    .eq('rating', 5)
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .not('handy_id', 'is', null);

  if (fiveStarError) throw fiveStarError;
  if (!fiveStarReviews || fiveStarReviews.length === 0) return null;

  const fiveStarMap = new Map<string, number>();
  for (const review of fiveStarReviews) {
    if (!review.handy_id) continue;
    fiveStarMap.set(review.handy_id, (fiveStarMap.get(review.handy_id) || 0) + 1);
  }

  const handyIds = Array.from(fiveStarMap.keys());

  const { data: allMonthReviews, error: monthReviewsError } = await supabase
    .from('reviews')
    .select('handy_id, rating')
    .eq('reviewer_type', 'customer')
    .in('handy_id', handyIds)
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString());

  if (monthReviewsError) throw monthReviewsError;

  const ratingsMap = new Map<string, { sum: number; count: number }>();
  for (const review of allMonthReviews || []) {
    if (!review.handy_id) continue;
    const current = ratingsMap.get(review.handy_id) || { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    ratingsMap.set(review.handy_id, current);
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select(`
      user_id,
      first_name,
      last_name,
      avatar_url,
      postcode,
      rating,
      jobs_completed,
      handy_profile:handy_profiles (
        verified
      )
    `)
    .in('user_id', handyIds)
    .eq('role', 'handy');

  if (profilesError) throw profilesError;
  if (!profiles || profiles.length === 0) return null;

  const leaderboard = profiles.map((profile) => {
    const handyProfile = Array.isArray(profile.handy_profile)
      ? profile.handy_profile[0] || null
      : profile.handy_profile;
    const ratings = ratingsMap.get(profile.user_id) || { sum: 0, count: 0 };

    return {
      user_id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
      postcode: profile.postcode,
      verified: handyProfile?.verified ?? false,
      average_rating:
        ratings.count > 0
          ? Math.round((ratings.sum / ratings.count) * 10) / 10
          : (profile.rating || 0),
      total_reviews: ratings.count,
      five_star_reviews: fiveStarMap.get(profile.user_id) || 0,
      jobs_completed: profile.jobs_completed || 0,
      month,
    };
  });

  leaderboard.sort((a, b) => {
    if (b.five_star_reviews !== a.five_star_reviews) return b.five_star_reviews - a.five_star_reviews;
    if (b.average_rating !== a.average_rating) return b.average_rating - a.average_rating;
    if (b.total_reviews !== a.total_reviews) return b.total_reviews - a.total_reviews;
    return b.jobs_completed - a.jobs_completed;
  });

  return leaderboard[0] ?? null;
}
