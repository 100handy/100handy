import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Support API Hooks
 *
 * Hooks for managing support tickets in the admin dashboard
 */

// ============================================================================
// Types
// ============================================================================

export interface SupportTicket {
  id: string
  subject: string
  userName: string
  userId: string
  date: string
  priority: 'High' | 'Medium' | 'Low' | 'Urgent'
  priorityColor: string
  status: 'Open' | 'In Progress' | 'Closed'
  statusColor: string
  agent: string
  agentId: string | null
  showRespond: boolean
}

export interface SupportTicketDetail extends SupportTicket {
  messages: SupportMessage[]
}

export interface SupportMessage {
  id: string
  message: string
  fromUser: boolean
  createdAt: string
  attachmentUrl?: string
  attachmentName?: string
}

export interface SupportFilters {
  status?: 'all' | 'open' | 'in_progress' | 'closed'
  priority?: 'all' | 'high' | 'medium' | 'low' | 'urgent'
  search?: string
}

// ============================================================================
// Priority & Status Color Maps
// ============================================================================

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

// ============================================================================
// Support Tickets List Hook
// ============================================================================

export function useSupportTickets(filters: SupportFilters = {}) {
  const { status = 'all', priority = 'all', search = '' } = filters

  return useQuery({
    queryKey: ['admin', 'support-tickets', { status, priority, search }],
    queryFn: async (): Promise<SupportTicket[]> => {
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

      // Apply status filter
      if (status !== 'all') {
        query = query.eq('status', status)
      }

      // Apply priority filter
      if (priority !== 'all') {
        query = query.eq('priority', priority)
      }

      const { data: tickets, error } = await query

      if (error) throw error

      let results = (tickets || []).map((ticket) => {
        const profile = Array.isArray(ticket.profiles)
          ? ticket.profiles[0]
          : ticket.profiles

        const firstName = profile?.first_name || 'Unknown'
        const lastName = profile?.last_name || 'User'
        const userName = `${firstName} ${lastName}`.trim()

        // Format date
        const date = ticket.created_at
          ? new Date(ticket.created_at).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : ''

        // Map status
        let displayStatus: SupportTicket['status'] = 'Open'
        if (ticket.status === 'in_progress') displayStatus = 'In Progress'
        else if (ticket.status === 'closed') displayStatus = 'Closed'

        // Map priority
        let displayPriority: SupportTicket['priority'] = 'Medium'
        if (ticket.priority === 'high') displayPriority = 'High'
        else if (ticket.priority === 'low') displayPriority = 'Low'
        else if (ticket.priority === 'urgent') displayPriority = 'Urgent'

        return {
          id: ticket.id,
          subject: ticket.subject || 'No Subject',
          userName,
          userId: ticket.user_id || '',
          date,
          priority: displayPriority,
          priorityColor: priorityColors[ticket.priority || 'medium'],
          status: displayStatus,
          statusColor: statusColors[ticket.status || 'open'],
          agent: ticket.assigned_to ? 'Assigned' : 'Unassigned',
          agentId: ticket.assigned_to || null,
          showRespond: ticket.status !== 'closed',
        }
      })

      // Apply search filter (client-side)
      if (search) {
        const searchLower = search.toLowerCase()
        results = results.filter(
          (t) =>
            t.subject.toLowerCase().includes(searchLower) ||
            t.userName.toLowerCase().includes(searchLower) ||
            t.id.toLowerCase().includes(searchLower)
        )
      }

      return results
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

// ============================================================================
// Single Ticket with Messages Hook
// ============================================================================

export function useSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: ['admin', 'support-ticket', ticketId],
    queryFn: async (): Promise<SupportTicketDetail | null> => {
      // Fetch ticket
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
        .single()

      if (ticketError) throw ticketError
      if (!ticket) return null

      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      const profile = Array.isArray(ticket.profiles)
        ? ticket.profiles[0]
        : ticket.profiles

      const firstName = profile?.first_name || 'Unknown'
      const lastName = profile?.last_name || 'User'
      const userName = `${firstName} ${lastName}`.trim()

      const date = ticket.created_at
        ? new Date(ticket.created_at).toLocaleString()
        : ''

      let displayStatus: SupportTicket['status'] = 'Open'
      if (ticket.status === 'in_progress') displayStatus = 'In Progress'
      else if (ticket.status === 'closed') displayStatus = 'Closed'

      let displayPriority: SupportTicket['priority'] = 'Medium'
      if (ticket.priority === 'high') displayPriority = 'High'
      else if (ticket.priority === 'low') displayPriority = 'Low'
      else if (ticket.priority === 'urgent') displayPriority = 'Urgent'

      return {
        id: ticket.id,
        subject: ticket.subject || 'No Subject',
        userName,
        userId: ticket.user_id || '',
        date,
        priority: displayPriority,
        priorityColor: priorityColors[ticket.priority || 'medium'],
        status: displayStatus,
        statusColor: statusColors[ticket.status || 'open'],
        agent: ticket.assigned_to ? 'Assigned' : 'Unassigned',
        agentId: ticket.assigned_to || null,
        showRespond: ticket.status !== 'closed',
        messages: (messages || []).map((m) => ({
          id: m.id,
          message: m.message,
          fromUser: m.from_user,
          createdAt: m.created_at || '',
          attachmentUrl: m.attachment_url || undefined,
          attachmentName: m.attachment_name || undefined,
        })),
      }
    },
    enabled: !!ticketId,
  })
}

// ============================================================================
// Create Ticket Response Mutation
// ============================================================================

export function useCreateTicketResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      // Add the admin response
      const { error: messageError } = await supabase.from('support_messages').insert({
        ticket_id: ticketId,
        message,
        from_user: false, // Admin response
      })

      if (messageError) throw messageError

      // Update ticket status to in_progress if it was open
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({
          status: 'in_progress',
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)
        .eq('status', 'open') // Only update if currently open

      if (updateError) throw updateError
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-ticket', variables.ticketId] })
    },
  })
}

// ============================================================================
// Update Ticket Status Mutation
// ============================================================================

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
      assignedTo,
    }: {
      ticketId: string
      status?: 'open' | 'in_progress' | 'closed'
      assignedTo?: string | null
    }) => {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (status) {
        updates.status = status
        if (status === 'closed') {
          updates.resolved_at = new Date().toISOString()
        }
      }

      if (assignedTo !== undefined) {
        updates.assigned_to = assignedTo
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'support-ticket', variables.ticketId] })
    },
  })
}

// ============================================================================
// Support Stats Hook
// ============================================================================

export interface SupportStats {
  openTickets: number
  inProgressTickets: number
  closedTickets: number
  avgResponseTime: string
}

export function useSupportStats() {
  return useQuery({
    queryKey: ['admin', 'support-stats'],
    queryFn: async (): Promise<SupportStats> => {
      const { data: tickets, error } = await supabase
        .from('support_tickets')
        .select('status')

      if (error) throw error

      let openTickets = 0
      let inProgressTickets = 0
      let closedTickets = 0

      for (const ticket of tickets || []) {
        switch (ticket.status) {
          case 'open':
            openTickets += 1
            break
          case 'in_progress':
            inProgressTickets += 1
            break
          case 'closed':
            closedTickets += 1
            break
        }
      }

      return {
        openTickets,
        inProgressTickets,
        closedTickets,
        avgResponseTime: 'N/A', // Would need message timestamps to calculate
      }
    },
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
