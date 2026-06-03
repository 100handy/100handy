import { useQuery } from '@tanstack/react-query'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface DashboardMetricCard {
  label: string
  value: number
  format: 'number' | 'currency'
}

export interface DashboardTrendPoint {
  label: string
  bookings: number
  revenue: number
  providerGrowth: number
  customerGrowth: number
}

export interface DashboardRecentBooking {
  id: string
  customer_name: string
  provider_name: string
  task_title: string
  category_name: string
  status: string
  scheduled_date: string
}

export interface DashboardOverview {
  metrics: {
    totalCustomers: DashboardMetricCard
    totalProviders: DashboardMetricCard
    pendingProviderApprovals: DashboardMetricCard
    activeJobs: DashboardMetricCard
    completedJobs: DashboardMetricCard
    cancelledJobs: DashboardMetricCard
    revenue: DashboardMetricCard
    refunds: DashboardMetricCard
    openDisputes: DashboardMetricCard
    openSupportTickets: DashboardMetricCard
    failedPayments: DashboardMetricCard
  }
  trends: DashboardTrendPoint[]
  recentBookings: DashboardRecentBooking[]
}

function buildMonthBuckets() {
  const now = new Date()
  return Array.from({ length: 6 }).map((_, index) => {
    const date = subMonths(now, 5 - index)
    return {
      key: format(date, 'yyyy-MM'),
      label: format(date, 'MMM'),
      start: startOfMonth(date).toISOString(),
      end: endOfMonth(date).toISOString(),
    }
  })
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview-v2'],
    queryFn: async (): Promise<DashboardOverview> => {
      await requireAdminPermission('dashboard.view')

      const monthBuckets = buildMonthBuckets()

      const [
        customerCountResult,
        providerCountResult,
        pendingApprovalsResult,
        activeBookingsResult,
        completedBookingsResult,
        cancelledBookingsResult,
        paidPaymentsResult,
        refundedPaymentsResult,
        openDisputesResult,
        failedPaymentsResult,
        supportTicketsResult,
        profilesResult,
        bookingsResult,
        recentBookingsResult,
      ] = await Promise.all([
        supabase.from('profiles').select('user_id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('profiles').select('user_id', { count: 'exact', head: true }).eq('role', 'handy'),
        supabase
          .from('handy_profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('verified', false),
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'accepted', 'in_progress']),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('payments').select('amount_cents, created_at').eq('status', 'paid'),
        supabase.from('payments').select('amount_cents').eq('status', 'refunded'),
        supabase.from('disputes').select('id', { count: 'exact', head: true }).in('status', ['open', 'investigating']),
        supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'pending']),
        supabase.from('profiles').select('role, created_at'),
        supabase.from('bookings').select('status, created_at'),
        supabase
          .from('bookings')
          .select('id, task_title, status, scheduled_date, category_id, customer_id, handy_id')
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      const primaryError =
        customerCountResult.error ||
        providerCountResult.error ||
        pendingApprovalsResult.error ||
        activeBookingsResult.error ||
        completedBookingsResult.error ||
        cancelledBookingsResult.error ||
        paidPaymentsResult.error ||
        refundedPaymentsResult.error ||
        openDisputesResult.error ||
        failedPaymentsResult.error ||
        supportTicketsResult.error ||
        profilesResult.error ||
        bookingsResult.error ||
        recentBookingsResult.error

      if (primaryError) {
        throw new Error(primaryError.message || 'Failed to load dashboard data.')
      }

      const profiles = profilesResult.data ?? []
      const bookings = bookingsResult.data ?? []
      const paidPayments = paidPaymentsResult.data ?? []
      const refundedPayments = refundedPaymentsResult.data ?? []
      const recentBookings = recentBookingsResult.data ?? []

      const categoryIds = Array.from(
        new Set(recentBookings.map((booking) => booking.category_id).filter((value): value is string => Boolean(value))),
      )
      const profileIds = Array.from(
        new Set(
          recentBookings.flatMap((booking) => [booking.customer_id, booking.handy_id]).filter((value): value is string => Boolean(value)),
        ),
      )

      const [categoriesLookupResult, profilesLookupResult] = await Promise.all([
        categoryIds.length > 0
          ? supabase.from('categories').select('id, name').in('id', categoryIds)
          : Promise.resolve({ data: [], error: null }),
        profileIds.length > 0
          ? supabase.from('profiles').select('user_id, first_name, last_name').in('user_id', profileIds)
          : Promise.resolve({ data: [], error: null }),
      ])

      if (categoriesLookupResult.error || profilesLookupResult.error) {
        throw new Error(
          categoriesLookupResult.error?.message ||
          profilesLookupResult.error?.message ||
          'Failed to resolve dashboard booking details.',
        )
      }

      const categoryMap = new Map((categoriesLookupResult.data ?? []).map((category) => [category.id, category.name]))
      const profileMap = new Map(
        (profilesLookupResult.data ?? []).map((profile) => [
          profile.user_id,
          `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        ]),
      )

      const trends = monthBuckets.map((bucket) => {
        const monthlyBookings = bookings.filter(
          (booking) => booking.created_at >= bucket.start && booking.created_at <= bucket.end,
        )
        const monthlyRevenue = paidPayments
          .filter((payment) => payment.created_at >= bucket.start && payment.created_at <= bucket.end)
          .reduce((sum, payment) => sum + payment.amount_cents, 0)
        const providerGrowth = profiles.filter(
          (profile) =>
            profile.role === 'handy' && profile.created_at >= bucket.start && profile.created_at <= bucket.end,
        ).length
        const customerGrowth = profiles.filter(
          (profile) =>
            profile.role === 'customer' && profile.created_at >= bucket.start && profile.created_at <= bucket.end,
        ).length

        return {
          label: bucket.label,
          bookings: monthlyBookings.length,
          revenue: monthlyRevenue / 100,
          providerGrowth,
          customerGrowth,
        }
      })

      return {
        metrics: {
          totalCustomers: { label: 'Customers', value: customerCountResult.count || 0, format: 'number' },
          totalProviders: { label: 'Providers', value: providerCountResult.count || 0, format: 'number' },
          pendingProviderApprovals: { label: 'Pending Provider Approvals', value: pendingApprovalsResult.count || 0, format: 'number' },
          activeJobs: { label: 'Active Jobs', value: activeBookingsResult.count || 0, format: 'number' },
          completedJobs: { label: 'Completed Jobs', value: completedBookingsResult.count || 0, format: 'number' },
          cancelledJobs: { label: 'Cancelled Jobs', value: cancelledBookingsResult.count || 0, format: 'number' },
          revenue: {
            label: 'Revenue',
            value: paidPayments.reduce((sum, payment) => sum + payment.amount_cents, 0) / 100,
            format: 'currency',
          },
          refunds: {
            label: 'Refunds',
            value: refundedPayments.reduce((sum, payment) => sum + payment.amount_cents, 0) / 100,
            format: 'currency',
          },
          openDisputes: { label: 'Open Disputes', value: openDisputesResult.count || 0, format: 'number' },
          openSupportTickets: { label: 'Open Support Tickets', value: supportTicketsResult.count || 0, format: 'number' },
          failedPayments: { label: 'Failed Payments', value: failedPaymentsResult.count || 0, format: 'number' },
        },
        trends,
        recentBookings: (recentBookingsResult.data ?? []).map((booking) => {
          return {
            id: String(booking.id),
            customer_name: booking.customer_id ? profileMap.get(booking.customer_id) || 'Unknown customer' : 'Unknown customer',
            provider_name: booking.handy_id ? profileMap.get(booking.handy_id) || 'Unassigned' : 'Unassigned',
            task_title: booking.task_title,
            category_name: booking.category_id ? categoryMap.get(booking.category_id) || 'Uncategorised' : 'Uncategorised',
            status: booking.status,
            scheduled_date: booking.scheduled_date,
          }
        }),
      }
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}
