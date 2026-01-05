import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Promotions API Hooks
 *
 * Hooks for managing promo codes and promotions in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

export interface PromoCode {
  id: string
  code: string
  type: 'Discount Code' | 'Referral Program' | 'Referral Bonus'
  status: 'Active' | 'Expired' | 'Upcoming'
  statusColor: 'green' | 'gray' | 'blue'
  startDate: string
  endDate: string | 'Ongoing'
  usage: string
  amountCents: number
  maxUses: number | null
  currentUses: number
}

export interface PromoStats {
  totalDiscountsGiven: number
  totalReferralBonuses: number
  newCustomersFromPromotions: number
}

export interface TopCode {
  code: string
  uses: number
  percentage: number
}

export interface CreatePromoCodeInput {
  code: string
  amountCents: number
  expiresAt?: string
  maxUses?: number
}

// ============================================================================
// Promo Codes List Hook
// ============================================================================

export function usePromoCodes(filter?: 'all' | 'promotions' | 'referrals') {
  return useQuery({
    queryKey: ['admin', 'promo-codes', filter],
    queryFn: async (): Promise<PromoCode[]> => {
      const { data: promoCodes, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const now = new Date()

      return (promoCodes || []).map((code) => {
        // Determine status
        let status: PromoCode['status'] = 'Active'
        let statusColor: PromoCode['statusColor'] = 'green'

        if (code.expires_at) {
          const expiresAt = new Date(code.expires_at)
          if (expiresAt < now) {
            status = 'Expired'
            statusColor = 'gray'
          } else if (expiresAt > now && new Date(code.created_at || '') > now) {
            status = 'Upcoming'
            statusColor = 'blue'
          }
        }

        // Check if max uses reached
        if (code.max_uses && code.current_uses && code.current_uses >= code.max_uses) {
          status = 'Expired'
          statusColor = 'gray'
        }

        // Determine type (simplified since we don't have type column)
        const type: PromoCode['type'] = 'Discount Code'

        // Format usage string
        const usage = code.max_uses
          ? `${code.current_uses || 0} / ${code.max_uses}`
          : `${code.current_uses || 0} uses`

        // Format dates
        const startDate = code.created_at
          ? new Date(code.created_at).toISOString().split('T')[0]
          : 'Unknown'
        const endDate = code.expires_at
          ? new Date(code.expires_at).toISOString().split('T')[0]
          : 'Ongoing'

        return {
          id: code.id,
          code: code.code,
          type,
          status,
          statusColor,
          startDate,
          endDate,
          usage,
          amountCents: code.amount_cents,
          maxUses: code.max_uses,
          currentUses: code.current_uses || 0,
        }
      })
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

// ============================================================================
// Promo Stats Hook
// ============================================================================

export function usePromoStats() {
  return useQuery({
    queryKey: ['admin', 'promo-stats'],
    queryFn: async (): Promise<PromoStats> => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Get redemptions in last 30 days
      const { data: redemptions, error } = await supabase
        .from('promo_code_redemptions')
        .select('amount_cents, user_id, redeemed_at')
        .gte('redeemed_at', thirtyDaysAgo.toISOString())

      if (error) throw error

      // Calculate totals
      const totalDiscountsGiven = (redemptions || []).reduce(
        (sum, r) => sum + (r.amount_cents || 0),
        0
      ) / 100

      // Count unique users (new customers from promotions)
      const uniqueUsers = new Set((redemptions || []).map((r) => r.user_id))
      const newCustomersFromPromotions = uniqueUsers.size

      // Note: Referral bonuses would need a separate tracking system
      // For now, return 0
      const totalReferralBonuses = 0

      return {
        totalDiscountsGiven,
        totalReferralBonuses,
        newCustomersFromPromotions,
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Top Codes Hook
// ============================================================================

export function useTopCodes(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'top-codes', limit],
    queryFn: async (): Promise<TopCode[]> => {
      const { data: promoCodes, error } = await supabase
        .from('promo_codes')
        .select('code, current_uses, max_uses')
        .order('current_uses', { ascending: false })
        .limit(limit)

      if (error) throw error

      if (!promoCodes || promoCodes.length === 0) {
        return []
      }

      // Find max uses for percentage calculation
      const maxUses = Math.max(...promoCodes.map((c) => c.current_uses || 0), 1)

      return promoCodes.map((code) => ({
        code: code.code,
        uses: code.current_uses || 0,
        percentage: Math.round(((code.current_uses || 0) / maxUses) * 100),
      }))
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}

// ============================================================================
// Create Promo Code Mutation
// ============================================================================

export function useCreatePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreatePromoCodeInput) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .insert({
          code: input.code.toUpperCase(),
          amount_cents: input.amountCents,
          expires_at: input.expiresAt || null,
          max_uses: input.maxUses || null,
          current_uses: 0,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promo-codes'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'promo-stats'] })
    },
  })
}

// ============================================================================
// Update Promo Code Mutation
// ============================================================================

export interface UpdatePromoCodeInput {
  id: string
  expiresAt?: string | null
  maxUses?: number | null
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdatePromoCodeInput) => {
      const { data, error } = await supabase
        .from('promo_codes')
        .update({
          expires_at: input.expiresAt,
          max_uses: input.maxUses,
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promo-codes'] })
    },
  })
}

// ============================================================================
// Delete/Expire Promo Code Mutation
// ============================================================================

export function useExpirePromoCode() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Set expires_at to now to expire the code
      const { error } = await supabase
        .from('promo_codes')
        .update({ expires_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'promo-codes'] })
    },
  })
}
