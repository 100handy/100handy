import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type OutreachLeadRow = Database['public']['Tables']['outreach_leads']['Row']
type OutreachLeadInsert = Database['public']['Tables']['outreach_leads']['Insert']
type OutreachLeadUpdate = Database['public']['Tables']['outreach_leads']['Update']
type OutreachMessageRow = Database['public']['Tables']['outreach_messages']['Row']
type OutreachMessageInsert = Database['public']['Tables']['outreach_messages']['Insert']
type OutreachMessageUpdate = Database['public']['Tables']['outreach_messages']['Update']
type OutreachFollowUpRow = Database['public']['Tables']['outreach_follow_ups']['Row']
type OutreachFollowUpInsert = Database['public']['Tables']['outreach_follow_ups']['Insert']
type OutreachFollowUpUpdate = Database['public']['Tables']['outreach_follow_ups']['Update']

export type OutreachLeadType = OutreachLeadRow['lead_type']
export type OutreachLeadStatus = OutreachLeadRow['status']
export type OutreachApprovalStatus = OutreachLeadRow['approval_status']
export type OutreachMessageDeliveryStatus = OutreachMessageRow['delivery_status']

export interface OutreachLeadFilters {
  leadType?: OutreachLeadType | 'all'
  status?: OutreachLeadStatus | 'all'
  approvalStatus?: OutreachApprovalStatus | 'all'
  search?: string
}

export interface OutreachLeadWithMessages extends OutreachLeadRow {
  messages: OutreachMessageRow[]
  followUps: OutreachFollowUpRow[]
}

export interface OutreachSummary {
  total: number
  customers: number
  workers: number
  pendingApproval: number
  approved: number
  contacted: number
}

export interface RunOutreachAgentInput {
  agentType: 'customer_finder' | 'worker_finder'
  sourcePlatform: string
  defaultServiceType: string
  items: Array<{
    raw_text: string
    source_url?: string | null
    profile_name?: string | null
    business_name?: string | null
    location?: string | null
  }>
}

export function useOutreachLeads(filters: OutreachLeadFilters = {}) {
  return useQuery({
    queryKey: ['outreach', 'leads', filters],
    queryFn: async (): Promise<OutreachLeadWithMessages[]> => {
      await requireAdminPermission('outreach.manage')

      let leadQuery = supabase
        .from('outreach_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (filters.leadType && filters.leadType !== 'all') {
        leadQuery = leadQuery.eq('lead_type', filters.leadType)
      }
      if (filters.status && filters.status !== 'all') {
        leadQuery = leadQuery.eq('status', filters.status)
      }
      if (filters.approvalStatus && filters.approvalStatus !== 'all') {
        leadQuery = leadQuery.eq('approval_status', filters.approvalStatus)
      }
      if (filters.search?.trim()) {
        const search = filters.search.trim().replaceAll('%', '').replaceAll(',', ' ')
        leadQuery = leadQuery.or(
          `profile_name.ilike.%${search}%,business_name.ilike.%${search}%,location.ilike.%${search}%,service_type.ilike.%${search}%,source_platform.ilike.%${search}%`,
        )
      }

      const { data: leads, error: leadsError } = await leadQuery
      if (leadsError) throw leadsError

      const leadRows: OutreachLeadRow[] = leads ?? []
      const leadIds = leadRows.map((lead) => lead.id)
      if (leadIds.length === 0) return []

      const [
        { data: messages, error: messagesError },
        { data: followUps, error: followUpsError },
      ] = await Promise.all([
        supabase
          .from('outreach_messages')
          .select('*')
          .in('lead_id', leadIds)
          .order('created_at', { ascending: false }),
        supabase
          .from('outreach_follow_ups')
          .select('*')
          .in('lead_id', leadIds)
          .order('due_at', { ascending: true }),
      ])

      if (messagesError) throw messagesError
      if (followUpsError) throw followUpsError

      const messagesByLead = new Map<string, OutreachMessageRow[]>()
      for (const message of messages ?? []) {
        messagesByLead.set(message.lead_id, [...(messagesByLead.get(message.lead_id) ?? []), message])
      }

      const followUpsByLead = new Map<string, OutreachFollowUpRow[]>()
      for (const followUp of followUps ?? []) {
        followUpsByLead.set(followUp.lead_id, [...(followUpsByLead.get(followUp.lead_id) ?? []), followUp])
      }

      return leadRows.map((lead) => ({
        ...lead,
        messages: messagesByLead.get(lead.id) ?? [],
        followUps: followUpsByLead.get(lead.id) ?? [],
      }))
    },
    staleTime: 20 * 1000,
  })
}

export function useOutreachSummary() {
  return useQuery({
    queryKey: ['outreach', 'summary'],
    queryFn: async (): Promise<OutreachSummary> => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase
        .from('outreach_leads')
        .select('lead_type, status, approval_status')

      if (error) throw error

      const rows = data ?? []
      return {
        total: rows.length,
        customers: rows.filter((row) => row.lead_type === 'customer').length,
        workers: rows.filter((row) => row.lead_type === 'worker').length,
        pendingApproval: rows.filter((row) => row.approval_status === 'pending').length,
        approved: rows.filter((row) => row.approval_status === 'approved').length,
        contacted: rows.filter((row) => row.status === 'contacted').length,
      }
    },
    staleTime: 20 * 1000,
  })
}

