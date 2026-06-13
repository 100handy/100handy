import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface ModerationReview {
  id: string
  rating: number
  comment: string | null
  created_at: string
  customer_name: string
  provider_name: string
  booking_id: string | null
  moderationEvents: Array<{
    id: string
    action: string
    reason: string | null
    created_at: string
  }>
}

export function useModerationReviews(search?: string) {
  return useQuery({
    queryKey: ['reviews', 'moderation', search],
    queryFn: async (): Promise<ModerationReview[]> => {
      await requireAdminPermission('support.view')

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          booking_id,
          rating,
          comment,
          created_at,
          customer:profiles!reviews_customer_id_fkey(first_name, last_name),
          provider:profiles!reviews_handy_id_fkey(first_name, last_name),
          moderation:review_moderation_events(
            id,
            action,
            reason,
            created_at
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      let rows: ModerationReview[] = (data ?? []).map((review) => {
        const customer = Array.isArray(review.customer) ? review.customer[0] : review.customer
        const provider = Array.isArray(review.provider) ? review.provider[0] : review.provider
        return {
          id: String(review.id),
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          customer_name:
            `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim() || 'Unknown customer',
          provider_name:
            `${provider?.first_name || ''} ${provider?.last_name || ''}`.trim() || 'Unknown provider',
          booking_id: review.booking_id ? String(review.booking_id) : null,
          moderationEvents: (review.moderation ?? []).map((event) => ({
            id: event.id,
            action: event.action,
            reason: event.reason,
            created_at: event.created_at,
          })),
        }
      })

      if (search) {
        const q = search.toLowerCase()
        rows = rows.filter((row) =>
          row.customer_name.toLowerCase().includes(q) ||
          row.provider_name.toLowerCase().includes(q) ||
          row.comment?.toLowerCase().includes(q) === true ||
          row.id.includes(q),
        )
      }

      return rows
    },
    staleTime: 30 * 1000,
  })
}

export function useCreateReviewModerationEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      reviewId,
      action,
      reason,
    }: {
      reviewId: string
      action: 'flagged' | 'noted' | 'removed'
      reason?: string | null
    }) => {
      await requireAdminPermission('support.manage')
      const { user } = await requireActiveAdmin()

      const { error } = await supabase.from('review_moderation_events').insert({
        review_id: reviewId,
        admin_id: user.id,
        action,
        reason: reason || null,
      })

      if (error) throw error

      await createAdminAuditLog({
        action: `review.${action}`,
        entityType: 'review',
        entityId: reviewId,
        summary: `${action} review ${reviewId}`,
        metadata: {
          reason: reason || null,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'moderation'] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason: string }) => {
      await requireAdminPermission('support.manage')
      const { user } = await requireActiveAdmin()

      const { error: noteError } = await supabase.from('review_moderation_events').insert({
        review_id: reviewId,
        admin_id: user.id,
        action: 'removed',
        reason,
      })
      if (noteError) throw noteError

      const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
      if (error) throw error

      await createAdminAuditLog({
        action: 'review.delete',
        entityType: 'review',
        entityId: reviewId,
        summary: `Deleted review ${reviewId}`,
        metadata: { reason },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'moderation'] })
    },
  })
}
