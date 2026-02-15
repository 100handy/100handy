import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUpcomingBookings,
  getPastBookings,
  getCancelledBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  // Professional booking functions
  getPendingBookingsForHandy,
  getUpcomingBookingsForHandy,
  getCompletedBookingsForHandy,
  acceptBooking,
  declineBooking,
  startBooking,
  completeBooking,
  type BookingWithRelations,
  type BookingWithCustomer,
  type CreateBookingInput
} from '../../supabase/bookings';

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: { userId: string; status: string }) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  upcoming: (userId: string) => [...bookingKeys.lists(), { userId, status: 'upcoming' }] as const,
  past: (userId: string) => [...bookingKeys.lists(), { userId, status: 'past' }] as const,
  cancelled: (userId: string) => [...bookingKeys.lists(), { userId, status: 'cancelled' }] as const,
  // Professional (handy) query keys
  handyPending: (handyId: string) => [...bookingKeys.lists(), { handyId, status: 'pending' }] as const,
  handyUpcoming: (handyId: string) => [...bookingKeys.lists(), { handyId, status: 'upcoming' }] as const,
  handyCompleted: (handyId: string) => [...bookingKeys.lists(), { handyId, status: 'completed' }] as const,
};

// Hook for upcoming bookings
export function useUpcomingBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.upcoming(userId),
    queryFn: () => getUpcomingBookings(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for past bookings
export function usePastBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.past(userId),
    queryFn: () => getPastBookings(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for cancelled bookings
export function useCancelledBookings(userId: string) {
  return useQuery({
    queryKey: bookingKeys.cancelled(userId),
    queryFn: () => getCancelledBookings(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for individual booking details
export function useBookingById(bookingId: string | null) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId!),
    queryFn: () => getBookingById(bookingId!),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for all user bookings (combined)
export function useUserBookings(userId: string) {
  const upcomingQuery = useUpcomingBookings(userId);
  const pastQuery = usePastBookings(userId);
  const cancelledQuery = useCancelledBookings(userId);

  return {
    upcoming: upcomingQuery.data || [],
    past: pastQuery.data || [],
    cancelled: cancelledQuery.data || [],
    isLoading: upcomingQuery.isLoading || pastQuery.isLoading || cancelledQuery.isLoading,
    isError: upcomingQuery.isError || pastQuery.isError || cancelledQuery.isError,
    error: upcomingQuery.error || pastQuery.error || cancelledQuery.error,
    refetch: () => {
      upcomingQuery.refetch();
      pastQuery.refetch();
      cancelledQuery.refetch();
    }
  };
}

// Utility hook for invalidating booking queries
export function useInvalidateBookings() {
  const queryClient = useQueryClient();

  return {
    invalidateUserBookings: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
    invalidateBooking: (bookingId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
    },
    invalidateAllBookings: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    }
  };
}

// Mutation hook for creating bookings
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      // Invalidate and refetch booking queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
    },
  });
}

// Mutation hook for cancelling bookings
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: (success, bookingId) => {
      if (success) {
        // Invalidate booking detail query
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
        // Invalidate all booking lists
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      }
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
    },
  });
}

// ==========================================
// Professional (Handy) Booking Hooks
// ==========================================

// Hook for pending job requests for professionals
export function usePendingBookingsForHandy(handyId: string) {
  return useQuery({
    queryKey: bookingKeys.handyPending(handyId),
    queryFn: () => getPendingBookingsForHandy(handyId),
    enabled: !!handyId,
    staleTime: 1 * 60 * 1000, // 1 minute - pending requests need fresher data
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for upcoming (accepted/in-progress) jobs for professionals
export function useUpcomingBookingsForHandy(handyId: string) {
  return useQuery({
    queryKey: bookingKeys.handyUpcoming(handyId),
    queryFn: () => getUpcomingBookingsForHandy(handyId),
    enabled: !!handyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for completed jobs for professionals
export function useCompletedBookingsForHandy(handyId: string) {
  return useQuery({
    queryKey: bookingKeys.handyCompleted(handyId),
    queryFn: () => getCompletedBookingsForHandy(handyId),
    enabled: !!handyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for all professional bookings (combined)
export function useHandyBookings(handyId: string) {
  const pendingQuery = usePendingBookingsForHandy(handyId);
  const upcomingQuery = useUpcomingBookingsForHandy(handyId);
  const completedQuery = useCompletedBookingsForHandy(handyId);

  return {
    pending: pendingQuery.data || [],
    upcoming: upcomingQuery.data || [],
    completed: completedQuery.data || [],
    isLoading: pendingQuery.isLoading || upcomingQuery.isLoading || completedQuery.isLoading,
    isError: pendingQuery.isError || upcomingQuery.isError || completedQuery.isError,
    error: pendingQuery.error || upcomingQuery.error || completedQuery.error,
    refetch: () => {
      pendingQuery.refetch();
      upcomingQuery.refetch();
      completedQuery.refetch();
    },
    pendingCount: pendingQuery.data?.length || 0,
  };
}

// Mutation hook for accepting a booking
export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => acceptBooking(bookingId),
    onSuccess: (success, bookingId) => {
      if (success) {
        // Invalidate all booking lists to refresh data
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      }
    },
    onError: (error) => {
      console.error('Error accepting booking:', error);
    },
  });
}

// Mutation hook for declining a booking
export function useDeclineBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      declineBooking(bookingId, reason),
    onSuccess: (success, { bookingId }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      }
    },
    onError: (error) => {
      console.error('Error declining booking:', error);
    },
  });
}

// Mutation hook for starting a job
export function useStartBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => startBooking(bookingId),
    onSuccess: (success, bookingId) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      }
    },
    onError: (error) => {
      console.error('Error starting booking:', error);
    },
  });
}

// Mutation hook for completing a job
export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      processPayment = true,
    }: {
      bookingId: string;
      processPayment?: boolean;
    }) => completeBooking(bookingId, { processPayment }),
    onSuccess: (result, { bookingId }) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      }
    },
    onError: (error) => {
      console.error('Error completing booking:', error);
    },
  });
}

// Mutation hook for retrying failed payment processing
export function useRetryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      paymentIntentId,
    }: {
      bookingId: string;
      paymentIntentId: string;
    }) => {
      const { retryPaymentProcessing } = await import('../../supabase/payments');
      return retryPaymentProcessing(bookingId, paymentIntentId, 3);
    },
    onSuccess: (result, { bookingId }) => {
      // Invalidate booking queries to refresh payment status
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
    onError: (error) => {
      console.error('Error retrying payment:', error);
    },
  });
}

// Utility hook for invalidating professional booking queries
export function useInvalidateHandyBookings() {
  const queryClient = useQueryClient();

  return {
    invalidatePending: (handyId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyPending(handyId) });
    },
    invalidateUpcoming: (handyId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyUpcoming(handyId) });
    },
    invalidateCompleted: (handyId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyCompleted(handyId) });
    },
    invalidateAll: (handyId: string) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyPending(handyId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyUpcoming(handyId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.handyCompleted(handyId) });
    },
  };
}
