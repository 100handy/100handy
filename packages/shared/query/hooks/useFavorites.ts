import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteHandymen,
  addFavorite,
  removeFavorite,
  isFavorite,
} from '../../supabase/favorites';

// Query keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (customerId: string) => [...favoriteKeys.lists(), customerId] as const,
  check: (customerId: string, handyId: string) => [...favoriteKeys.all, 'check', customerId, handyId] as const,
};

/**
 * Hook to get all favorite handymen for a customer
 */
export function useFavoriteHandymen(customerId: string) {
  return useQuery({
    queryKey: favoriteKeys.list(customerId),
    queryFn: () => getFavoriteHandymen(customerId),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to check if a handyman is a favorite
 */
export function useIsFavorite(customerId: string, handyId: string) {
  return useQuery({
    queryKey: favoriteKeys.check(customerId, handyId),
    queryFn: () => isFavorite(customerId, handyId),
    enabled: !!customerId && !!handyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Mutation hook to add a handyman to favorites
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, handyId }: { customerId: string; handyId: string }) =>
      addFavorite(customerId, handyId),
    onSuccess: (_, variables) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.list(variables.customerId)
      });
      // Invalidate specific favorite check
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(variables.customerId, variables.handyId)
      });
    },
    onError: (error) => {
      console.error('Error adding favorite:', error);
    },
  });
}

/**
 * Mutation hook to remove a handyman from favorites
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, handyId }: { customerId: string; handyId: string }) =>
      removeFavorite(customerId, handyId),
    onSuccess: (_, variables) => {
      // Invalidate favorites list
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.list(variables.customerId)
      });
      // Invalidate specific favorite check
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(variables.customerId, variables.handyId)
      });
    },
    onError: (error) => {
      console.error('Error removing favorite:', error);
    },
  });
}

/**
 * Utility hook for invalidating favorite queries
 */
export function useInvalidateFavorites() {
  const queryClient = useQueryClient();

  return {
    invalidateFavorites: (customerId: string) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list(customerId) });
    },
    invalidateFavoriteCheck: (customerId: string, handyId: string) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.check(customerId, handyId) });
    },
    invalidateAllFavorites: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  };
}
