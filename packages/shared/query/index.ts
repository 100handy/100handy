// Query client configuration
export { createQueryClient, queryClient } from './queryClient';

// Category hooks and utilities
export {
  useCategories,
  useCategoriesByNames,
  getCategories,
  getCategoriesByNames,
  categoryKeys,
  type Category,
} from './hooks/useCategories';

// Booking hooks and utilities
export {
  useUpcomingBookings,
  usePastBookings,
  useCancelledBookings,
  useBookingById,
  useUserBookings,
  useInvalidateBookings,
  bookingKeys,
} from './hooks/useBookings';