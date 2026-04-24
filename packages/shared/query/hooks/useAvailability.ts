// packages/shared/query/hooks/useAvailability.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAvailability,
  getWeeklyAvailability,
  getAvailabilityByUserId,
  getAvailabilityByUserIds,
  createAvailabilitySlot,
  replaceAvailabilitySlots,
  saveDayAvailability,
  saveWeeklyAvailability,
  deleteAvailabilitySlot,
  clearAllAvailability,
  type AvailabilitySlot,
  type CreateAvailabilityInput,
  type DayAvailabilityInput,
  type ReplaceAvailabilitySlotsInput,
  type RecurrenceType,
  type TimeSlotInput,
  type WeeklyAvailability,
  doesAvailabilitySlotApplyToDate,
} from '../../supabase/availability';

// Query keys
export const availabilityKeys = {
  all: ['availability'] as const,
  list: () => [...availabilityKeys.all, 'list'] as const,
  weekly: () => [...availabilityKeys.all, 'weekly'] as const,
  byUser: (userId: string) => [...availabilityKeys.all, 'user', userId] as const,
  byUsers: (userIds: string[]) => [...availabilityKeys.all, 'users', userIds.sort().join(',')] as const,
};

/**
 * Hook for fetching current tasker's availability as flat list
 */
export function useAvailability() {
  return useQuery({
    queryKey: availabilityKeys.list(),
    queryFn: getAvailability,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching current tasker's availability grouped by day
 */
export function useWeeklyAvailability() {
  return useQuery({
    queryKey: availabilityKeys.weekly(),
    queryFn: getWeeklyAvailability,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching a specific tasker's availability (for client booking)
 */
export function useAvailabilityByUserId(userId: string | null) {
  return useQuery({
    queryKey: availabilityKeys.byUser(userId!),
    queryFn: () => getAvailabilityByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching availability for multiple taskers in a single query (batch)
 * This is more efficient than calling useAvailabilityByUserId for each user
 */
export function useAvailabilityByUserIds(userIds: string[]) {
  return useQuery({
    queryKey: availabilityKeys.byUsers(userIds),
    queryFn: () => getAvailabilityByUserIds(userIds),
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for saving availability for a specific day
 */
export function useSaveDayAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DayAvailabilityInput) => saveDayAvailability(input),
    onSuccess: () => {
      // Invalidate all availability queries to refetch
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error saving day availability:', error);
    },
  });
}

export function useCreateAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAvailabilityInput) => createAvailabilitySlot(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error creating availability slot:', error);
    },
  });
}

export function useReplaceAvailabilitySlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReplaceAvailabilitySlotsInput) => replaceAvailabilitySlots(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error replacing availability slots:', error);
    },
  });
}

/**
 * Hook for saving entire week's availability
 */
export function useSaveWeeklyAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weekData: { [dayIndex: number]: TimeSlotInput[] }) =>
      saveWeeklyAvailability(weekData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error saving weekly availability:', error);
    },
  });
}

/**
 * Hook for deleting a single availability slot
 */
export function useDeleteAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => deleteAvailabilitySlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting availability slot:', error);
    },
  });
}

/**
 * Hook for clearing all availability
 */
export function useClearAllAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAllAvailability,
    onSuccess: () => {
      queryClient.setQueryData(availabilityKeys.list(), []);
      queryClient.setQueryData(availabilityKeys.weekly(), {});
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
    onError: (error) => {
      console.error('Error clearing availability:', error);
    },
  });
}

/**
 * Utility hook for invalidating availability queries
 */
export function useInvalidateAvailability() {
  const queryClient = useQueryClient();

  return {
    invalidateAvailability: () => {
      queryClient.invalidateQueries({ queryKey: availabilityKeys.all });
    },
  };
}

// Re-export types for convenience
export type {
  AvailabilitySlot,
  CreateAvailabilityInput,
  DayAvailabilityInput,
  ReplaceAvailabilitySlotsInput,
  RecurrenceType,
  TimeSlotInput,
  WeeklyAvailability,
};

export { doesAvailabilitySlotApplyToDate };
