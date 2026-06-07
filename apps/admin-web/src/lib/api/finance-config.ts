import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type PaymentMethodRow = Database['public']['Tables']['payment_method_configs']['Row']
type PaymentMethodInsert = Database['public']['Tables']['payment_method_configs']['Insert']
type PricingRuleRow = Database['public']['Tables']['service_pricing_rules']['Row']
type PricingRuleInsert = Database['public']['Tables']['service_pricing_rules']['Insert']
type JoinedName = { name?: string | null }
type PricingRuleQueryRow = PricingRuleRow & {
  categories?: JoinedName | JoinedName[] | null
  location_areas?: JoinedName | JoinedName[] | null
}

export type PaymentMethodConfig = PaymentMethodRow
export type PricingRule = PricingRuleRow & {
  category_name: string
  location_area_name: string | null
}

export function usePaymentMethodConfigs() {
  return useQuery({
    queryKey: ['finance-config', 'payment-methods'],
    queryFn: async (): Promise<PaymentMethodConfig[]> => {
      await requireAdminPermission('finance.view')
      const { data, error } = await supabase
        .from('payment_method_configs')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('display_name', { ascending: true })
      if (error) throw error
      return data ?? []
    },
    staleTime: 30 * 1000,
  })
}

export function useSavePaymentMethodConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PaymentMethodInsert) => {
      await requireAdminPermission('finance.manage')
      const payload: PaymentMethodInsert = {
        ...input,
        supported_currencies: input.supported_currencies ?? ['GBP'],
      }
      const query = input.id
        ? supabase.from('payment_method_configs').update(payload).eq('id', input.id)
        : supabase.from('payment_method_configs').insert(payload)
      const { data, error } = await query.select('*').single()
      if (error) throw error
      await createAdminAuditLog({
        action: input.id ? 'payment_method.updated' : 'payment_method.created',
        entityType: 'payment_method',
        entityId: data.id,
        summary: `${input.id ? 'Updated' : 'Created'} payment method ${data.display_name}`,
        metadata: { provider_key: data.provider_key, method_type: data.method_type, status: data.status },
      })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-config', 'payment-methods'] }),
  })
}

export function useDeletePaymentMethodConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (method: PaymentMethodConfig) => {
      await requireAdminPermission('finance.manage')
      const { error } = await supabase.from('payment_method_configs').delete().eq('id', method.id)
      if (error) throw error
      await createAdminAuditLog({
        action: 'payment_method.deleted',
        entityType: 'payment_method',
        entityId: method.id,
        summary: `Deleted payment method ${method.display_name}`,
        metadata: { provider_key: method.provider_key },
      })
      return method.id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-config', 'payment-methods'] }),
  })
}

export function usePricingRules() {
  return useQuery({
    queryKey: ['finance-config', 'pricing-rules'],
    queryFn: async (): Promise<PricingRule[]> => {
      await requireAdminPermission('finance.view')
      const { data, error } = await supabase
        .from('service_pricing_rules')
        .select(`
          *,
          categories(name),
          location_areas(name)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return ((data ?? []) as PricingRuleQueryRow[]).map((row) => {
        const category = Array.isArray(row.categories) ? row.categories[0] : row.categories
        const locationArea = Array.isArray(row.location_areas) ? row.location_areas[0] : row.location_areas

        return {
          ...row,
          category_name: category?.name ?? 'Unknown',
          location_area_name: locationArea?.name ?? null,
        }
      })
    },
    staleTime: 30 * 1000,
  })
}

export function usePricingRuleOptions() {
  return useQuery({
    queryKey: ['finance-config', 'pricing-rule-options'],
    queryFn: async () => {
      await requireAdminPermission('finance.view')
      const [{ data: categories, error: categoriesError }, { data: locations, error: locationsError }] = await Promise.all([
        supabase.from('categories').select('id, name, active').in('level', [0, 1]).order('level', { ascending: true }).order('display_order', { ascending: true }),
        supabase.from('location_areas').select('id, name, area_type, enabled').in('area_type', ['nation', 'region', 'city']).order('sort_order', { ascending: true }),
      ])
      if (categoriesError) throw categoriesError
      if (locationsError) throw locationsError
      return {
        categories: categories ?? [],
        locations: locations ?? [],
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useSavePricingRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PricingRuleInsert) => {
      await requireAdminPermission('finance.manage')
      const query = input.id
        ? supabase.from('service_pricing_rules').update(input).eq('id', input.id)
        : supabase.from('service_pricing_rules').insert(input)
      const { data, error } = await query.select('*').single()
      if (error) throw error
      await createAdminAuditLog({
        action: input.id ? 'pricing_rule.updated' : 'pricing_rule.created',
        entityType: 'pricing_rule',
        entityId: data.id,
        summary: `${input.id ? 'Updated' : 'Created'} pricing rule for ${data.category_id}`,
        metadata: {
          category_id: data.category_id,
          location_area_id: data.location_area_id,
          currency_code: data.currency_code,
          base_rate_cents: data.base_rate_cents,
          rate_kind: data.rate_kind,
          active: data.active,
        },
      })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-config', 'pricing-rules'] }),
  })
}

export function useDeletePricingRule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (rule: PricingRule) => {
      await requireAdminPermission('finance.manage')
      const { error } = await supabase.from('service_pricing_rules').delete().eq('id', rule.id)
      if (error) throw error
      await createAdminAuditLog({
        action: 'pricing_rule.deleted',
        entityType: 'pricing_rule',
        entityId: rule.id,
        summary: `Deleted pricing rule for ${rule.category_name}`,
        metadata: {
          category_id: rule.category_id,
          location_area_id: rule.location_area_id,
          currency_code: rule.currency_code,
        },
      })
      return rule.id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance-config', 'pricing-rules'] }),
  })
}
