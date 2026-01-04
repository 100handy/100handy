import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Dashboard Metrics API Hooks
 *
 * Hooks for fetching dashboard statistics and recent activity
 */

// ============================================================================
// Types
// ============================================================================

export interface DashboardMetrics {
  totalRevenue: number
  tasksCompleted: number
  totalUsers: number
  totalHandys: number
}

export interface RecentActivity {
  id: string
  user: {
    name: string
    avatar_url: string | null
  }
  task: string
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Pending' | 'Cancelled'
  statusColor: 'green' | 'yellow' | 'blue' | 'gray' | 'red'
  date: string
  category: string | null
}

// ============================================================================
// Dashboard Metrics Hook
// ============================================================================

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Fetch all metrics in parallel for better performance
      const [revenueResult, completedResult, usersResult, handysResult] = await Promise.all([
        // Total revenue from paid payments
        supabase
          .from('payments')
          .select('amount_cents')
          .eq('status', 'paid'),

        // Tasks completed count
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),

        // Total customers count
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'customer'),

        // Total handys count
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'handy'),
      ])

      // Handle errors
      if (revenueResult.error) throw revenueResult.error
      if (completedResult.error) throw completedResult.error
      if (usersResult.error) throw usersResult.error
      if (handysResult.error) throw handysResult.error

      // Calculate total revenue
      const totalRevenueCents = revenueResult.data?.reduce(
        (sum, payment) => sum + payment.amount_cents,
        0
      ) || 0

      return {
        totalRevenue: totalRevenueCents / 100, // Convert cents to dollars
        tasksCompleted: completedResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalHandys: handysResult.count || 0,
      }
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  })
}

// ============================================================================
// Recent Activity Hook
// ============================================================================

export function useRecentActivity(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', limit],
    queryFn: async (): Promise<RecentActivity[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          task_title,
          status,
          scheduled_date,
          customer_id,
          profiles!bookings_customer_profile_fkey (
            first_name,
            last_name,
            avatar_url
          ),
          categories (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Transform data to match UI expectations
      return (data || []).map((booking) => {
        const profile = Array.isArray(booking.profiles)
          ? booking.profiles[0]
          : booking.profiles

        const firstName = profile?.first_name || 'Unknown'
        const lastName = profile?.last_name || 'User'
        const fullName = `${firstName} ${lastName}`

        // Map booking status to display status
        let displayStatus: RecentActivity['status']
        let statusColor: RecentActivity['statusColor']

        switch (booking.status) {
          case 'completed':
            displayStatus = 'Completed'
            statusColor = 'green'
            break
          case 'in_progress':
            displayStatus = 'In Progress'
            statusColor = 'yellow'
            break
          case 'accepted':
            displayStatus = 'Scheduled'
            statusColor = 'blue'
            break
          case 'cancelled':
            displayStatus = 'Cancelled'
            statusColor = 'red'
            break
          default:
            displayStatus = 'Pending'
            statusColor = 'gray'
        }

        const category = Array.isArray(booking.categories)
          ? booking.categories[0]
          : booking.categories

        return {
          id: booking.id,
          user: {
            name: fullName,
            avatar_url: profile?.avatar_url || null,
          },
          task: booking.task_title,
          status: displayStatus,
          statusColor,
          date: booking.scheduled_date,
          category: category?.name || null,
        }
      })
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  })
}

// ============================================================================
// Quick Stats Hook (Customer satisfaction, new users, pending payments)
// ============================================================================

export interface QuickStats {
  customerSatisfaction: {
    value: string
    suffix: string
    change: string
    changeColor: 'green' | 'red' | 'gray'
  }
  newUsersThisMonth: {
    value: string
    change: string
    changeColor: 'green' | 'red' | 'gray'
  }
  pendingPayments: {
    value: string
    change: string
    changeColor: 'green' | 'red' | 'gray'
  }
}

export function useQuickStats() {
  return useQuery({
    queryKey: ['dashboard', 'quick-stats'],
    queryFn: async (): Promise<QuickStats> => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      const [ratingsResult, usersThisMonthResult, usersLastMonthResult, pendingPaymentsResult] =
        await Promise.all([
          // Average rating from reviews
          supabase.from('reviews').select('rating'),

          // New users this month
          supabase
            .from('profiles')
            .select('user_id', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString()),

          // New users last month
          supabase
            .from('profiles')
            .select('user_id', { count: 'exact', head: true })
            .gte('created_at', startOfLastMonth.toISOString())
            .lte('created_at', endOfLastMonth.toISOString()),

          // Pending payments
          supabase
            .from('payments')
            .select('amount_cents')
            .eq('status', 'pending'),
        ])

      // Calculate average rating
      const ratings = ratingsResult.data || []
      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : '0.0'

      // Calculate new users change
      const usersThisMonth = usersThisMonthResult.count || 0
      const usersLastMonth = usersLastMonthResult.count || 0
      const userChange = usersLastMonth > 0
        ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
        : 0

      // Calculate pending payments total
      const pendingTotal = (pendingPaymentsResult.data || []).reduce(
        (sum, p) => sum + p.amount_cents,
        0
      )
      const pendingCount = pendingPaymentsResult.data?.length || 0

      return {
        customerSatisfaction: {
          value: avgRating,
          suffix: '/5',
          change: ratings.length > 0 ? `Based on ${ratings.length} reviews` : 'No reviews yet',
          changeColor: 'gray',
        },
        newUsersThisMonth: {
          value: usersThisMonth.toString(),
          change: userChange > 0
            ? `+${userChange}% from last month`
            : userChange < 0
            ? `${userChange}% from last month`
            : 'No change from last month',
          changeColor: userChange > 0 ? 'green' : userChange < 0 ? 'red' : 'gray',
        },
        pendingPayments: {
          value: `$${(pendingTotal / 100).toLocaleString()}`,
          change: `${pendingCount} pending transaction${pendingCount !== 1 ? 's' : ''}`,
          changeColor: 'gray',
        },
      }
    },
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  })
}
