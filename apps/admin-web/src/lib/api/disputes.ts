import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface DisputeListItem {
  id: string
  bookingId: string
  subject: string
  status: 'open' | 'investigating' | 'resolved' | 'refunded' | 'rejected'
  customerName: string
  providerName: string
  assignedTo: string
  openedAt: string
  refundAmount: number | null
}

export interface DisputeMessageItem {
  id: string
  senderName: string
  message: string
  internalOnly: boolean
  createdAt: string
}

export interface DisputeDetail extends DisputeListItem {
  description: string
  resolutionSummary: string | null
  bookingTitle: string
  bookingStatus: string
  messages: DisputeMessageItem[]
}

export interface DisputeFilters {
  status?: 'all' | DisputeListItem['status']
  search?: string
}

function formatPersonName(profile: { first_name?: string | null; last_name?: string | null } | null | undefined, fallback: string) {
  const value = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
  return value || fallback
}

export function useDisputes(filters: DisputeFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'disputes', filters],
    queryFn: async (): Promise<DisputeListItem[]> => {
      await requireAdminPermission('disputes.manage')

      let query = supabase
        .from('disputes')
        .select(`
          id,
          booking_id,
          subject,
          status,
          opened_at,
          refund_amount_cents,
          customer:profiles!disputes_customer_id_fkey(first_name, last_name),
          provider:profiles!disputes_provider_id_fkey(first_name, last_name),
          assigned:profiles!disputes_assigned_to_fkey(first_name, last_name)
        `)
        .order('opened_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      if (error) throw error

      let items = (data ?? []).map((row) => {
        const customer = Array.isArray(row.customer) ? row.customer[0] : row.customer
        const provider = Array.isArray(row.provider) ? row.provider[0] : row.provider
        const assigned = Array.isArray(row.assigned) ? row.assigned[0] : row.assigned

        return {
          id: row.id,
          bookingId: row.booking_id,
          subject: row.subject,
          status: row.status,
          customerName: formatPersonName(customer, 'Unknown customer'),
          providerName: formatPersonName(provider, 'Unknown provider'),
          assignedTo: formatPersonName(assigned, 'Unassigned'),
          openedAt: row.opened_at,
          refundAmount: row.refund_amount_cents ? row.refund_amount_cents / 100 : null,
        }
      })

      if (filters.search) {
        const searchValue = filters.search.toLowerCase()
        items = items.filter((item) =>
          item.id.toLowerCase().includes(searchValue) ||
          item.subject.toLowerCase().includes(searchValue) ||
          item.customerName.toLowerCase().includes(searchValue) ||
          item.providerName.toLowerCase().includes(searchValue) ||
          item.bookingId.toLowerCase().includes(searchValue),
        )
      }

      return items
    },
    staleTime: 30 * 1000,
  })
}

