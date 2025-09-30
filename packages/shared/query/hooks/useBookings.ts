import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getUpcomingBookings, 
  getPastBookings, 
  getCancelledBookings, 
  getBookingById,
  type BookingWithRelations 
} from '../../supabase/bookings';

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: { userId: string; status: string }) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookingKeys.details(), id] as const,
  upcoming: (userId: string) => [...bookingKeys.lists(), { userId, status: 'upcoming' }] as const,
  past: (userId: string) => [...bookingKeys.lists(), { userId, status: 'past' }] as const,
  cancelled: (userId: string) => [...bookingKeys.lists(), { userId, status: 'cancelled' }] as const,
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
export function useBookingById(bookingId: number | null) {
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
    invalidateBooking: (bookingId: number) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
    },
    invalidateAllBookings: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    }
  };
}