export function useCreateOutreachLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: OutreachLeadInsert) => {
      const { user } = await requireAdminPermission('outreach.manage')

      const payload: OutreachLeadInsert = {
        ...input,
        created_by: user.id,
        updated_by: user.id,
      }

      const { data, error } = await supabase
        .from('outreach_leads')
        .insert(payload)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.lead.create',
        entityType: 'outreach_lead',
        entityId: data.id,
        summary: `Created outreach lead ${data.profile_name || data.business_name || data.id}`,
        metadata: {
          leadType: data.lead_type,
          sourcePlatform: data.source_platform,
          serviceType: data.service_type,
          approvalStatus: data.approval_status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useUpdateOutreachLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OutreachLeadUpdate }) => {
      const { user } = await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase
        .from('outreach_leads')
        .update({ ...updates, updated_by: user.id })
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.lead.update',
        entityType: 'outreach_lead',
        entityId: data.id,
        summary: `Updated outreach lead ${data.profile_name || data.business_name || data.id}`,
        metadata: {
          updatedFields: Object.keys(updates),
          status: data.status,
          approvalStatus: data.approval_status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useCreateOutreachMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: OutreachMessageInsert) => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase
        .from('outreach_messages')
        .insert(input)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.message.create',
        entityType: 'outreach_message',
        entityId: data.id,
        summary: `Created outreach message for lead ${data.lead_id}`,
        metadata: {
          leadId: data.lead_id,
          channel: data.channel,
          approvalStatus: data.approval_status,
          deliveryStatus: data.delivery_status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useGenerateOutreachDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (leadId: string) => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase.functions.invoke('generate-outreach-draft', {
        body: { lead_id: leadId },
      })

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.draft.generate',
        entityType: 'outreach_lead',
        entityId: leadId,
        summary: `Generated outreach draft for lead ${leadId}`,
        metadata: {
          function: 'generate-outreach-draft',
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useRunOutreachAgent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: RunOutreachAgentInput) => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase.functions.invoke('run-outreach-agent', {
        body: {
          agent_type: input.agentType,
          source_platform: input.sourcePlatform,
          default_service_type: input.defaultServiceType,
          items: input.items,
        },
      })

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.agent.run',
        entityType: 'outreach_agent',
        entityId: input.agentType,
        summary: `Ran ${input.agentType.replaceAll('_', ' ')} outreach agent`,
        metadata: {
          agentType: input.agentType,
          sourcePlatform: input.sourcePlatform,
          defaultServiceType: input.defaultServiceType,
          itemCount: input.items.length,
          createdCount: data?.created_count ?? null,
        },
      })

      return data as { success: boolean; created_count: number }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useUpdateOutreachMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OutreachMessageUpdate }) => {
      const { user } = await requireAdminPermission('outreach.manage')
      const now = new Date().toISOString()
      const payload: OutreachMessageUpdate = { ...updates }

      if (updates.approval_status === 'approved') {
        payload.approved_by = user.id
        payload.approved_at = now
      }
      if (updates.delivery_status === 'sent') {
        payload.sent_by = user.id
        payload.sent_at = now
      }

      const { data, error } = await supabase
        .from('outreach_messages')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.message.update',
        entityType: 'outreach_message',
        entityId: data.id,
        summary: `Updated outreach message ${data.id}`,
        metadata: {
          leadId: data.lead_id,
          updatedFields: Object.keys(updates),
          approvalStatus: data.approval_status,
          deliveryStatus: data.delivery_status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useSendOutreachMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase.functions.invoke('send-outreach-message', {
        body: { message_id: messageId },
      })

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.message.send',
        entityType: 'outreach_message',
        entityId: messageId,
        summary: `Sent outreach email for message ${messageId}`,
        metadata: { channel: 'email', function: 'send-outreach-message' },
      })

      return data as { success: boolean; sent_to: string; message_id: string }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useCreateOutreachFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: OutreachFollowUpInsert) => {
      await requireAdminPermission('outreach.manage')

      const { data, error } = await supabase
        .from('outreach_follow_ups')
        .insert(input)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.follow_up.create',
        entityType: 'outreach_follow_up',
        entityId: data.id,
        summary: `Created outreach follow-up for lead ${data.lead_id}`,
        metadata: {
          leadId: data.lead_id,
          dueAt: data.due_at,
          status: data.status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}

export function useUpdateOutreachFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: OutreachFollowUpUpdate }) => {
      const { user } = await requireAdminPermission('outreach.manage')
      const payload: OutreachFollowUpUpdate = { ...updates }

      if (updates.status === 'completed') {
        payload.completed_by = user.id
        payload.completed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('outreach_follow_ups')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error

      await createAdminAuditLog({
        action: 'outreach.follow_up.update',
        entityType: 'outreach_follow_up',
        entityId: data.id,
        summary: `Updated outreach follow-up ${data.id}`,
        metadata: {
          leadId: data.lead_id,
          updatedFields: Object.keys(updates),
          status: data.status,
        },
      })

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] })
    },
  })
}
