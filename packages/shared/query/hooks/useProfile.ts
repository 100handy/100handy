import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  deleteUserAvatar,
  type UserProfile,
  type UpdateProfileData
} from '../../supabase/profile';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

// Hook for fetching user profile
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for updating profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateProfileData) => updateUserProfile(updates),
    onSuccess: (data) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(profileKeys.detail(), data);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
}

// Hook for uploading avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageUri: string) => updateUserAvatar(imageUri),
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
    onError: (error) => {
      console.error('Error uploading avatar:', error);
    },
  });
}

// Hook for deleting avatar
export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAvatar,
    onSuccess: () => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
    onError: (error) => {
      console.error('Error deleting avatar:', error);
    },
  });
}

// Utility hook for invalidating profile queries
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return {
    invalidateProfile: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  };
}
