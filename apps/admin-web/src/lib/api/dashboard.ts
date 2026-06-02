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
          .in('verification_status', ['pending', 'submitted']),
        supabase
          .from('bookings')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending', 'accepted', 'in_progress']),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('payments').select('amount_cents, created_at').eq('status', 'paid'),
        supabase.from('payments').select('amount_cents').eq('status', 'refunded'),
        supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'pending']),
        supabase.from('profiles').select('role, created_at'),
        supabase.from('bookings').select('status, created_at'),
        supabase
          .from('bookings')
          .select(`
            id,
            task_title,
            status,
            scheduled_date,
            categories(name),
            customer:profiles!bookings_customer_profile_fkey(first_name, last_name),
            provider:profiles!bookings_handy_id_fkey(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      const error =
        customerCountResult.error ||
        providerCountResult.error ||
        pendingApprovalsResult.error ||
        activeBookingsResult.error ||
        completedBookingsResult.error ||
        cancelledBookingsResult.error ||
        paidPaymentsResult.error ||
        refundedPaymentsResult.error ||
        failedPaymentsResult.error ||
        supportTicketsResult.error ||
        profilesResult.error ||
        bookingsResult.error ||
        recentBookingsResult.error

      if (error) throw error

      const profiles = profilesResult.data ?? []
      const bookings = bookingsResult.data ?? []
      const paidPayments = paidPaymentsResult.data ?? []
      const refundedPayments = refundedPaymentsResult.data ?? []

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
          openSupportTickets: { label: 'Open Support Tickets', value: supportTicketsResult.count || 0, format: 'number' },
          failedPayments: { label: 'Failed Payments', value: failedPaymentsResult.count || 0, format: 'number' },
        },
        trends,
        recentBookings: (recentBookingsResult.data ?? []).map((booking) => {
          const customer = Array.isArray(booking.customer) ? booking.customer[0] : booking.customer
          const provider = Array.isArray(booking.provider) ? booking.provider[0] : booking.provider
          const category = Array.isArray(booking.categories) ? booking.categories[0] : booking.categories
          return {
            id: String(booking.id),
            customer_name:
              `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim() || 'Unknown customer',
            provider_name:
              `${provider?.first_name || ''} ${provider?.last_name || ''}`.trim() || 'Unassigned',
            task_title: booking.task_title,
            category_name: category?.name || 'Uncategorised',
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
