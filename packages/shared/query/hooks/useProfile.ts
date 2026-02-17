import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  deleteUserAvatar,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPrivacySettings,
  updatePrivacySettings,
  deleteUserAccount,
  type UserProfile,
  type UpdateProfileData,
  type NotificationPreferences,
  type UpdateNotificationPreferencesData,
  type PrivacySettings,
  type UpdatePrivacySettingsData
} from '../../supabase/profile';

// Query keys
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
  notificationPreferences: () => [...profileKeys.all, 'notifications'] as const,
  privacySettings: () => [...profileKeys.all, 'privacy'] as const,
};

// Hook for fetching user profile
export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getUserProfile,
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000, // 2 minutes
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

// Hook for fetching notification preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: profileKeys.notificationPreferences(),
    queryFn: getNotificationPreferences,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for updating notification preferences
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateNotificationPreferencesData) =>
      updateNotificationPreferences(updates),
    onSuccess: () => {
      // Invalidate notification preferences query to refetch updated data
      queryClient.invalidateQueries({ queryKey: profileKeys.notificationPreferences() });
      // Also invalidate main profile since it contains notification fields
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
    onError: (error) => {
      console.error('Error updating notification preferences:', error);
    },
  });
}

// Hook for fetching privacy settings
export function usePrivacySettings() {
  return useQuery({
    queryKey: profileKeys.privacySettings(),
    queryFn: getPrivacySettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for updating privacy settings
export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdatePrivacySettingsData) =>
      updatePrivacySettings(updates),
    onSuccess: () => {
      // Invalidate privacy settings query to refetch updated data
      queryClient.invalidateQueries({ queryKey: profileKeys.privacySettings() });
      // Also invalidate main profile since it contains privacy fields
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
    onError: (error) => {
      console.error('Error updating privacy settings:', error);
    },
  });
}

// Hook for deleting user account
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      // Clear all profile-related cache
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Error deleting account:', error);
    },
  });
}
