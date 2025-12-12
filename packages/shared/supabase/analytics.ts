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
      .select('id, hourly_rate_cents, estimated_hours')
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
      .select('id, hourly_rate_cents, estimated_hours')
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
      totalEarnings += booking.hourly_rate_cents * (booking.estimated_hours || 1);
    }

    // Calculate anticipated (pending) earnings and task count
    let anticipatedEarnings = 0;
    const anticipatedTasks = pendingBookings?.length || 0;

    for (const booking of pendingBookings || []) {
      anticipatedEarnings += booking.hourly_rate_cents * (booking.estimated_hours || 1);
    }

    // Fetch all professionals' completed tasks for percentile calculation
    const { data: allProfessionals, error: profError } = await supabase
      .from('bookings')
      .select('handy_id')
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
      // Count tasks per professional
      const taskCounts: Record<string, number> = {};
      for (const booking of allProfessionals) {
        if (booking.handy_id) {
          taskCounts[booking.handy_id] = (taskCounts[booking.handy_id] || 0) + 1;
        }
      }

      // Calculate percentile based on task count
      const allCounts = Object.values(taskCounts).sort((a, b) => a - b);
      const userPosition = allCounts.filter(count => count < completedTasks).length;
      taskPercentile = allCounts.length > 0 ? Math.round((userPosition / allCounts.length) * 100) : 0;

      // Use task percentile as a proxy for earnings percentile (similar behavior)
      earningsPercentile = taskPercentile;
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
