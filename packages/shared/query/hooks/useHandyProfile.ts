import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHandyProfileExtras,
  updateHandyTools,
  updateHandyVehicles,
  updateHandyQuickFacts,
  updateHandyAboutMe,
  updateHandySyncCalendars,
  type HandyProfileExtras,
} from '../../supabase/profile';

// Query keys
export const handyProfileKeys = {
  all: ['handyProfile'] as const,
  extras: () => [...handyProfileKeys.all, 'extras'] as const,
};

// Hook for fetching handy profile extras (tools, vehicles, quick facts, about me)
export function useHandyProfileExtras() {
  return useQuery({
    queryKey: handyProfileKeys.extras(),
    queryFn: getHandyProfileExtras,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for updating tools
export function useUpdateHandyTools() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tools: string[]) => updateHandyTools(tools),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
    onError: (error) => {
      console.error('Error updating tools:', error);
    },
  });
}

// Hook for updating vehicles
export function useUpdateHandyVehicles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicles: string[]) => updateHandyVehicles(vehicles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
    onError: (error) => {
      console.error('Error updating vehicles:', error);
    },
  });
}

// Hook for updating quick facts
export function useUpdateHandyQuickFacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quickFacts: string[]) => updateHandyQuickFacts(quickFacts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
    onError: (error) => {
      console.error('Error updating quick facts:', error);
    },
  });
}

// Hook for updating about me
export function useUpdateHandyAboutMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (aboutMe: string) => updateHandyAboutMe(aboutMe),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
    onError: (error) => {
      console.error('Error updating about me:', error);
    },
  });
}

// Hook for updating sync calendars setting
export function useUpdateHandySyncCalendars() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (syncCalendars: boolean) => updateHandySyncCalendars(syncCalendars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
    onError: (error) => {
      console.error('Error updating sync calendars:', error);
    },
  });
}

// Utility hook for invalidating handy profile queries
export function useInvalidateHandyProfile() {
  const queryClient = useQueryClient();

  return {
    invalidateHandyProfile: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.all });
    },
    invalidateExtras: () => {
      queryClient.invalidateQueries({ queryKey: handyProfileKeys.extras() });
    },
  };
}

// Re-export types
export type { HandyProfileExtras };
