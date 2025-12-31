import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCustomerReview,
  createProfessionalReview,
  getReviewsForProfessional,
  getProfessionalRating,
  getClientReviewHistory,
  getClientRatingByProfessional,
  hasReviewedBooking,
  getReviewByBooking,
  getBookingsPendingReview,
  type Review,
  type ReviewWithBooking,
  type ReviewerType,
  type CreateReviewInput,
} from '../../supabase/reviews';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  professional: (handyId: string) => [...reviewKeys.all, 'professional', handyId] as const,
  professionalRating: (handyId: string) => [...reviewKeys.all, 'rating', handyId] as const,
  clientHistory: (customerId: string) => [...reviewKeys.all, 'client', customerId] as const,
  clientRating: (customerId: string) => [...reviewKeys.all, 'clientRating', customerId] as const,
  booking: (bookingId: string, reviewerType: ReviewerType) =>
    [...reviewKeys.all, 'booking', bookingId, reviewerType] as const,
  hasReviewed: (bookingId: string, reviewerType: ReviewerType) =>
    [...reviewKeys.all, 'hasReviewed', bookingId, reviewerType] as const,
  pendingReview: (reviewerType: ReviewerType) =>
    [...reviewKeys.all, 'pending', reviewerType] as const,
};

// ==========================================
// Query Hooks
// ==========================================

/**
 * Get reviews for a professional (public profile)
 */
export function useReviewsForProfessional(handyId: string, limit = 50) {
  return useQuery({
    queryKey: reviewKeys.professional(handyId),
    queryFn: () => getReviewsForProfessional(handyId, limit),
    enabled: !!handyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Get average rating for a professional
 */
export function useProfessionalRating(handyId: string) {
  return useQuery({
    queryKey: reviewKeys.professionalRating(handyId),
    queryFn: () => getProfessionalRating(handyId),
    enabled: !!handyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Get client review history (professional's private reviews of a client)
 */
export function useClientReviewHistory(customerId: string) {
  return useQuery({
    queryKey: reviewKeys.clientHistory(customerId),
    queryFn: () => getClientReviewHistory(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Get client rating by the current professional
 */
export function useClientRatingByProfessional(customerId: string) {
  return useQuery({
    queryKey: reviewKeys.clientRating(customerId),
    queryFn: () => getClientRatingByProfessional(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Check if user has reviewed a booking
 */
export function useHasReviewedBooking(bookingId: string, reviewerType: ReviewerType) {
  return useQuery({
    queryKey: reviewKeys.hasReviewed(bookingId, reviewerType),
    queryFn: () => hasReviewedBooking(bookingId, reviewerType),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Get review by booking ID
 */
export function useReviewByBooking(bookingId: string, reviewerType: ReviewerType) {
  return useQuery({
    queryKey: reviewKeys.booking(bookingId, reviewerType),
    queryFn: () => getReviewByBooking(bookingId, reviewerType),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Get bookings pending review
 */
export function useBookingsPendingReview(reviewerType: ReviewerType, limit = 10) {
  return useQuery({
    queryKey: reviewKeys.pendingReview(reviewerType),
    queryFn: () => getBookingsPendingReview(reviewerType, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}

// ==========================================
// Mutation Hooks
// ==========================================

/**
 * Create a customer review
 */
export function useCreateCustomerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => createCustomerReview(input),
    onSuccess: (review, input) => {
      if (review) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: reviewKeys.pendingReview('customer') });
        queryClient.invalidateQueries({
          queryKey: reviewKeys.hasReviewed(input.bookingId, 'customer'),
        });
        if (review.handy_id) {
          queryClient.invalidateQueries({ queryKey: reviewKeys.professional(review.handy_id) });
          queryClient.invalidateQueries({
            queryKey: reviewKeys.professionalRating(review.handy_id),
          });
        }
      }
    },
    onError: (error) => {
      console.error('Error creating customer review:', error);
    },
  });
}

/**
 * Create a professional review
 */
export function useCreateProfessionalReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => createProfessionalReview(input),
    onSuccess: (review, input) => {
      if (review) {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: reviewKeys.pendingReview('handy') });
        queryClient.invalidateQueries({
          queryKey: reviewKeys.hasReviewed(input.bookingId, 'handy'),
        });
        if (review.customer_id) {
          queryClient.invalidateQueries({ queryKey: reviewKeys.clientHistory(review.customer_id) });
          queryClient.invalidateQueries({
            queryKey: reviewKeys.clientRating(review.customer_id),
          });
        }
      }
    },
    onError: (error) => {
      console.error('Error creating professional review:', error);
    },
  });
}

// ==========================================
// Utility Hooks
// ==========================================

/**
 * Invalidate review queries
 */
export function useInvalidateReviews() {
  const queryClient = useQueryClient();

  return {
    invalidateProfessionalReviews: (handyId: string) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.professional(handyId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.professionalRating(handyId) });
    },
    invalidateClientHistory: (customerId: string) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.clientHistory(customerId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.clientRating(customerId) });
    },
    invalidatePendingReviews: (reviewerType: ReviewerType) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.pendingReview(reviewerType) });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  };
}

// Re-export types
export type { Review, ReviewWithBooking, ReviewerType, CreateReviewInput };
