import { supabase } from './supabaseClient';

export interface AnalyticsData {
  // Earnings metrics
  totalEarnings: number; // cents
  anticipatedEarnings: number; // cents (estimate based on pending bookings)
  earningsPercentile: number; // 0-100

  // Task metrics
  completedTasks: number;
  anticipatedTasks: number; // estimate based on pending/accepted bookings
  taskPercentile: number; // 0-100

  // Opportunity metrics (search visibility - would need tracking system)
  averageSearchPosition: number | null;
  searchAppearances: number;
  opportunityPercentile: number; // 0-100
}

/**
 * Get analytics data for a professional for the past 30 days
 */
export async function getProfessionalAnalytics(userId: string): Promise<AnalyticsData> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    // Fetch completed bookings in the past 30 days
    const { data: completedBookings, error: completedError } = await supabase
      .from('bookings')
      .select('id, hourly_rate_cents, estimated_hours, discount_amount_cents')
      .eq('handy_id', userId)
      .eq('status', 'completed')
      .gte('scheduled_date', startDate);

    if (completedError) {
      console.error('Error fetching completed bookings:', completedError);
      throw completedError;
    }

    // Fetch pending/accepted/in_progress bookings (anticipated)
    const { data: pendingBookings, error: pendingError } = await supabase
      .from('bookings')
      .select('id, hourly_rate_cents, estimated_hours, discount_amount_cents')
      .eq('handy_id', userId)
      .in('status', ['pending', 'accepted', 'in_progress'])
      .gte('scheduled_date', startDate);

    if (pendingError) {
      console.error('Error fetching pending bookings:', pendingError);
      throw pendingError;
    }

    // Calculate completed earnings and task count
    let totalEarnings = 0;
    const completedTasks = completedBookings?.length || 0;

    for (const booking of completedBookings || []) {
      const gross = booking.hourly_rate_cents * (booking.estimated_hours || 1);
      const discount = booking.discount_amount_cents || 0;
      totalEarnings += gross - discount;
    }

    // Calculate anticipated (pending) earnings and task count
    let anticipatedEarnings = 0;
    const anticipatedTasks = pendingBookings?.length || 0;

    for (const booking of pendingBookings || []) {
      const gross = booking.hourly_rate_cents * (booking.estimated_hours || 1);
      const discount = booking.discount_amount_cents || 0;
      anticipatedEarnings += gross - discount;
    }

    // Fetch all professionals' completed tasks for percentile calculation
    const { data: allProfessionals, error: profError } = await supabase
      .from('bookings')
      .select('handy_id, hourly_rate_cents, estimated_hours, discount_amount_cents')
      .eq('status', 'completed')
      .gte('scheduled_date', startDate)
      .not('handy_id', 'is', null);

    if (profError) {
      console.error('Error fetching all professionals:', profError);
    }

    // Calculate percentiles
    let earningsPercentile = 0;
    let taskPercentile = 0;

    if (allProfessionals && allProfessionals.length > 0) {
      // Count tasks and earnings per professional
      const taskCounts: Record<string, number> = {};
      const earningsMap: Record<string, number> = {};
      for (const booking of allProfessionals) {
        if (booking.handy_id) {
          taskCounts[booking.handy_id] = (taskCounts[booking.handy_id] || 0) + 1;
          const gross = booking.hourly_rate_cents * (booking.estimated_hours || 1);
          const discount = booking.discount_amount_cents || 0;
          earningsMap[booking.handy_id] = (earningsMap[booking.handy_id] || 0) + (gross - discount);
        }
      }

      // Calculate task percentile
      const allCounts = Object.values(taskCounts).sort((a, b) => a - b);
      const userTaskPosition = allCounts.filter(count => count < completedTasks).length;
      taskPercentile = allCounts.length > 0 ? Math.round((userTaskPosition / allCounts.length) * 100) : 0;

      // Calculate earnings percentile from actual earnings
      const allEarnings = Object.values(earningsMap).sort((a, b) => a - b);
      const userEarningsPosition = allEarnings.filter(e => e < totalEarnings).length;
      earningsPercentile = allEarnings.length > 0 ? Math.round((userEarningsPosition / allEarnings.length) * 100) : 0;
    }

    return {
      // Earnings
      totalEarnings,
      anticipatedEarnings,
      earningsPercentile,

      // Tasks
      completedTasks,
      anticipatedTasks,
      taskPercentile,

      // Opportunity (search tracking not implemented)
      averageSearchPosition: null, // Would need search tracking
      searchAppearances: 0, // Would need search tracking
      opportunityPercentile: 0, // Would need search tracking
    };
  } catch (error) {
    console.error('Error in getProfessionalAnalytics:', error);
    throw error;
  }
}

