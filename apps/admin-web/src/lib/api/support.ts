import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAdminAuditLog } from '@/lib/api/admin-audit'
import { requireActiveAdmin, requireAdminPermission } from '@/lib/api/admin-auth'
import { supabase } from '@/lib/supabase'

export interface SupportTicket {
  id: string
  subject: string
  userName: string
  userId: string
  date: string
  priority: 'High' | 'Medium' | 'Low' | 'Urgent'
  priorityColor: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  statusColor: string
  agent: string
  agentId: string | null
  showRespond: boolean
}

export interface SupportMessage {
  id: string
  message: string
  fromUser: boolean
  createdAt: string
  attachmentUrl?: string
  attachmentName?: string
}

export interface SupportInternalNote {
  id: string
  note: string
  createdAt: string
  adminName: string
}

export interface SupportTicketDetail extends SupportTicket {
  messages: SupportMessage[]
  internalNotes: SupportInternalNote[]
}

export interface SupportFilters {
  status?: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed'
  priority?: 'all' | 'high' | 'medium' | 'low' | 'urgent'
  search?: string
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

function formatPriority(priority: string | null): SupportTicket['priority'] {
  switch (priority) {
    case 'high':
      return 'High'
    case 'low':
      return 'Low'
    case 'urgent':
      return 'Urgent'
    default:
      return 'Medium'
  }
}

function formatStatus(status: string | null): SupportTicket['status'] {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'resolved':
      return 'Resolved'
    case 'closed':
      return 'Closed'
    default:
      return 'Open'
  }
}

