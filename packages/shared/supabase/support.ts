import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Types
export type MessageType = 'text' | 'system' | 'interactive';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  resolved_at: string | null;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  from_user: boolean;
  message: string;
  message_type: MessageType;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SupportTicketWithMessages extends SupportTicket {
  messages: SupportMessage[];
}

export interface CreateTicketInput {
  subject?: string;
  message: string;
  priority?: TicketPriority;
}

export interface SendMessageInput {
  ticket_id: string;
  message: string;
  message_type?: MessageType;
  attachment?: File | { uri: string; name?: string; fileName?: string; size?: number; fileSize?: number; mimeType?: string; type?: string } | null;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new support ticket with an initial message
 */
export async function createSupportTicket(input: CreateTicketInput): Promise<SupportTicket> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // Create the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: input.subject || 'General Support',
        status: 'open',
        priority: input.priority || 'medium',
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating support ticket:', ticketError);
      throw new Error(ticketError.message);
    }

    // Create the initial message
    const { error: messageError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticket.id,
        from_user: true,
        message: input.message,
        message_type: 'text',
      });

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      throw new Error(messageError.message);
    }

    // Create a welcome system message
    await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticket.id,
        from_user: false,
        message: "👋 Hi! I'm 100Handy's virtual chat assistant and I'd like to help.\n\nPlease note: our Customer Support team is currently handling a high volume of inquiries resulting in a longer wait time. Your patience is greatly appreciated!\n\nOur live Support Team is currently offline and we'll be back online Monday to Friday, from 8:30 am - 6:30 pm GMT. In the meantime, our Virtual Chat Assistant is always here to help.",
        message_type: 'system',
      });

    return ticket;
  } catch (error) {
    console.error('Error in createSupportTicket:', error);
    throw error;
  }
}

/**
 * Get all support tickets for the current user
 */
export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSupportTickets:', error);
    throw error;
  }
}

/**
 * Get a single support ticket by ID
 */
export async function getSupportTicket(ticketId: string): Promise<SupportTicket | null> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching support ticket:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in getSupportTicket:', error);
    throw error;
  }
}

/**
 * Get all messages for a specific ticket
 */
export async function getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching ticket messages:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTicketMessages:', error);
    throw error;
  }
}

/**
 * Send a new message in a ticket
 */
export async function sendMessage(input: SendMessageInput): Promise<SupportMessage> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    let attachmentUrl = null;
    let attachmentName = null;
    let attachmentSize = null;

    // Handle file attachment if provided
    if (input.attachment) {
      const uploadResult = await uploadAttachment(user.id, input.ticket_id, input.attachment);
      attachmentUrl = uploadResult.url;
      attachmentName = uploadResult.name;
      attachmentSize = uploadResult.size;
    }

    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: input.ticket_id,
        from_user: true,
        message: input.message,
        message_type: input.message_type || 'text',
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        attachment_size: attachmentSize,
        metadata: input.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

/**
 * Upload an attachment to Supabase Storage
 * Supports both web File objects and React Native file objects from expo pickers
 */
export async function uploadAttachment(
  userId: string,
  ticketId: string,
  file: File | { uri: string; name?: string; fileName?: string; size?: number; fileSize?: number; mimeType?: string; type?: string }
): Promise<{ url: string; name: string; size: number }> {
  try {
    // Handle both web File objects and React Native file objects
    const isNativeFile = 'uri' in file;
    const fileName = file.name || (isNativeFile ? file.fileName : undefined) || `file_${Date.now()}`;
    const fileUri = isNativeFile ? file.uri : '';
    const fileSize = file.size || (isNativeFile ? file.fileSize : undefined) || 0;

    const fileExt = fileName.split('.').pop() || 'jpg';
    const uniqueFileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${ticketId}/${uniqueFileName}`;

    // For React Native, we need to use FormData
    const formData = new FormData();

    // Create the file object for FormData in React Native format
    const fileObject = {
      uri: fileUri,
      name: uniqueFileName,
      type: ('mimeType' in file ? file.mimeType : file.type) || 'image/jpeg',
    } as unknown as Blob;

    formData.append('file', fileObject);

    // Get the Supabase storage endpoint
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    // Get the project URL from supabase client
    const supabaseUrl = (supabase as unknown as { supabaseUrl?: string }).supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/support-attachments/${filePath}`;

    // Upload using fetch with FormData
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upload failed:', errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('support-attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: fileName,
      size: fileSize,
    };
  } catch (error) {
    console.error('Error in uploadAttachment:', error);
    throw error;
  }
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('support_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .is('read_at', null);

    if (error) {
      console.error('Error marking message as read:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    throw error;
  }
}

/**
 * Mark all messages in a ticket as read
 */
export async function markAllMessagesAsRead(ticketId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('support_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('ticket_id', ticketId)
      .eq('from_user', false)
      .is('read_at', null);

    if (error) {
      console.error('Error marking all messages as read:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in markAllMessagesAsRead:', error);
    throw error;
  }
}

/**
 * Subscribe to new messages in a ticket
 */
export function subscribeToTicketMessages(
  ticketId: string,
  onMessage: (message: SupportMessage) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`ticket:${ticketId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `ticket_id=eq.${ticketId}`,
      },
      (payload) => {
        onMessage(payload.new as SupportMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeFromChannel(channel: RealtimeChannel): Promise<void> {
  await supabase.removeChannel(channel);
}

/**
 * Close a support ticket
 */
export async function closeTicket(ticketId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: 'closed', resolved_at: new Date().toISOString() })
      .eq('id', ticketId);

    if (error) {
      console.error('Error closing ticket:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in closeTicket:', error);
    throw error;
  }
}

/**
 * Reopen a closed ticket
 */
export async function reopenTicket(ticketId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: 'open', resolved_at: null })
      .eq('id', ticketId);

    if (error) {
      console.error('Error reopening ticket:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in reopenTicket:', error);
    throw error;
  }
}

/**
 * Delete a support ticket and all its messages
 */
export async function deleteTicket(ticketId: string): Promise<void> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Not authenticated');
    }

    // First delete all messages associated with the ticket
    const { error: messagesError } = await supabase
      .from('support_messages')
      .delete()
      .eq('ticket_id', ticketId);

    if (messagesError) {
      console.error('Error deleting ticket messages:', messagesError);
      throw new Error(messagesError.message);
    }

    // Then delete the ticket itself
    const { error: ticketError } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', ticketId)
      .eq('user_id', user.id); // Ensure user can only delete their own tickets

    if (ticketError) {
      console.error('Error deleting ticket:', ticketError);
      throw new Error(ticketError.message);
    }
  } catch (error) {
    console.error('Error in deleteTicket:', error);
    throw error;
  }
}

/**
 * Request AI response for a support message
 * Calls the AI edge function to generate and save an AI response
 */
export async function requestAIResponse(
  ticketId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<SupportMessage | null> {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log('User session exists:', !!session);
    console.log('Requesting AI response for ticket:', ticketId);

    // Use Supabase's functions.invoke() which handles auth automatically
    const { data, error } = await supabase.functions.invoke('ai-support-response', {
      body: {
        ticket_id: ticketId,
        message: userMessage,
        conversation_history: conversationHistory,
      },
    });

    if (error) {
      console.error('AI response error details:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('AI response received:', data?.message?.id);
    return data?.message || null;
  } catch (error) {
    console.error('Error requesting AI response:', error);
    // Don't throw - AI response is optional
    return null;
  }
}
