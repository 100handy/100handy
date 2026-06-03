import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Finance Extended API Hooks
 *
 * Hooks for account balances and invoices pages
 */

// ============================================================================
// Types
// ============================================================================

export interface AccountBalanceSummary {
  handyPayoutBalances: number
  clientCreditBalances: number
  platformRevenue: number
}

export interface AccountBalance {
  id: string
  name: string
  type: 'Handy Payout' | 'Client Credit' | 'Platform Revenue'
  balance: number
  pending: number
  lastActivity: string
}

export interface Invoice {
  id: string
  paymentId: string
  bookingId: string | null
  billedUserId: string | null
  billedTo: string
  billedType: 'Client' | 'Handy'
  issuedDate: string
  dueDate: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
}

// ============================================================================
// Account Balances Summary Hook
// ============================================================================

export function useAccountBalancesSummary() {
  return useQuery({
    queryKey: ['admin', 'account-balances-summary'],
    queryFn: async (): Promise<AccountBalanceSummary> => {
      // Fetch completed bookings to calculate platform revenue
      const { data: completedBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('platform_fee_cents, payout_amount_cents, payout_status')
        .eq('status', 'completed')

      if (bookingsError) throw bookingsError

      let platformRevenue = 0
      let handyPayoutBalances = 0

      for (const booking of completedBookings || []) {
        platformRevenue += booking.platform_fee_cents || 0

        // Pending payouts are those that are not yet paid out
        if (booking.payout_status === 'pending' || booking.payout_status === 'processing') {
          handyPayoutBalances += booking.payout_amount_cents || 0
        }
      }

      // Fetch client credit balances from payments table
      // Payments with status 'pending' represent held funds
      const { data: pendingPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount_cents')
        .eq('status', 'pending')

      if (paymentsError) throw paymentsError

      let clientCreditBalances = 0
      for (const payment of pendingPayments || []) {
        clientCreditBalances += payment.amount_cents || 0
      }

      return {
        handyPayoutBalances: handyPayoutBalances / 100,
        clientCreditBalances: clientCreditBalances / 100,
        platformRevenue: platformRevenue / 100,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Account Balances List Hook
// ============================================================================

export function useAccountBalances(filter?: 'all' | 'Handy Payout' | 'Client Credit' | 'Platform Revenue') {
  return useQuery({
    queryKey: ['admin', 'account-balances', filter],
    queryFn: async (): Promise<AccountBalance[]> => {
      const accounts: AccountBalance[] = []

      // Platform Revenue account
      if (!filter || filter === 'all' || filter === 'Platform Revenue') {
        const { data: completedBookings, error } = await supabase
          .from('bookings')
          .select('platform_fee_cents, completed_at')
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)

        if (error) throw error

        let totalPlatformFees = 0
        const { data: allCompleted } = await supabase
          .from('bookings')
          .select('platform_fee_cents')
          .eq('status', 'completed')

        for (const b of allCompleted || []) {
          totalPlatformFees += b.platform_fee_cents || 0
        }

        const lastActivity = completedBookings?.[0]?.completed_at
          ? new Date(completedBookings[0].completed_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]

        accounts.push({
          id: 'platform-revenue',
          name: 'Platform Revenue',
          type: 'Platform Revenue',
          balance: totalPlatformFees / 100,
          pending: 0,
          lastActivity,
        })
      }

      // Handy Payout accounts - group by handy
      if (!filter || filter === 'all' || filter === 'Handy Payout') {
        const { data: handyBookings, error } = await supabase
          .from('bookings')
          .select(`
            handy_id,
            payout_amount_cents,
            payout_status,
            completed_at,
            profiles!bookings_handy_profile_fkey (first_name, last_name)
          `)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })

        if (error) throw error

        // Group by handy
        const handyBalances = new Map<string, {
          name: string
          balance: number
          pending: number
          lastActivity: string
        }>()

        for (const booking of handyBookings || []) {
          if (!booking.handy_id) continue

          const profile = Array.isArray(booking.profiles)
            ? booking.profiles[0]
            : booking.profiles
          const name = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'Unknown Handy'

          const existing = handyBalances.get(booking.handy_id) || {
            name,
            balance: 0,
            pending: 0,
            lastActivity: booking.completed_at?.split('T')[0] || '',
          }

          if (booking.payout_status === 'pending' || booking.payout_status === 'processing') {
            existing.pending += (booking.payout_amount_cents || 0) / 100
          } else if (booking.payout_status === 'completed' || booking.payout_status === 'paid') {
            existing.balance += (booking.payout_amount_cents || 0) / 100
          }

          if (booking.completed_at && booking.completed_at > existing.lastActivity) {
            existing.lastActivity = booking.completed_at.split('T')[0]
          }

          handyBalances.set(booking.handy_id, existing)
        }

        for (const [handyId, data] of handyBalances) {
          // Only include handys with pending or balance
          if (data.pending > 0 || data.balance > 0) {
            accounts.push({
              id: handyId,
              name: data.name,
              type: 'Handy Payout',
              balance: data.balance,
              pending: data.pending,
              lastActivity: data.lastActivity,
            })
          }
        }
      }

      // Client Credit accounts - from payments table
      if (!filter || filter === 'all' || filter === 'Client Credit') {
        const { data: payments, error } = await supabase
          .from('payments')
          .select(`
            id,
            amount_cents,
            status,
            created_at,
            booking_id,
            bookings (
              customer_id,
              profiles!bookings_customer_profile_fkey (first_name, last_name)
            )
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Group by customer
        const customerCredits = new Map<string, {
          name: string
          balance: number
          lastActivity: string
        }>()

        for (const payment of payments || []) {
          const booking = Array.isArray(payment.bookings)
            ? payment.bookings[0]
            : payment.bookings
          if (!booking?.customer_id) continue

          const profile = Array.isArray(booking.profiles)
            ? booking.profiles[0]
            : booking.profiles
          const name = profile
            ? `${profile.first_name || ''} ${profile.last_name || ''} (Client)`.trim()
            : 'Unknown Client'

          const existing = customerCredits.get(booking.customer_id) || {
            name,
            balance: 0,
            lastActivity: payment.created_at?.split('T')[0] || '',
          }

          existing.balance += (payment.amount_cents || 0) / 100

          if (payment.created_at && payment.created_at > existing.lastActivity) {
            existing.lastActivity = payment.created_at.split('T')[0]
          }

          customerCredits.set(booking.customer_id, existing)
        }

        for (const [customerId, data] of customerCredits) {
          if (data.balance > 0) {
            accounts.push({
              id: customerId,
              name: data.name,
              type: 'Client Credit',
              balance: data.balance,
              pending: 0,
              lastActivity: data.lastActivity,
            })
          }
        }
      }

      // Sort by balance descending
      return accounts.sort((a, b) => b.balance - a.balance)
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Invoices Hook
// ============================================================================

export function useInvoices(
  statusFilter?: 'all' | 'Paid' | 'Pending' | 'Overdue',
  searchQuery?: string,
  limit = 20
) {
  return useQuery({
    queryKey: ['admin', 'invoices', statusFilter, searchQuery, limit],
    queryFn: async (): Promise<{ invoices: Invoice[]; total: number }> => {
      // Derive invoices from payments + bookings
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount_cents,
          status,
          created_at,
          bookings (
            id,
            customer_id,
            handy_id,
            profiles!bookings_customer_profile_fkey (first_name, last_name),
            handy_profiles!bookings_handy_profile_fkey (
              profiles!handy_profiles_user_id_fkey (first_name, last_name)
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const now = new Date()
      const invoices: Invoice[] = []

      for (const payment of payments || []) {
        const booking = Array.isArray(payment.bookings)
          ? payment.bookings[0]
          : payment.bookings

        // Determine billed to (customer or handy for payouts)
        let billedTo = 'Unknown'
        let billedType: 'Client' | 'Handy' = 'Client'

        if (booking) {
          const customerProfile = Array.isArray(booking.profiles)
            ? booking.profiles[0]
            : booking.profiles
          if (customerProfile) {
            billedTo = `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim()
            billedType = 'Client'
          }
        }

        const issuedDate = payment.created_at
          ? new Date(payment.created_at)
          : new Date()
        const dueDate = new Date(issuedDate)
        dueDate.setDate(dueDate.getDate() + 14) // 14 days payment term

        // Determine status
        let status: 'Paid' | 'Pending' | 'Overdue' = 'Pending'
        if (payment.status === 'paid' || payment.status === 'completed') {
          status = 'Paid'
        } else if (dueDate < now && payment.status === 'pending') {
          status = 'Overdue'
        }

        // Apply filters
        if (statusFilter && statusFilter !== 'all' && status !== statusFilter) {
          continue
        }

        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase()
          if (
            !billedTo.toLowerCase().includes(searchLower) &&
            !payment.id.toLowerCase().includes(searchLower)
          ) {
            continue
          }
        }

        invoices.push({
          id: `#INV-${payment.id.substring(0, 8).toUpperCase()}`,
          paymentId: payment.id,
          bookingId: booking?.id ? String(booking.id) : null,
          billedUserId: booking?.customer_id ? String(booking.customer_id) : null,
          billedTo,
          billedType,
          issuedDate: issuedDate.toISOString().split('T')[0],
          dueDate: dueDate.toISOString().split('T')[0],
          amount: (payment.amount_cents || 0) / 100,
          status,
        })
      }

      return {
        invoices: invoices.slice(0, limit),
        total: invoices.length,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