export function useSupportTickets(filters: SupportFilters = {}) {
  const { status = 'all', priority = 'all', search = '' } = filters

  return useQuery({
    queryKey: ['admin', 'support-tickets', { status, priority, search }],
    queryFn: async (): Promise<SupportTicket[]> => {
      await requireAdminPermission('support.view')

      let query = supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          status,
          priority,
          created_at,
          user_id,
          assigned_to,
          profiles!support_tickets_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      if (status !== 'all') query = query.eq('status', status)
      if (priority !== 'all') query = query.eq('priority', priority)

      const { data: tickets, error } = await query
      if (error) throw error

      const assignedIds = [...new Set((tickets ?? []).map((t) => t.assigned_to).filter(Boolean))] as string[]
      const assignedMap = new Map<string, string>()

      if (assignedIds.length > 0) {
        const { data: assignedProfiles, error: assignedProfilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', assignedIds)
        if (assignedProfilesError) throw assignedProfilesError

        for (const profile of assignedProfiles ?? []) {
          assignedMap.set(
            profile.user_id,
            `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Assigned admin',
          )
        }
      }

      let results = (tickets || []).map((ticket) => {
        const profile = Array.isArray(ticket.profiles) ? ticket.profiles[0] : ticket.profiles
        const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown user'
        return {
          id: String(ticket.id),
          subject: ticket.subject || 'No Subject',
          userName,
          userId: ticket.user_id || '',
          date: ticket.created_at || '',
          priority: formatPriority(ticket.priority),
          priorityColor: priorityColors[ticket.priority || 'medium'],
          status: formatStatus(ticket.status),
          statusColor: statusColors[ticket.status || 'open'],
          agent: ticket.assigned_to ? assignedMap.get(ticket.assigned_to) || 'Assigned' : 'Unassigned',
          agentId: ticket.assigned_to || null,
          showRespond: ticket.status !== 'closed',
        }
      })

      if (search) {
        const queryLower = search.toLowerCase()
        results = results.filter((ticket) =>
          ticket.subject.toLowerCase().includes(queryLower) ||
          ticket.userName.toLowerCase().includes(queryLower) ||
          ticket.id.toLowerCase().includes(queryLower),
        )
      }

      return results
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: ['admin', 'support-ticket', ticketId],
    queryFn: async (): Promise<SupportTicketDetail | null> => {
      await requireAdminPermission('support.view')

      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          status,
          priority,
          created_at,
          user_id,
          assigned_to,
          profiles!support_tickets_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('id', ticketId)
        .maybeSingle()

      if (ticketError) throw ticketError
      if (!ticket) return null

      const [messagesResult, notesResult, assignedProfileResult] = await Promise.all([
        supabase.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true }),
        supabase
          .from('support_ticket_internal_notes')
          .select(`
            id,
            note,
            created_at,
            admin:profiles!support_ticket_internal_notes_admin_id_fkey(first_name, last_name)
          `)
          .eq('ticket_id', ticketId)
          .order('created_at', { ascending: false }),
        ticket.assigned_to
          ? supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('user_id', ticket.assigned_to)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ])

      if (messagesResult.error) throw messagesResult.error
      if (notesResult.error) throw notesResult.error
      if (assignedProfileResult.error) throw assignedProfileResult.error

      const profile = Array.isArray(ticket.profiles) ? ticket.profiles[0] : ticket.profiles
      const assignedProfile = assignedProfileResult.data
      const userName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown user'

      return {
        id: String(ticket.id),
        subject: ticket.subject || 'No Subject',
        userName,
        userId: ticket.user_id || '',
        date: ticket.created_at || '',
        priority: formatPriority(ticket.priority),
        priorityColor: priorityColors[ticket.priority || 'medium'],
        status: formatStatus(ticket.status),
        statusColor: statusColors[ticket.status || 'open'],
        agent: ticket.assigned_to
          ? `${assignedProfile?.first_name || ''} ${assignedProfile?.last_name || ''}`.trim() || 'Assigned admin'
          : 'Unassigned',
        agentId: ticket.assigned_to || null,
        showRespond: ticket.status !== 'closed',
        messages: (messagesResult.data || []).map((message) => ({
          id: String(message.id),
          message: message.message,
          fromUser: message.from_user,
          createdAt: message.created_at || '',
          attachmentUrl: message.attachment_url || undefined,
          attachmentName: message.attachment_name || undefined,
        })),
        internalNotes: (notesResult.data || []).map((note) => {
          const admin = Array.isArray(note.admin) ? note.admin[0] : note.admin
          return {
            id: note.id,
            note: note.note,
            createdAt: note.created_at,
            adminName: `${admin?.first_name || ''} ${admin?.last_name || ''}`.trim() || 'Admin',
          }
        }),
      }
    },
    enabled: !!ticketId,
  })
}

export function useCreateTicketResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      await requireAdminPermission('support.manage')
      const { user } = await requireActiveAdmin()

      const { error: messageError } = await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        message,
        from_user: false,
      })

      if (messageError) throw messageError

      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({
          status: 'in_progress',
          assigned_to: user.id,
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)

      if (updateError) throw updateError

      await createAdminAuditLog({
        action: 'support.reply',
        entityType: 'support_ticket',
        entityId: ticketId,
        summary: `Added support reply to ticket ${ticketId}`,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-ticket', variables.ticketId] })
    },
  })
}

export function useCreateSupportInternalNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, note }: { ticketId: string; note: string }) => {
      await requireAdminPermission('support.manage')
      const { user } = await requireActiveAdmin()

      const { error } = await supabase.from('support_ticket_internal_notes').insert({
        ticket_id: ticketId,
        admin_id: user.id,
        note,
      })

      if (error) throw error

      await createAdminAuditLog({
        action: 'support.note.create',
        entityType: 'support_ticket',
        entityId: ticketId,
        summary: `Added internal note to ticket ${ticketId}`,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-ticket', variables.ticketId] })
    },
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
      assignedTo,
    }: {
      ticketId: string
      status?: 'open' | 'in_progress' | 'resolved' | 'closed'
      assignedTo?: string | null
    }) => {
      await requireAdminPermission('support.manage')
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (status) updates.status = status
      if (assignedTo !== undefined) updates.assigned_to = assignedTo

      const { error } = await supabase.from('support_tickets').update(updates).eq('id', ticketId)
      if (error) throw error

      await createAdminAuditLog({
        action: 'support.status.update',
        entityType: 'support_ticket',
        entityId: ticketId,
        summary: `Updated support ticket ${ticketId}`,
        metadata: {
          status,
          assignedTo,
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-ticket', variables.ticketId] })
    },
  })
}

export function useSupportStats() {
  return useQuery({
    queryKey: ['admin', 'support-stats'],
    queryFn: async () => {
      await requireAdminPermission('support.view')

      const { data, error } = await supabase.from('support_tickets').select('status, created_at, last_message_at')
      if (error) throw error

      const tickets = data ?? []
      const openTickets = tickets.filter((ticket) => ticket.status === 'open').length
      const inProgressTickets = tickets.filter((ticket) => ticket.status === 'in_progress').length
      const closedTickets = tickets.filter((ticket) => ticket.status === 'closed' || ticket.status === 'resolved').length

      const responseSamples = tickets
        .filter((ticket) => ticket.created_at && ticket.last_message_at)
        .map((ticket) => {
          const start = new Date(ticket.created_at).getTime()
          const end = new Date(ticket.last_message_at as string).getTime()
          return Math.max(0, end - start)
        })

      const avgResponseMs =
        responseSamples.length > 0
          ? responseSamples.reduce((sum, sample) => sum + sample, 0) / responseSamples.length
          : null

      return {
        openTickets,
        inProgressTickets,
        closedTickets,
        avgResponseTime: avgResponseMs ? `${Math.round(avgResponseMs / (1000 * 60 * 60))}h` : 'N/A',
      }
    },
    staleTime: 30 * 1000,
  })
}
