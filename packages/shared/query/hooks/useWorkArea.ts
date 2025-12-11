// packages/shared/query/hooks/useWorkArea.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWorkArea,
  getWorkAreaByUserId,
  saveWorkArea,
  deleteWorkArea,
  type WorkArea,
  type SaveWorkAreaInput,
  type Coordinate,
} from '../../supabase/work-area';

// Query keys
export const workAreaKeys = {
  all: ['workArea'] as const,
  detail: () => [...workAreaKeys.all, 'detail'] as const,
  byUser: (userId: string) => [...workAreaKeys.all, 'user', userId] as const,
};

/**
 * Hook for fetching current tasker's work area
 */
export function useWorkArea() {
  return useQuery({
    queryKey: workAreaKeys.detail(),
    queryFn: getWorkArea,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a specific tasker's work area (for clients)
 */
export function useWorkAreaByUserId(userId: string | null) {
  return useQuery({
    queryKey: workAreaKeys.byUser(userId!),
    queryFn: () => getWorkAreaByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for saving work area
 */
export function useSaveWorkArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWorkAreaInput) => saveWorkArea(input),
    onSuccess: (data) => {
      // Update the cache with the new work area data
      queryClient.setQueryData(workAreaKeys.detail(), data);
    },
    onError: (error) => {
      console.error('Error saving work area:', error);
    },
  });
}

/**
 * Hook for deleting work area
 */
export function useDeleteWorkArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkArea,
    onSuccess: () => {
      // Remove work area from cache
      queryClient.setQueryData(workAreaKeys.detail(), null);
      queryClient.invalidateQueries({ queryKey: workAreaKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting work area:', error);
    },
  });
}

/**
 * Utility hook for invalidating work area queries
 */
export function useInvalidateWorkArea() {
  const queryClient = useQueryClient();

  return {
    invalidateWorkArea: () => {
      queryClient.invalidateQueries({ queryKey: workAreaKeys.all });
    },
  };
}

// Re-export types for convenience
export type { WorkArea, Coordinate, SaveWorkAreaInput };
