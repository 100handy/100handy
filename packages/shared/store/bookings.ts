import { create } from 'zustand';
import { 
  BookingWithRelations, 
  BookingStatus,
  getUpcomingBookings, 
  getPastBookings, 
  getCancelledBookings,
  getBookingById 
} from '../supabase/bookings';

interface BookingsState {
  // Data
  upcomingBookings: BookingWithRelations[];
  pastBookings: BookingWithRelations[];
  cancelledBookings: BookingWithRelations[];
  selectedBooking: BookingWithRelations | null;
  
  // Loading states
  isLoadingUpcoming: boolean;
  isLoadingPast: boolean;
  isLoadingCancelled: boolean;
  isLoadingSelected: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchUpcomingBookings: (userId: string) => Promise<void>;
  fetchPastBookings: (userId: string) => Promise<void>;
  fetchCancelledBookings: (userId: string) => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  // Initial state
  upcomingBookings: [],
  pastBookings: [],
  cancelledBookings: [],
  selectedBooking: null,
  
  isLoadingUpcoming: false,
  isLoadingPast: false,
  isLoadingCancelled: false,
  isLoadingSelected: false,
  
  error: null,

  fetchUpcomingBookings: async (userId: string) => {
    try {
      set({ isLoadingUpcoming: true, error: null });
      
      const bookings = await getUpcomingBookings(userId);
      set({ upcomingBookings: bookings, isLoadingUpcoming: false });
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch upcoming bookings', 
        isLoadingUpcoming: false 
      });
    }
  },

  fetchPastBookings: async (userId: string) => {
    try {
      set({ isLoadingPast: true, error: null });
      
      const bookings = await getPastBookings(userId);
      set({ pastBookings: bookings, isLoadingPast: false });
    } catch (error) {
      console.error('Error fetching past bookings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch past bookings', 
        isLoadingPast: false 
      });
    }
  },

  fetchCancelledBookings: async (userId: string) => {
    try {
      set({ isLoadingCancelled: true, error: null });
      
      const bookings = await getCancelledBookings(userId);
      set({ cancelledBookings: bookings, isLoadingCancelled: false });
    } catch (error) {
      console.error('Error fetching cancelled bookings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch cancelled bookings', 
        isLoadingCancelled: false 
      });
    }
  },

  fetchBookingById: async (bookingId: string) => {
    try {
      set({ isLoadingSelected: true, error: null });
      
      const booking = await getBookingById(bookingId);
      set({ selectedBooking: booking, isLoadingSelected: false });
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch booking details', 
        isLoadingSelected: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      upcomingBookings: [],
      pastBookings: [],
      cancelledBookings: [],
      selectedBooking: null,
      isLoadingUpcoming: false,
      isLoadingPast: false,
      isLoadingCancelled: false,
      isLoadingSelected: false,
      error: null
    });
  }
}));
