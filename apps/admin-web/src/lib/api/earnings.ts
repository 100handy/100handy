import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Earnings API Hooks
 *
 * Hooks for fetching handy earnings data for the admin earnings dashboard
 */

// ============================================================================
// Types
// ============================================================================

export interface HandyEarning {
  id: string
  name: string
  avatar_url: string | null
  totalEarnings: number
  tasksCompleted: number
  lastPayoutDate: string | null
  payoutStatus: 'paid' | 'pending' | 'failed' | 'none'
}

export interface HandyEarningsFilters {
  search?: string
  sortBy?: 'earnings_desc' | 'earnings_asc' | 'name_asc' | 'name_desc' | 'tasks_desc'
  page?: number
  limit?: number
}

export interface HandyEarningsResult {
  data: HandyEarning[]
  total: number
  page: number
  limit: number
}

// ============================================================================
// Handy Earnings Hook
// ============================================================================

export function useHandyEarnings(filters: HandyEarningsFilters = {}) {
  const { search = '', sortBy = 'earnings_desc', page = 1, limit = 10 } = filters

  return useQuery({
    queryKey: ['admin', 'handy-earnings', { search, sortBy, page, limit }],
    queryFn: async (): Promise<HandyEarningsResult> => {
      // Step 1: Fetch all handy profiles with their user profiles
      const query = supabase
        .from('handy_profiles')
        .select(`
          user_id,
          profiles!handy_profiles_profiles_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)

      const { data: handyProfiles, error: handyError } = await query

      if (handyError) throw handyError

      if (!handyProfiles || handyProfiles.length === 0) {
        return { data: [], total: 0, page, limit }
      }

      // Step 2: Fetch earnings data from completed bookings for each handy
      const handyIds = handyProfiles.map((h) => h.user_id)

      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('handy_id, payout_amount_cents, payout_status, completed_at')
        .in('handy_id', handyIds)
        .eq('status', 'completed')

      if (bookingsError) throw bookingsError

      // Step 3: Aggregate earnings per handy
      const earningsMap = new Map<
        string,
        { totalEarnings: number; tasksCompleted: number; lastPayout: string | null; lastStatus: string | null }
      >()

      for (const booking of bookings || []) {
        if (!booking.handy_id) continue

        const existing = earningsMap.get(booking.handy_id) || {
          totalEarnings: 0,
          tasksCompleted: 0,
          lastPayout: null,
          lastStatus: null,
        }

        existing.totalEarnings += booking.payout_amount_cents || 0
        existing.tasksCompleted += 1

        // Track most recent payout
        if (booking.completed_at) {
          if (!existing.lastPayout || booking.completed_at > existing.lastPayout) {
            existing.lastPayout = booking.completed_at
            existing.lastStatus = booking.payout_status
          }
        }

        earningsMap.set(booking.handy_id, existing)
      }

      // Step 4: Build result array
      let results: HandyEarning[] = handyProfiles.map((handy) => {
        const profile = Array.isArray(handy.profiles) ? handy.profiles[0] : handy.profiles
        const earnings = earningsMap.get(handy.user_id)

        const firstName = profile?.first_name || 'Unknown'
        const lastName = profile?.last_name || ''
        const fullName = `${firstName} ${lastName}`.trim()

        let payoutStatus: HandyEarning['payoutStatus'] = 'none'
        if (earnings?.lastStatus === 'transferred') payoutStatus = 'paid'
        else if (earnings?.lastStatus === 'pending') payoutStatus = 'pending'
        else if (earnings?.lastStatus === 'failed') payoutStatus = 'failed'

        return {
          id: handy.user_id,
          name: fullName,
          avatar_url: profile?.avatar_url || null,
          totalEarnings: (earnings?.totalEarnings || 0) / 100, // Convert cents to dollars
          tasksCompleted: earnings?.tasksCompleted || 0,
          lastPayoutDate: earnings?.lastPayout ? earnings.lastPayout.split('T')[0] : null,
          payoutStatus,
        }
      })

      // Step 5: Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        results = results.filter(
          (h) =>
            h.name.toLowerCase().includes(searchLower) ||
            h.id.toLowerCase().includes(searchLower)
        )
      }

      // Step 6: Apply sorting
      switch (sortBy) {
        case 'earnings_desc':
          results.sort((a, b) => b.totalEarnings - a.totalEarnings)
          break
        case 'earnings_asc':
          results.sort((a, b) => a.totalEarnings - b.totalEarnings)
          break
        case 'name_asc':
          results.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name_desc':
          results.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'tasks_desc':
          results.sort((a, b) => b.tasksCompleted - a.tasksCompleted)
          break
      }

      // Step 7: Apply pagination
      const total = results.length
      const startIdx = (page - 1) * limit
      const paginatedResults = results.slice(startIdx, startIdx + limit)

      return {
        data: paginatedResults,
        total,
        page,
        limit,
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  })
}

// ============================================================================
// Earnings Summary Hook (for KPIs)
// ============================================================================

export interface EarningsSummary {
  totalPayouts: number
  pendingPayouts: number
  failedPayouts: number
  activeHandys: number
}

export function useEarningsSummary() {
  return useQuery({
    queryKey: ['admin', 'earnings-summary'],
    queryFn: async (): Promise<EarningsSummary> => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('handy_id, payout_amount_cents, payout_status')
        .eq('status', 'completed')

      if (error) throw error

      let totalPayouts = 0
      let pendingPayouts = 0
      let failedPayouts = 0
      const uniqueHandys = new Set<string>()

      for (const booking of bookings || []) {
        if (booking.handy_id) uniqueHandys.add(booking.handy_id)

        const amount = booking.payout_amount_cents || 0
        if (booking.payout_status === 'transferred') {
          totalPayouts += amount
        } else if (booking.payout_status === 'pending') {
          pendingPayouts += amount
        } else if (booking.payout_status === 'failed') {
          failedPayouts += amount
        }
      }

      return {
        totalPayouts: totalPayouts / 100,
        pendingPayouts: pendingPayouts / 100,
        failedPayouts: failedPayouts / 100,
        activeHandys: uniqueHandys.size,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