export function useDispute(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'disputes', id],
    queryFn: async (): Promise<DisputeDetail | null> => {
      if (!id) return null
      await requireAdminPermission('disputes.manage')

      const { data: dispute, error } = await supabase
        .from('disputes')
        .select(`
          id,
          booking_id,
          subject,
          description,
          status,
          resolution_summary,
          opened_at,
          refund_amount_cents,
          customer:profiles!disputes_customer_id_fkey(first_name, last_name),
          provider:profiles!disputes_provider_id_fkey(first_name, last_name),
          assigned:profiles!disputes_assigned_to_fkey(first_name, last_name),
          booking:bookings(task_title, status)
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (!dispute) return null

      const { data: messages, error: messagesError } = await supabase
        .from('dispute_messages')
        .select(`
          id,
          message,
          internal_only,
          created_at,
          sender:profiles!dispute_messages_sender_id_fkey(first_name, last_name)
        `)
        .eq('dispute_id', id)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      const customer = Array.isArray(dispute.customer) ? dispute.customer[0] : dispute.customer
      const provider = Array.isArray(dispute.provider) ? dispute.provider[0] : dispute.provider
      const assigned = Array.isArray(dispute.assigned) ? dispute.assigned[0] : dispute.assigned
      const booking = Array.isArray(dispute.booking) ? dispute.booking[0] : dispute.booking

      return {
        id: dispute.id,
        bookingId: dispute.booking_id,
        subject: dispute.subject,
        status: dispute.status,
        customerName: formatPersonName(customer, 'Unknown customer'),
        providerName: formatPersonName(provider, 'Unknown provider'),
        assignedTo: formatPersonName(assigned, 'Unassigned'),
        openedAt: dispute.opened_at,
        refundAmount: dispute.refund_amount_cents ? dispute.refund_amount_cents / 100 : null,
        description: dispute.description,
        resolutionSummary: dispute.resolution_summary,
        bookingTitle: booking?.task_title || 'Unknown booking',
        bookingStatus: booking?.status || 'unknown',
        messages: (messages ?? []).map((message) => {
          const sender = Array.isArray(message.sender) ? message.sender[0] : message.sender
          return {
            id: message.id,
            senderName: formatPersonName(sender, 'Admin'),
            message: message.message,
            internalOnly: message.internal_only,
            createdAt: message.created_at,
          }
        }),
      }
    },
    enabled: !!id,
    staleTime: 15 * 1000,
  })
}

export function useDisputeStats() {
  return useQuery({
    queryKey: ['admin', 'dispute-stats'],
    queryFn: async () => {
      await requireAdminPermission('disputes.manage')
      const { data, error } = await supabase.from('disputes').select('status, refund_amount_cents')
      if (error) throw error
      const rows = data ?? []
      return {
        open: rows.filter((row) => row.status === 'open').length,
        investigating: rows.filter((row) => row.status === 'investigating').length,
        resolved: rows.filter((row) => row.status === 'resolved').length,
        refunded: rows.filter((row) => row.status === 'refunded').length,
        refundedAmount: rows.reduce((sum, row) => sum + (row.refund_amount_cents || 0), 0) / 100,
      }
    },
    staleTime: 30 * 1000,
  })
}

export function useAssignDisputeToCurrentAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ disputeId }: { disputeId: string }) => {
      const { user } = await requireActiveAdmin()
      await requireAdminPermission('disputes.manage')

      const { error } = await supabase
        .from('disputes')
        .update({ assigned_to: user.id, status: 'investigating' })
        .eq('id', disputeId)

      if (error) throw error

      await createAdminAuditLog({
        action: 'dispute.assign',
        entityType: 'dispute',
        entityId: disputeId,
        summary: `Assigned dispute ${disputeId} to current admin`,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dispute-stats'] })
    },
  })
}

export function useCreateDisputeMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      disputeId,
      message,
      internalOnly,
    }: {
      disputeId: string
      message: string
      internalOnly: boolean
    }) => {
      const { user } = await requireActiveAdmin()
      await requireAdminPermission('disputes.manage')

      const { error } = await supabase.from('dispute_messages').insert({
        dispute_id: disputeId,
        sender_id: user.id,
        message,
        internal_only: internalOnly,
      })

      if (error) throw error

      await createAdminAuditLog({
        action: internalOnly ? 'dispute.note' : 'dispute.reply',
        entityType: 'dispute',
        entityId: disputeId,
        summary: `${internalOnly ? 'Added internal note to' : 'Replied on'} dispute ${disputeId}`,
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes', variables.disputeId] })
    },
  })
}

export function useUpdateDisputeStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      disputeId,
      status,
      resolutionSummary,
      refundAmount,
    }: {
      disputeId: string
      status: DisputeListItem['status']
      resolutionSummary?: string
      refundAmount?: number
    }) => {
      await requireAdminPermission('disputes.manage')

      const { data: dispute, error: loadError } = await supabase
        .from('disputes')
        .select('id, booking_id')
        .eq('id', disputeId)
        .single()

      if (loadError) throw loadError

      if (status === 'refunded' && dispute.booking_id) {
        const { error: refundError } = await supabase.functions.invoke('refund-payment', {
          body: {
            bookingId: dispute.booking_id,
            amount: refundAmount ? Math.round(refundAmount * 100) : undefined,
          },
        })

        if (refundError) throw refundError
      }

      const updatePayload: Record<string, unknown> = {
        status,
        resolution_summary: resolutionSummary ?? null,
        resolved_at: ['resolved', 'refunded', 'rejected'].includes(status) ? new Date().toISOString() : null,
      }
      if (typeof refundAmount === 'number') {
        updatePayload.refund_amount_cents = Math.round(refundAmount * 100)
      }

      const { error } = await supabase.from('disputes').update(updatePayload).eq('id', disputeId)
      if (error) throw error

      await createAdminAuditLog({
        action: 'dispute.status',
        entityType: 'dispute',
        entityId: disputeId,
        summary: `Updated dispute ${disputeId} to ${status}`,
        metadata: {
          status,
          resolutionSummary: resolutionSummary ?? null,
          refundAmount: typeof refundAmount === 'number' ? refundAmount : null,
        },
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes', variables.disputeId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dispute-stats'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
