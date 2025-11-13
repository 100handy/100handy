import { create } from 'zustand';
import {
  SupportTicket,
  SupportMessage,
  getSupportTickets,
  getSupportTicket,
  getTicketMessages,
  sendMessage,
  createSupportTicket,
  markAllMessagesAsRead,
  subscribeToTicketMessages,
  unsubscribeFromChannel,
  closeTicket,
  reopenTicket,
  SendMessageInput,
  CreateTicketInput,
} from '../supabase/support';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SupportState {
  // Data
  tickets: SupportTicket[];
  activeTicket: SupportTicket | null;
  messages: SupportMessage[];
  realtimeChannel: RealtimeChannel | null;

  // Loading states
  isLoadingTickets: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  isCreatingTicket: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchTickets: () => Promise<void>;
  createTicket: (input: CreateTicketInput) => Promise<SupportTicket>;
  openTicket: (ticketId: string) => Promise<void>;
  closeActiveTicket: () => void;
  sendTicketMessage: (input: Omit<SendMessageInput, 'ticket_id'>) => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  addMessage: (message: SupportMessage) => void;
  closeCurrentTicket: () => Promise<void>;
  reopenCurrentTicket: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  // Initial state
  tickets: [],
  activeTicket: null,
  messages: [],
  realtimeChannel: null,

  isLoadingTickets: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  isCreatingTicket: false,

  error: null,

  // Fetch all tickets for the user
  fetchTickets: async () => {
    try {
      set({ isLoadingTickets: true, error: null });

      const tickets = await getSupportTickets();
      set({ tickets, isLoadingTickets: false });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tickets',
        isLoadingTickets: false,
      });
    }
  },

  // Create a new ticket
  createTicket: async (input: CreateTicketInput) => {
    try {
      set({ isCreatingTicket: true, error: null });

      const ticket = await createSupportTicket(input);

      // Add to tickets list
      set(state => ({
        tickets: [ticket, ...state.tickets],
        isCreatingTicket: false,
      }));

      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create ticket',
        isCreatingTicket: false,
      });
      throw error;
    }
  },

  // Open a ticket and fetch its messages
  openTicket: async (ticketId: string) => {
    try {
      set({ isLoadingMessages: true, error: null });

      // Unsubscribe from previous channel if exists
      const { realtimeChannel } = get();
      if (realtimeChannel) {
        await unsubscribeFromChannel(realtimeChannel);
      }

      // Fetch ticket and messages
      const [ticket, messages] = await Promise.all([
        getSupportTicket(ticketId),
        getTicketMessages(ticketId),
      ]);

      set({
        activeTicket: ticket,
        messages,
        isLoadingMessages: false,
      });

      // Subscribe to new messages
      get().subscribeToMessages();

      // Mark messages as read
      await markAllMessagesAsRead(ticketId);
    } catch (error) {
      console.error('Error opening ticket:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to open ticket',
        isLoadingMessages: false,
      });
    }
  },

  // Close the active ticket (clear state)
  closeActiveTicket: () => {
    const { realtimeChannel } = get();

    if (realtimeChannel) {
      unsubscribeFromChannel(realtimeChannel);
    }

    set({
      activeTicket: null,
      messages: [],
      realtimeChannel: null,
    });
  },

  // Send a message in the active ticket
  sendTicketMessage: async (input: Omit<SendMessageInput, 'ticket_id'>) => {
    const { activeTicket } = get();

    if (!activeTicket) {
      console.error('No active ticket found');
      set({ error: 'No active ticket' });
      throw new Error('No active ticket');
    }

    try {
      console.log('Sending message for ticket:', activeTicket.id, 'input:', input);
      set({ isSendingMessage: true, error: null });

      const message = await sendMessage({
        ...input,
        ticket_id: activeTicket.id,
      });

      console.log('Message sent successfully:', message.id);

      // Add message to list
      set(state => ({
        messages: [...state.messages, message],
        isSendingMessage: false,
      }));
    } catch (error) {
      console.error('Error sending message in store:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        isSendingMessage: false,
      });
      throw error;
    }
  },

  // Mark all messages as read
  markMessagesAsRead: async () => {
    const { activeTicket } = get();

    if (!activeTicket) return;

    try {
      await markAllMessagesAsRead(activeTicket.id);

      // Update local state
      set(state => ({
        messages: state.messages.map(msg => ({
          ...msg,
          read_at: msg.from_user ? msg.read_at : new Date().toISOString(),
        })),
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages: () => {
    const { activeTicket } = get();

    if (!activeTicket) return;

    const channel = subscribeToTicketMessages(activeTicket.id, (newMessage) => {
      // Only add if it's not from the current user (to avoid duplicates)
      if (!newMessage.from_user) {
        get().addMessage(newMessage);
      }
    });

    set({ realtimeChannel: channel });
  },

  // Unsubscribe from real-time messages
  unsubscribeFromMessages: () => {
    const { realtimeChannel } = get();

    if (realtimeChannel) {
      unsubscribeFromChannel(realtimeChannel);
      set({ realtimeChannel: null });
    }
  },

  // Add a message to the list (from real-time subscription)
  addMessage: (message: SupportMessage) => {
    set(state => {
      // Check if message already exists
      const exists = state.messages.some(msg => msg.id === message.id);
      if (exists) return state;

      return {
        messages: [...state.messages, message],
      };
    });
  },

  // Close the current ticket
  closeCurrentTicket: async () => {
    const { activeTicket } = get();

    if (!activeTicket) {
      set({ error: 'No active ticket' });
      return;
    }

    try {
      await closeTicket(activeTicket.id);

      // Update local state
      set(state => ({
        activeTicket: state.activeTicket
          ? { ...state.activeTicket, status: 'closed', resolved_at: new Date().toISOString() }
          : null,
        tickets: state.tickets.map(ticket =>
          ticket.id === activeTicket.id
            ? { ...ticket, status: 'closed', resolved_at: new Date().toISOString() }
            : ticket
        ),
      }));
    } catch (error) {
      console.error('Error closing ticket:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to close ticket',
      });
    }
  },

  // Reopen the current ticket
  reopenCurrentTicket: async () => {
    const { activeTicket } = get();

    if (!activeTicket) {
      set({ error: 'No active ticket' });
      return;
    }

    try {
      await reopenTicket(activeTicket.id);

      // Update local state
      set(state => ({
        activeTicket: state.activeTicket
          ? { ...state.activeTicket, status: 'open', resolved_at: null }
          : null,
        tickets: state.tickets.map(ticket =>
          ticket.id === activeTicket.id
            ? { ...ticket, status: 'open', resolved_at: null }
            : ticket
        ),
      }));
    } catch (error) {
      console.error('Error reopening ticket:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to reopen ticket',
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset all state
  reset: () => {
    const { realtimeChannel } = get();

    if (realtimeChannel) {
      unsubscribeFromChannel(realtimeChannel);
    }

    set({
      tickets: [],
      activeTicket: null,
      messages: [],
      realtimeChannel: null,
      isLoadingTickets: false,
      isLoadingMessages: false,
      isSendingMessage: false,
      isCreatingTicket: false,
      error: null,
    });
  },
}));
