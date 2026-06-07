import { useQuery } from '@tanstack/react-query'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

/**
 * Income API Hooks
 *
 * Hooks for fetching income/revenue data for the admin total income page
 */

// ============================================================================
// Types
// ============================================================================

export interface IncomeMetrics {
  totalRevenue: number
  platformFees: number
  totalPayouts: number
  avgIncomePerHandy: number
  activeHandyCount: number
  revenueChange: number // percentage change from last month
  feesChange: number
  payoutsChange: number
}

export interface MonthlyIncomeData {
  month: string
  revenue: number
  fees: number
}

export interface CategoryIncomeData {
  name: string
  value: number
  color: string
  [key: string]: unknown
}

export interface Transaction {
  date: string
  description: string
  type: 'Payout' | 'Fee'
  amount: number
}

// ============================================================================
// Income Metrics Hook
// ============================================================================

export function useIncomeMetrics() {
  return useQuery({
    queryKey: ['admin', 'income-metrics'],
    queryFn: async (): Promise<IncomeMetrics> => {
      await requireAdminPermission('finance.view')
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Fetch all completed bookings with financial data
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('handy_id, payout_amount_cents, platform_fee_cents, hourly_rate_cents, estimated_hours, completed_at')
        .eq('status', 'completed')

      if (error) throw error

      let totalRevenue = 0
      let platformFees = 0
      let totalPayouts = 0
      let thisMonthRevenue = 0
      let lastMonthRevenue = 0
      let thisMonthFees = 0
      let lastMonthFees = 0
      let thisMonthPayouts = 0
      let lastMonthPayouts = 0
      const uniqueHandys = new Set<string>()

      for (const booking of bookings || []) {
        if (booking.handy_id) uniqueHandys.add(booking.handy_id)

        // Calculate revenue from hourly rate * estimated hours
        const revenue = (booking.hourly_rate_cents || 0) * (Number(booking.estimated_hours) || 1)
        const fees = booking.platform_fee_cents || 0
        const payouts = booking.payout_amount_cents || 0

        totalRevenue += revenue
        platformFees += fees
        totalPayouts += payouts

        // Calculate monthly changes
        if (booking.completed_at) {
          const completedDate = new Date(booking.completed_at)
          if (completedDate >= startOfMonth) {
            thisMonthRevenue += revenue
            thisMonthFees += fees
            thisMonthPayouts += payouts
          } else if (completedDate >= startOfLastMonth && completedDate <= endOfLastMonth) {
            lastMonthRevenue += revenue
            lastMonthFees += fees
            lastMonthPayouts += payouts
          }
        }
      }

      // Calculate percentage changes
      const revenueChange = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0
      const feesChange = lastMonthFees > 0
        ? ((thisMonthFees - lastMonthFees) / lastMonthFees) * 100
        : 0
      const payoutsChange = lastMonthPayouts > 0
        ? ((thisMonthPayouts - lastMonthPayouts) / lastMonthPayouts) * 100
        : 0

      const activeHandyCount = uniqueHandys.size
      const avgIncomePerHandy = activeHandyCount > 0 ? totalPayouts / activeHandyCount : 0

      return {
        totalRevenue: totalRevenue / 100,
        platformFees: platformFees / 100,
        totalPayouts: totalPayouts / 100,
        avgIncomePerHandy: avgIncomePerHandy / 100,
        activeHandyCount,
        revenueChange: Math.round(revenueChange * 10) / 10,
        feesChange: Math.round(feesChange * 10) / 10,
        payoutsChange: Math.round(payoutsChange * 10) / 10,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Monthly Income Hook (for charts)
// ============================================================================

export function useMonthlyIncome(monthsBack = 7) {
  return useQuery({
    queryKey: ['admin', 'monthly-income', monthsBack],
    queryFn: async (): Promise<MonthlyIncomeData[]> => {
      await requireAdminPermission('finance.view')
      // Calculate date range
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1)

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('hourly_rate_cents, estimated_hours, platform_fee_cents, completed_at')
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString())

      if (error) throw error

      // Group by month
      const monthlyData = new Map<string, { revenue: number; fees: number }>()
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      // Initialize months
      for (let i = 0; i < monthsBack; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1 + i, 1)
        const key = monthNames[d.getMonth()]
        monthlyData.set(key, { revenue: 0, fees: 0 })
      }

      // Aggregate data
      for (const booking of bookings || []) {
        if (!booking.completed_at) continue
        const date = new Date(booking.completed_at)
        const key = monthNames[date.getMonth()]

        const existing = monthlyData.get(key) || { revenue: 0, fees: 0 }
        existing.revenue += (booking.hourly_rate_cents || 0) * (Number(booking.estimated_hours) || 1)
        existing.fees += booking.platform_fee_cents || 0
        monthlyData.set(key, existing)
      }

      // Convert to array in order
      const result: MonthlyIncomeData[] = []
      for (let i = 0; i < monthsBack; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1 + i, 1)
        const key = monthNames[d.getMonth()]
        const data = monthlyData.get(key) || { revenue: 0, fees: 0 }
        result.push({
          month: key,
          revenue: data.revenue / 100,
          fees: data.fees / 100,
        })
      }

      return result
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}

// ============================================================================
// Income by Category Hook (for pie chart)
// ============================================================================

const CATEGORY_COLORS = [
  '#1173d4', // Primary blue
  '#16a34a', // Green
  '#f97316', // Orange
  '#facc15', // Yellow
  '#6b7280', // Gray
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
]

export function useIncomeByCategory() {
  return useQuery({
    queryKey: ['admin', 'income-by-category'],
    queryFn: async (): Promise<CategoryIncomeData[]> => {
      await requireAdminPermission('finance.view')
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          hourly_rate_cents,
          estimated_hours,
          category_id,
          categories (name)
        `)
        .eq('status', 'completed')

      if (error) throw error

      // Group by category
      const categoryMap = new Map<string, number>()

      for (const booking of bookings || []) {
        const category = Array.isArray(booking.categories)
          ? booking.categories[0]
          : booking.categories
        const categoryName = category?.name || 'Other'
        const revenue = (booking.hourly_rate_cents || 0) * (Number(booking.estimated_hours) || 1)

        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + revenue)
      }

      // Convert to array and sort by value
      const result: CategoryIncomeData[] = Array.from(categoryMap.entries())
        .map(([name, value], index) => ({
          name,
          value: value / 100,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5 categories

      return result
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  })
}

// ============================================================================
// Recent Transactions Hook
// ============================================================================

export function useRecentTransactions(limit = 10, type?: 'Payout' | 'Fee' | 'All') {
  return useQuery({
    queryKey: ['admin', 'recent-transactions', limit, type],
    queryFn: async (): Promise<Transaction[]> => {
      await requireAdminPermission('finance.view')
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          payout_amount_cents,
          platform_fee_cents,
          payout_status,
          completed_at,
          handy_id,
          profiles!bookings_handy_profile_fkey (first_name, last_name)
        `)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(limit * 2) // Get more to account for filtering

      if (error) throw error

      const transactions: Transaction[] = []

      for (const booking of bookings || []) {
        const profile = Array.isArray(booking.profiles)
          ? booking.profiles[0]
          : booking.profiles
        const handyName = profile
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : 'Unknown Handy'
        const dateStr = booking.completed_at
          ? new Date(booking.completed_at).toISOString().split('T')[0]
          : ''

        // Add payout transaction
        if (booking.payout_amount_cents && booking.payout_amount_cents > 0) {
          if (type === 'All' || type === 'Payout' || !type) {
            transactions.push({
              date: dateStr,
              description: `Payout to ${handyName} (${booking.id.substring(0, 8)})`,
              type: 'Payout',
              amount: -(booking.payout_amount_cents / 100),
            })
          }
        }

        // Add fee transaction
        if (booking.platform_fee_cents && booking.platform_fee_cents > 0) {
          if (type === 'All' || type === 'Fee' || !type) {
            transactions.push({
              date: dateStr,
              description: `Platform Fee from Task ${booking.id.substring(0, 8)}`,
              type: 'Fee',
              amount: booking.platform_fee_cents / 100,
            })
          }
        }
      }

      // Sort by date and limit
      return transactions
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}
