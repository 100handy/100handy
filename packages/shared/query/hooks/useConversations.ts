import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getConversation,
  getConversationByBooking,
  getConversationMessages,
  sendConversationMessage,
  markMessagesAsRead,
  SendConversationMessageInput,
  Conversation,
  ConversationMessage,
  ConversationWithProfiles,
} from '../../supabase/conversations';
import { supabase } from '../../supabase/supabaseClient';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  list: () => [...conversationKeys.lists()] as const,
  conversation: (id: string) => [...conversationKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...conversationKeys.all, 'messages', conversationId] as const,
  byBooking: (bookingId: string) => [...conversationKeys.all, 'booking', bookingId] as const,
};

/**
 * Hook to fetch all conversations for the current user
 */
export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: getConversations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single conversation
 */
export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.conversation(conversationId),
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch or create conversation for a booking
 */
export function useConversationByBooking(bookingId: string) {
  return useQuery({
    queryKey: conversationKeys.byBooking(bookingId),
    queryFn: () => getConversationByBooking(bookingId),
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch messages for a conversation with real-time updates
 */
export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds as fallback
  });
}

/**
 * Mutation hook to send a conversation message
 */
export function useSendConversationMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendConversationMessageInput) => sendConversationMessage(input),
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: conversationKeys.messages(newMessage.conversation_id),
      });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<ConversationMessage[]>(
        conversationKeys.messages(newMessage.conversation_id)
      );

      // Get actual user ID for the optimistic message
      const { data: { user } } = await supabase.auth.getUser();

      // Optimistically update to the new value
      queryClient.setQueryData<ConversationMessage[]>(
        conversationKeys.messages(newMessage.conversation_id),
        (old) => {
          if (!old) return old;

          // Create optimistic message
          const optimisticMessage: ConversationMessage = {
            id: `temp-${Date.now()}`,
            conversation_id: newMessage.conversation_id,
            sender_id: user?.id || '',
            message: newMessage.message,
            message_type: newMessage.message_type || 'text',
            attachment_url: newMessage.attachment_url || null,
            booking_id: newMessage.booking_id || null,
            read_at: null,
            created_at: new Date().toISOString(),
          };

          return [...old, optimisticMessage];
        }
      );

      // Return context with previous value
      return { previousMessages, conversationId: newMessage.conversation_id };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          conversationKeys.messages(context.conversationId),
          context.previousMessages
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(variables.conversation_id),
      });

      // Also invalidate conversations list to update last_message_at
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.conversation(variables.conversation_id),
      });
    },
  });
}

/**
 * Mutation hook to mark messages as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markMessagesAsRead(conversationId),
    onSuccess: (data, conversationId) => {
      // Invalidate messages to update read_at
      queryClient.invalidateQueries({
        queryKey: conversationKeys.messages(conversationId),
      });

      // Invalidate conversations to update unread counts
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.conversation(conversationId),
      });
    },
  });
}

/**
 * Helper to invalidate all conversation queries
 */
export function useInvalidateConversations() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
    invalidateList: () => queryClient.invalidateQueries({ queryKey: conversationKeys.list() }),
    invalidateConversation: (conversationId: string) =>
      queryClient.invalidateQueries({ queryKey: conversationKeys.conversation(conversationId) }),
    invalidateMessages: (conversationId: string) =>
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) }),
  };
}
