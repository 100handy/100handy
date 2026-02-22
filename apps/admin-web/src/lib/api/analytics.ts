import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Analytics API Hooks
 *
 * Hooks for fetching analytics data for the admin data analytics page
 */

// ============================================================================
// Types
// ============================================================================

export interface AnalyticsKPIs {
  totalUsers: number
  activeHandys: number
  completedTasks: number
  averageRating: number
  usersChange: number
  handysChange: number
  tasksChange: number
  ratingChange: number
}

export interface UserGrowthData {
  month: string
  users: number
  handys: number
}

export interface TaskCompletionData {
  name: string
  value: number
  color: string
  [key: string]: unknown
}

export interface PerformanceReport {
  name: string
  description: string
  lastGenerated: string
}

// ============================================================================
// Analytics KPIs Hook
// ============================================================================

export function useAnalyticsKPIs() {
  return useQuery({
    queryKey: ['admin', 'analytics-kpis'],
    queryFn: async (): Promise<AnalyticsKPIs> => {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Fetch all data in parallel
      const [
        usersResult,
        handysResult,
        tasksResult,
        ratingsResult,
        usersThisMonthResult,
        usersLastMonthResult,
        handysThisMonthResult,
        handysLastMonthResult,
        tasksThisMonthResult,
        tasksLastMonthResult,
      ] = await Promise.all([
        // Total users (customers)
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'customer'),
        // Total handys
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'handy'),
        // Completed tasks
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        // Average rating
        supabase.from('reviews').select('rating'),
        // Users this month
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'customer')
          .gte('created_at', startOfMonth.toISOString()),
        // Users last month
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'customer')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString()),
        // Handys this month
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'handy')
          .gte('created_at', startOfMonth.toISOString()),
        // Handys last month
        supabase
          .from('profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('role', 'handy')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString()),
        // Tasks this month
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('completed_at', startOfMonth.toISOString()),
        // Tasks last month
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('completed_at', startOfLastMonth.toISOString())
          .lte('completed_at', endOfLastMonth.toISOString()),
      ])

      // Calculate average rating
      const ratings = ratingsResult.data || []
      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0

      // Calculate percentage changes
      const usersThisMonth = usersThisMonthResult.count || 0
      const usersLastMonth = usersLastMonthResult.count || 0
      const usersChange = usersLastMonth > 0
        ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
        : 0

      const handysThisMonth = handysThisMonthResult.count || 0
      const handysLastMonth = handysLastMonthResult.count || 0
      const handysChange = handysLastMonth > 0
        ? ((handysThisMonth - handysLastMonth) / handysLastMonth) * 100
        : 0

      const tasksThisMonth = tasksThisMonthResult.count || 0
      const tasksLastMonth = tasksLastMonthResult.count || 0
      const tasksChange = tasksLastMonth > 0
        ? ((tasksThisMonth - tasksLastMonth) / tasksLastMonth) * 100
        : 0

      return {
        totalUsers: usersResult.count || 0,
        activeHandys: handysResult.count || 0,
        completedTasks: tasksResult.count || 0,
        averageRating: Math.round(averageRating * 100) / 100,
        usersChange: Math.round(usersChange * 10) / 10,
        handysChange: Math.round(handysChange * 10) / 10,
        tasksChange: Math.round(tasksChange * 10) / 10,
        ratingChange: 0, // Would need historical rating data to calculate
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// User Growth Hook (for bar chart)
// ============================================================================

export function useUserGrowthData(monthsBack = 7) {
  return useQuery({
    queryKey: ['admin', 'user-growth', monthsBack],
    queryFn: async (): Promise<UserGrowthData[]> => {
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1)

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, created_at')
        .gte('created_at', startDate.toISOString())

      if (error) throw error

      // Initialize months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData = new Map<string, { users: number; handys: number }>()

      for (let i = 0; i < monthsBack; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1 + i, 1)
        const key = monthNames[d.getMonth()]
        monthlyData.set(key, { users: 0, handys: 0 })
      }

      // Aggregate data
      for (const profile of profiles || []) {
        if (!profile.created_at) continue
        const date = new Date(profile.created_at)
        const key = monthNames[date.getMonth()]

        const existing = monthlyData.get(key)
        if (existing) {
          if (profile.role === 'customer') {
            existing.users += 1
          } else if (profile.role === 'handy') {
            existing.handys += 1
          }
        }
      }

      // Convert to array in order
      const result: UserGrowthData[] = []
      for (let i = 0; i < monthsBack; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1 + i, 1)
        const key = monthNames[d.getMonth()]
        const data = monthlyData.get(key) || { users: 0, handys: 0 }
        result.push({
          month: key,
          users: data.users,
          handys: data.handys,
        })
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}

// ============================================================================
// Task Completion Rate Hook (for pie chart)
// ============================================================================

export function useTaskCompletionRate() {
  return useQuery({
    queryKey: ['admin', 'task-completion-rate'],
    queryFn: async (): Promise<TaskCompletionData[]> => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('status')

      if (error) throw error

      // Count by status
      let completed = 0
      let cancelled = 0
      let pending = 0

      for (const booking of bookings || []) {
        switch (booking.status) {
          case 'completed':
            completed += 1
            break
          case 'cancelled':
            cancelled += 1
            break
          case 'pending':
          case 'accepted':
          case 'in_progress':
            pending += 1
            break
        }
      }

      const total = completed + cancelled + pending
      if (total === 0) {
        return [
          { name: 'Completed', value: 0, color: '#16a34a' },
          { name: 'Cancelled', value: 0, color: '#ef4444' },
          { name: 'Pending', value: 0, color: '#f97316' },
        ]
      }

      return [
        { name: 'Completed', value: Math.round((completed / total) * 100), color: '#16a34a' },
        { name: 'Cancelled', value: Math.round((cancelled / total) * 100), color: '#ef4444' },
        { name: 'Pending', value: Math.round((pending / total) * 100), color: '#f97316' },
      ]
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Performance Reports Hook (static for now - no reports table exists)
// ============================================================================

export function usePerformanceReports(): { data: PerformanceReport[]; isLoading: boolean } {
  // Since there's no reports table, we return static report definitions
  // These could be generated on-demand in the future
  const now = new Date()
  const reports: PerformanceReport[] = [
    {
      name: 'Monthly User Acquisition',
      description: 'Detailed breakdown of new user and handy sign-ups.',
      lastGenerated: now.toISOString().split('T')[0],
    },
    {
      name: 'Task Category Performance',
      description: 'Analysis of task volume and revenue per category.',
      lastGenerated: now.toISOString().split('T')[0],
    },
    {
      name: 'Handy Engagement & Retention',
      description: 'Metrics on handy activity, earnings, and churn rate.',
      lastGenerated: now.toISOString().split('T')[0],
    },
    {
      name: 'Platform Fee Analysis',
      description: 'In-depth report on collected platform fees vs. payouts.',
      lastGenerated: now.toISOString().split('T')[0],
    },
  ]

  return { data: reports, isLoading: false }
}
