import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface PayoutItem {
  bookingId: string
  providerId: string | null
  providerName: string
  taskTitle: string
  completedAt: string | null
  payoutStatus: string | null
  paymentStatus: string | null
  payoutAmount: number
  platformFee: number
  connectReady: boolean
  transferId: string | null
}

export interface PayoutFilters {
  status?: 'all' | 'pending' | 'transferred' | 'failed'
  search?: string
}

export function usePayoutQueue(filters: PayoutFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'payout-queue', filters],
    queryFn: async (): Promise<PayoutItem[]> => {
      await requireAdminPermission('finance.view')

      let query = supabase
        .from('bookings')
        .select(`
          id,
          handy_id,
          task_title,
          payout_status,
          payment_status,
          payout_amount_cents,
          platform_fee_cents,
          transfer_id,
          completed_at,
          provider:profiles!bookings_handy_profile_fkey(first_name, last_name),
          handy_profile:handy_profiles!bookings_handy_id_fkey(stripe_connect_account_id)
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('payout_status', filters.status)
      }

      const { data, error } = await query
      if (error) throw error

      let items = (data ?? []).map((booking) => {
        const provider = Array.isArray(booking.provider) ? booking.provider[0] : booking.provider
        const handyProfile = Array.isArray(booking.handy_profile) ? booking.handy_profile[0] : booking.handy_profile
        return {
          bookingId: booking.id,
          providerId: booking.handy_id,
          providerName: `${provider?.first_name || ''} ${provider?.last_name || ''}`.trim() || 'Unassigned',
          taskTitle: booking.task_title,
          completedAt: booking.completed_at || null,
          payoutStatus: booking.payout_status || 'pending',
          paymentStatus: booking.payment_status || null,
          payoutAmount: (booking.payout_amount_cents || 0) / 100,
          platformFee: (booking.platform_fee_cents || 0) / 100,
          connectReady: Boolean(handyProfile?.stripe_connect_account_id),
          transferId: booking.transfer_id || null,
        }
      })

      if (filters.search) {
        const searchValue = filters.search.toLowerCase()
        items = items.filter((item) =>
          item.bookingId.toLowerCase().includes(searchValue) ||
          item.providerName.toLowerCase().includes(searchValue) ||
          item.taskTitle.toLowerCase().includes(searchValue),
        )
      }

      return items
    },
    staleTime: 20 * 1000,
  })
}

export function usePayoutSummary() {
  return useQuery({
    queryKey: ['admin', 'payout-summary'],
    queryFn: async () => {
      await requireAdminPermission('finance.view')
      const { data, error } = await supabase
        .from('bookings')
        .select('payout_status, payout_amount_cents')
        .eq('status', 'completed')

      if (error) throw error
      const rows = data ?? []
      return {
        pendingCount: rows.filter((row) => (row.payout_status || 'pending') === 'pending').length,
        transferredCount: rows.filter((row) => row.payout_status === 'transferred').length,
        failedCount: rows.filter((row) => row.payout_status === 'failed').length,
        pendingAmount: rows
          .filter((row) => (row.payout_status || 'pending') === 'pending')
          .reduce((sum, row) => sum + (row.payout_amount_cents || 0), 0) / 100,
      }
    },
    staleTime: 20 * 1000,
  })
}

export function useProcessAdminPayout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      await requireAdminPermission('finance.manage')

      const { data, error } = await supabase.functions.invoke('admin-process-payout', {
        body: { bookingId },
      })

      if (error) throw error
      if (data?.error) throw new Error(data.error)

      await createAdminAuditLog({
        action: 'payout.process',
        entityType: 'booking',
        entityId: bookingId,
        summary: `Processed payout for booking ${bookingId}`,
        metadata: data,
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payout-queue'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'payout-summary'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useMarkPayoutFailed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason: string }) => {
      await requireAdminPermission('finance.manage')
      const { error } = await supabase
        .from('bookings')
        .update({ payout_status: 'failed' })
        .eq('id', bookingId)

      if (error) throw error

      await createAdminAuditLog({
        action: 'payout.mark_failed',
        entityType: 'booking',
        entityId: bookingId,
        summary: `Marked payout failed for booking ${bookingId}`,
        metadata: { reason },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payout-queue'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'payout-summary'] })
    },
  })
}
