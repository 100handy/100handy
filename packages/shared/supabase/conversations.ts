import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types
export interface Conversation {
  id: string;
  client_id: string;
  tasker_id: string;
  last_message_at: string;
  client_unread_count: number;
  tasker_unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'system' | 'image';
  attachment_url: string | null;
  booking_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface ConversationWithProfiles extends Conversation {
  client: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  tasker: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface SendConversationMessageInput {
  conversation_id: string;
  message: string;
  message_type?: 'text' | 'system' | 'image';
  attachment_url?: string;
  booking_id?: string;
}

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<ConversationWithProfiles[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Fetch conversations
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .or(`client_id.eq.${user.id},tasker_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      throw new Error(conversationsError.message);
    }

    if (!conversations || conversations.length === 0) {
      return [];
    }

    // Get unique user IDs for profile lookup
    const userIds = new Set<string>();
    conversations.forEach((conv: any) => {
      userIds.add(conv.client_id);
      userIds.add(conv.tasker_id);
    });

    // Fetch profiles for all users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, avatar_url')
      .in('user_id', Array.from(userIds));

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Continue without profiles rather than failing
    }

    // Create profile lookup map
    const profileMap = new Map();
    profiles?.forEach((profile: any) => {
      profileMap.set(profile.user_id, profile);
    });

    // Combine conversations with profiles
    const result = conversations.map((conv: any) => ({
      ...conv,
      client: profileMap.get(conv.client_id) || null,
      tasker: profileMap.get(conv.tasker_id) || null,
    }));

    return result as ConversationWithProfiles[];
  } catch (error) {
    console.error('Error in getConversations:', error);
    throw error;
  }
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(conversationId: string): Promise<ConversationWithProfiles | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Fetch conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .or(`client_id.eq.${user.id},tasker_id.eq.${user.id}`)
      .single();

    if (conversationError) {
      console.error('Error fetching conversation:', conversationError);
      throw new Error(conversationError.message);
    }

    if (!conversation) {
      return null;
    }

    // Fetch profiles for client and tasker
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, avatar_url')
      .in('user_id', [conversation.client_id, conversation.tasker_id]);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Continue without profiles
    }

    // Create profile lookup map
    const profileMap = new Map();
    profiles?.forEach((profile: any) => {
      profileMap.set(profile.user_id, profile);
    });

    // Combine conversation with profiles
    const result = {
      ...conversation,
      client: profileMap.get(conversation.client_id) || null,
      tasker: profileMap.get(conversation.tasker_id) || null,
    };

    return result as ConversationWithProfiles;
  } catch (error) {
    console.error('Error in getConversation:', error);
    throw error;
  }
}

/**
 * Get or create a conversation for a booking
 */
export async function getConversationByBooking(bookingId: string): Promise<Conversation> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Get booking details to find client and tasker
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('customer_id, handy_id, task_title')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Try to find existing conversation between this client and tasker
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('client_id', booking.customer_id)
      .eq('tasker_id', booking.handy_id)
      .single();

    if (existing && !fetchError) {
      return existing;
    }

    // If no conversation exists, create one
    const { data: conversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        client_id: booking.customer_id,
        tasker_id: booking.handy_id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      throw new Error(createError.message);
    }

    // Create welcome system message with booking context
    await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: booking.customer_id, // System message from client perspective
        message: `Your booking for "${booking.task_title}" has been confirmed! Start chatting with your tasker here.`,
        message_type: 'system',
        booking_id: bookingId,
      });

    return conversation;
  } catch (error) {
    console.error('Error in getConversationByBooking:', error);
    throw error;
  }
}

/**
 * Get all messages for a conversation
 */
export async function getConversationMessages(conversationId: string): Promise<ConversationMessage[]> {
  try {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation messages:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    throw error;
  }
}

/**
 * Send a new message in a conversation
 */
export async function sendConversationMessage(input: SendConversationMessageInput): Promise<ConversationMessage> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: input.conversation_id,
        sender_id: user.id,
        message: input.message,
        message_type: input.message_type || 'text',
        attachment_url: input.attachment_url || null,
        booking_id: input.booking_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in sendConversationMessage:', error);
    throw error;
  }
}

/**
 * Mark messages as read for the current user
 */
export async function markMessagesAsRead(conversationId: string): Promise<void> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Get conversation to determine if user is client or tasker
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('client_id, tasker_id')
      .eq('id', conversationId)
      .single();

    if (convError || !conversation) {
      throw new Error('Conversation not found');
    }

    // Mark all unread messages from the other party as read
    const { error } = await supabase
      .from('conversation_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw new Error(error.message);
    }

    // Reset unread count
    const isClient = conversation.client_id === user.id;
    const updateField = isClient ? 'client_unread_count' : 'tasker_unread_count';

    await supabase
      .from('conversations')
      .update({ [updateField]: 0 })
      .eq('id', conversationId);

  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    throw error;
  }
}

/**
 * Subscribe to new messages in a conversation
 */
export function subscribeToConversation(
  conversationId: string,
  onMessage: (message: ConversationMessage) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as ConversationMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a conversation channel
 */
export async function unsubscribeFromConversation(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}