/**
 * Get detailed earnings breakdown for analytics
 */
export async function getEarningsBreakdown(userId: string): Promise<{
  past30Days: number;
  past7Days: number;
  today: number;
  averagePerTask: number;
}> {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0] as string;

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0] as string;

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0] as string;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('scheduled_date, hourly_rate_cents, estimated_hours')
      .eq('handy_id', userId)
      .eq('status', 'completed')
      .gte('scheduled_date', thirtyDaysAgoStr);

    if (error) {
      console.error('Error fetching earnings breakdown:', error);
      throw error;
    }

    let past30Days = 0;
    let past7Days = 0;
    let todayEarnings = 0;
    let totalTasks = 0;

    for (const booking of bookings || []) {
      const amount = booking.hourly_rate_cents * (booking.estimated_hours || 1);
      past30Days += amount;
      totalTasks += 1;

      if (booking.scheduled_date >= sevenDaysAgoStr) {
        past7Days += amount;
      }
      if (booking.scheduled_date === today) {
        todayEarnings += amount;
      }
    }

    return {
      past30Days,
      past7Days,
      today: todayEarnings,
      averagePerTask: totalTasks > 0 ? Math.round(past30Days / totalTasks) : 0,
    };
  } catch (error) {
    console.error('Error in getEarningsBreakdown:', error);
    throw error;
  }
}

/**
 * Get task completion stats for analytics
 */
export async function getTaskStats(userId: string): Promise<{
  completed: number;
  pending: number;
  cancelled: number;
  completionRate: number;
}> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('handy_id', userId)
      .gte('scheduled_date', startDate);

    if (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }

    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    for (const booking of bookings || []) {
      switch (booking.status) {
        case 'completed':
          completed++;
          break;
        case 'pending':
        case 'accepted':
        case 'in_progress':
          pending++;
          break;
        case 'cancelled':
          cancelled++;
          break;
      }
    }

    const total = completed + cancelled;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    return {
      completed,
      pending,
      cancelled,
      completionRate,
    };
  } catch (error) {
    console.error('Error in getTaskStats:', error);
    throw error;
  }
}

/**
 * Elite progress data for a professional
 */
export interface EliteProgress {
  monthlyCompletedTasks: number;
  lifetimeCompletedTasks: number;
  categoryProgress: {
    category: string;
    completedTasks: number;
  }[];
}

/**
 * Get elite status progress for a professional
 */
export async function getEliteProgress(userId: string): Promise<EliteProgress> {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Fetch all completed bookings with category info
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id, scheduled_date, category_id, categories:category_id(name)')
      .eq('handy_id', userId)
      .eq('status', 'completed');

    if (error) throw error;

    let lifetimeCompletedTasks = 0;
    let monthlyCompletedTasks = 0;
    const categoryCounts: Record<string, number> = {};

    for (const booking of bookings || []) {
      lifetimeCompletedTasks++;

      if (booking.scheduled_date >= monthStart) {
        monthlyCompletedTasks++;
      }

      // Extract category name from join (Supabase returns array for joins)
      const categoryArr = booking.categories as unknown as { name: string }[] | null;
      const category = categoryArr && categoryArr.length > 0 ? categoryArr[0].name : 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    const categoryProgress = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      completedTasks: count,
    }));

    return {
      monthlyCompletedTasks,
      lifetimeCompletedTasks,
      categoryProgress,
    };
  } catch (error) {
    console.error('Error in getEliteProgress:', error);
    throw error;
  }
}
