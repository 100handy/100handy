import { create } from 'zustand';
import { getUserProfile, updateUserProfile, updateUserAvatar, deleteUserAvatar, UserProfile, UpdateProfileData } from '../supabase/profile';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: UpdateProfileData) => Promise<boolean>;
  uploadAvatar: (imageUri: string) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const profile = await getUserProfile();
      
      if (profile) {
        set({ profile, isLoading: false });
      } else {
        set({ error: 'Failed to fetch profile', isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  updateProfile: async (updates: UpdateProfileData) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedProfile = await updateUserProfile(updates);
      
      if (updatedProfile) {
        set({ profile: updatedProfile, isLoading: false });
        return true;
      } else {
        set({ error: 'Failed to update profile', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
      return false;
    }
  },

  uploadAvatar: async (imageUri: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const imageUrl = await updateUserAvatar(imageUri);
      
      if (imageUrl) {
        // Refresh profile to get updated data
        await get().fetchProfile();
        return true;
      } else {
        set({ error: 'Failed to upload avatar', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload avatar', 
        isLoading: false 
      });
      return false;
    }
  },

  removeAvatar: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const success = await deleteUserAvatar();
      
      if (success) {
        // Refresh profile to get updated data
        await get().fetchProfile();
        return true;
      } else {
        set({ error: 'Failed to remove avatar', isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove avatar', 
        isLoading: false 
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ profile: null, isLoading: false, error: null });
  }
}));