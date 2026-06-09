import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Json } from '@/lib/database.types'

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
  metrics: Record<string, DashboardMetricCard>
  trends: DashboardTrendPoint[]
  recentBookings: DashboardRecentBooking[]
}

export interface DashboardPreferences {
  visibleMetricLabels: string[]
  metricOrder: string[]
}

const DEFAULT_DASHBOARD_METRIC_LABELS = [
  'Customers',
  'Providers',
  'Pending Provider Approvals',
  'Active Jobs',
  'Completed Jobs',
  'Cancelled Jobs',
  'Revenue',
  'Refunds',
  'Open Disputes',
  'Open Support Tickets',
  'Failed Payments',
]

export const DASHBOARD_METRIC_LIBRARY = [
  ...DEFAULT_DASHBOARD_METRIC_LABELS,
  'New Customers This Month',
  'New Providers This Month',
  'Jobs This Week',
  'Jobs Awaiting Assignment',
  'Payout Queue',
  'Paused Accounts',
  'Disabled Categories',
  'Enabled Service Areas',
]

function getDashboardPreferencesSettingKey(userId: string) {
  return `dashboard.preferences.${userId}`
}

function normalizeDashboardPreferences(valueJson: unknown): DashboardPreferences {
  const input = (valueJson && typeof valueJson === 'object' ? valueJson : {}) as Partial<DashboardPreferences>
  const ordered = Array.isArray(input.metricOrder) ? input.metricOrder.filter((label): label is string => typeof label === 'string') : []
  const visible = Array.isArray(input.visibleMetricLabels)
    ? input.visibleMetricLabels.filter((label): label is string => typeof label === 'string')
    : []

  const metricOrder = [
    ...ordered.filter((label) => DASHBOARD_METRIC_LIBRARY.includes(label)),
    ...DASHBOARD_METRIC_LIBRARY.filter((label) => !ordered.includes(label)),
  ]

  const visibleMetricLabels = visible.length > 0
    ? visible.filter((label) => metricOrder.includes(label))
    : [...DEFAULT_DASHBOARD_METRIC_LABELS]

  return {
    metricOrder,
    visibleMetricLabels,
  }
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview-v2'],
    queryFn: async (): Promise<DashboardOverview> => {
      await requireAdminPermission('dashboard.view')

      const { data, error } = await supabase.rpc('get_admin_dashboard_overview')

      if (error) {
        throw new Error(error.message || 'Failed to load dashboard data.')
      }

      return data as DashboardOverview
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useDashboardPreferences() {
  return useQuery({
    queryKey: ['dashboard', 'preferences'],
    queryFn: async (): Promise<DashboardPreferences> => {
      const { user } = await requireActiveAdmin()
      const settingKey = getDashboardPreferencesSettingKey(user.id)

      const { data, error } = await supabase
        .from('site_settings')
        .select('value_json')
        .eq('setting_key', settingKey)
        .maybeSingle()

      if (error) throw error

      return normalizeDashboardPreferences(data?.value_json)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSaveDashboardPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preferences: DashboardPreferences) => {
      const { user } = await requireActiveAdmin()
      const settingKey = getDashboardPreferencesSettingKey(user.id)
      const normalized = normalizeDashboardPreferences(preferences)

      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            setting_group: 'dashboard',
            setting_key: settingKey,
            value_json: normalized as unknown as Json,
            updated_by: user.id,
          },
          { onConflict: 'setting_key' },
        )
      if (error) throw error

      await createAdminAuditLog({
        action: 'dashboard.preferences.save',
        entityType: 'dashboard_preference',
        entityId: settingKey,
        summary: 'Saved dashboard KPI preferences',
        metadata: normalized as unknown as Json,
      })

      return normalized
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'preferences'] })
    },
  })
}
