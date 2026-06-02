import { useQuery } from '@tanstack/react-query'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface MarketplaceReportSummary {
  grossRevenue: number
  refundedRevenue: number
  completedBookings: number
  activeProviders: number
  openDisputes: number
  openTickets: number
}

export interface CategoryReportRow {
  category: string
  bookings: number
  revenue: number
}

export interface CityReportRow {
  city: string
  providers: number
  customers: number
}

export function useMarketplaceReportSummary() {
  return useQuery({
    queryKey: ['admin', 'reports', 'summary'],
    queryFn: async (): Promise<MarketplaceReportSummary> => {
      await requireAdminPermission('reports.view')

      const [paymentsResult, bookingsResult, providersResult, disputesResult, ticketsResult] = await Promise.all([
        supabase.from('payments').select('amount_cents, status'),
        supabase.from('bookings').select('status'),
        supabase.from('profiles').select('user_id', { count: 'exact', head: true }).eq('role', 'handy').eq('account_status', 'active'),
        supabase.from('disputes').select('id', { count: 'exact', head: true }).in('status', ['open', 'investigating']),
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
      ])

      if (paymentsResult.error) throw paymentsResult.error
      if (bookingsResult.error) throw bookingsResult.error
      if (providersResult.error) throw providersResult.error
      if (disputesResult.error) throw disputesResult.error
      if (ticketsResult.error) throw ticketsResult.error

      const payments = paymentsResult.data ?? []
      const bookings = bookingsResult.data ?? []

      return {
        grossRevenue: payments.filter((row) => row.status === 'paid').reduce((sum, row) => sum + row.amount_cents, 0) / 100,
        refundedRevenue: payments.filter((row) => row.status === 'refunded').reduce((sum, row) => sum + row.amount_cents, 0) / 100,
        completedBookings: bookings.filter((row) => row.status === 'completed').length,
        activeProviders: providersResult.count || 0,
        openDisputes: disputesResult.count || 0,
        openTickets: ticketsResult.count || 0,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useCategoryPerformanceReport() {
  return useQuery({
    queryKey: ['admin', 'reports', 'categories'],
    queryFn: async (): Promise<CategoryReportRow[]> => {
      await requireAdminPermission('reports.view')

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          category_id,
          status,
          categories(name),
          payments(amount_cents, status)
        `)

      if (error) throw error

      const rows = new Map<string, CategoryReportRow>()
      for (const booking of data ?? []) {
        const category = Array.isArray(booking.categories) ? booking.categories[0] : booking.categories
        const payments = Array.isArray(booking.payments) ? booking.payments : booking.payments ? [booking.payments] : []
        const key = category?.name || 'Uncategorised'
        const current = rows.get(key) || { category: key, bookings: 0, revenue: 0 }
        current.bookings += 1
        current.revenue += payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + (payment.amount_cents || 0), 0) / 100
        rows.set(key, current)
      }

      return [...rows.values()].sort((a, b) => b.revenue - a.revenue)
    },
    staleTime: 60 * 1000,
  })
}

export function useCityCoverageReport() {
  return useQuery({
    queryKey: ['admin', 'reports', 'cities'],
    queryFn: async (): Promise<CityReportRow[]> => {
      await requireAdminPermission('reports.view')

      const [{ data: providers, error: providerError }, { data: customers, error: customerError }] = await Promise.all([
        supabase.from('profiles').select('postcode').eq('role', 'handy'),
        supabase.from('profiles').select('postcode').eq('role', 'customer'),
      ])

      if (providerError) throw providerError
      if (customerError) throw customerError

      const { data: serviceAreas, error: areaError } = await supabase.from('service_areas').select('city, postcode_prefix').eq('enabled', true)
      if (areaError) throw areaError

      const rows = new Map<string, CityReportRow>()
      for (const area of serviceAreas ?? []) {
        rows.set(area.city, {
          city: area.city,
          providers: (providers ?? []).filter((profile) => (profile.postcode || '').toUpperCase().startsWith(area.postcode_prefix.toUpperCase())).length,
          customers: (customers ?? []).filter((profile) => (profile.postcode || '').toUpperCase().startsWith(area.postcode_prefix.toUpperCase())).length,
        })
      }

      return [...rows.values()].sort((a, b) => b.providers - a.providers)
    },
    staleTime: 60 * 1000,
  })
}
