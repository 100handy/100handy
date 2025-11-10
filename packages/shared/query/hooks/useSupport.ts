import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSupportTickets,
  getSupportTicket,
  getTicketMessages,
  createSupportTicket,
  sendMessage,
  CreateTicketInput,
  SendMessageInput,
  SupportTicket,
  SupportMessage,
} from '../../supabase/support';

// Query keys
export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...supportKeys.all, 'ticket', id] as const,
  messages: (ticketId: string) => [...supportKeys.all, 'messages', ticketId] as const,
};

/**
 * Hook to fetch all support tickets
 */
export function useSupportTickets() {
  return useQuery({
    queryKey: supportKeys.tickets(),
    queryFn: getSupportTickets,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single support ticket
 */
export function useSupportTicket(ticketId: string) {
  return useQuery({
    queryKey: supportKeys.ticket(ticketId),
    queryFn: () => getSupportTicket(ticketId),
    enabled: !!ticketId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch messages for a ticket
 */
export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: supportKeys.messages(ticketId),
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
}

/**
 * Mutation hook to create a new support ticket
 */
export function useCreateSupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => createSupportTicket(input),
    onSuccess: (newTicket) => {
      // Invalidate tickets list to refetch
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });

      // Optionally add the new ticket to cache
      queryClient.setQueryData(supportKeys.ticket(newTicket.id), newTicket);
    },
  });
}

/**
 * Mutation hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendMessageInput) => sendMessage(input),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: supportKeys.messages(newMessage.ticket_id) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<SupportMessage[]>(
        supportKeys.messages(newMessage.ticket_id)
      );

      // Optimistically update to the new value
      queryClient.setQueryData<SupportMessage[]>(
        supportKeys.messages(newMessage.ticket_id),
        (old) => {
          if (!old) return old;

          // Create optimistic message
          const optimisticMessage: SupportMessage = {
            id: `temp-${Date.now()}`,
            ticket_id: newMessage.ticket_id,
            from_user: true,
            message: newMessage.message,
            message_type: newMessage.message_type || 'text',
            attachment_url: null,
            attachment_name: null,
            attachment_size: null,
            read_at: null,
            metadata: newMessage.metadata || {},
            created_at: new Date().toISOString(),
          };

          return [...old, optimisticMessage];
        }
      );

      // Return context with previous value
      return { previousMessages, ticketId: newMessage.ticket_id };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          supportKeys.messages(context.ticketId),
          context.previousMessages
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: supportKeys.messages(variables.ticket_id) });

      // Also invalidate tickets to update last_message_at
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(variables.ticket_id) });
    },
  });
}

/**
 * Helper to invalidate all support queries
 */
export function useInvalidateSupport() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: supportKeys.all }),
    invalidateTickets: () => queryClient.invalidateQueries({ queryKey: supportKeys.tickets() }),
    invalidateTicket: (ticketId: string) =>
      queryClient.invalidateQueries({ queryKey: supportKeys.ticket(ticketId) }),
    invalidateMessages: (ticketId: string) =>
      queryClient.invalidateQueries({ queryKey: supportKeys.messages(ticketId) }),
  };
}
