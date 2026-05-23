import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { getSession } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';
import { queryClient } from '../query/queryClient';
import { deleteDevicePushToken } from '../supabase/pushTokens';

const PROFILE_ROLE_TIMEOUT_MS = 3500;
const PROFILE_ROLE_MAX_ATTEMPTS = 3;

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isRoleResolved: boolean;
  currentPushToken: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  hasCompletedOnboarding: boolean;
  userRole: 'customer' | 'handy' | null;
  authSubscription: { unsubscribe: () => void } | null;
  initialize: () => Promise<void>;
  cleanup: () => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setCurrentPushToken: (token: string | null) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateOnboardingStatus: (completed: boolean) => void;
}

/**
 * Fetch the authoritative role from the profiles table.
 * Falls back to null if the row is missing or the query fails.
 * This prevents a client from elevating their role by calling supabase.auth.updateUser().
 */
async function fetchProfileRole(userId: string): Promise<'customer' | 'handy' | null> {
  for (let attempt = 1; attempt <= PROFILE_ROLE_MAX_ATTEMPTS; attempt++) {
    try {
      const query = supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
      const { data } = await Promise.race([
        query,
        new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error('Timed out resolving profile role')),
            PROFILE_ROLE_TIMEOUT_MS
          );
        }),
      ]);
      const role = (data?.role as 'customer' | 'handy' | null) ?? null;
      if (role) {
        return role;
      }
    } catch {
      // fall through to retry
    }

    if (attempt < PROFILE_ROLE_MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }
  return null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isRoleResolved: false,
  currentPushToken: null,
  isAuthenticated: false,
  isEmailVerified: false,
  isPhoneVerified: false,
  hasCompletedOnboarding: false,
  userRole: null,
  authSubscription: null,

  initialize: async () => {
    try {
      // Clean up any existing subscription first
      const state = get();
      if (state.authSubscription) {
        state.authSubscription.unsubscribe();
      }

      set({ isLoading: true, isRoleResolved: false });

      // Set up auth listener FIRST to avoid missing events between getSession and listener setup
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        const user = session?.user;
        const metadata = user?.user_metadata;
        const fallbackRole = (metadata?.role as 'customer' | 'handy' | null | undefined) ?? null;

        // Set immediately with user_metadata role for fast initial render
        set({
          user: user || null,
          session,
          isAuthenticated: !!user,
          isEmailVerified: !!user?.email_confirmed_at,
          isPhoneVerified: !!user?.phone_confirmed_at,
          hasCompletedOnboarding: metadata?.onboarding_completed || false,
          userRole: fallbackRole,
          isRoleResolved: !user,
          isLoading: false
        });

        // Override with authoritative DB role to prevent client-side role elevation
        if (user?.id) {
          fetchProfileRole(user.id).then((dbRole) => {
            if (get().user?.id !== user.id) return;
            set({
              userRole: dbRole ?? fallbackRole,
              isRoleResolved: true,
            });
          });
        }
      });

      // Store subscription for cleanup
      set({ authSubscription: subscription });

      // Then hydrate with current session as fallback
      const { data: { session }, error } = await getSession();

      if (error) {
        console.error('Error getting session:', error);
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isEmailVerified: false,
          isPhoneVerified: false,
          userRole: null,
          isRoleResolved: true,
          isLoading: false,
        });
        return;
      }

      const user = session?.user;
      const metadata = user?.user_metadata;

      // Fetch authoritative role from DB during initialization
      const dbRole = user?.id ? await fetchProfileRole(user.id) : null;

      set({
        user: user || null,
        session,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.email_confirmed_at,
        isPhoneVerified: !!user?.phone_confirmed_at,
        hasCompletedOnboarding: metadata?.onboarding_completed || false,
        userRole: dbRole ?? (metadata?.role || null),
        isRoleResolved: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isRoleResolved: true,
        isLoading: false,
      });
    }
  },

  cleanup: () => {
    const state = get();
    if (state.authSubscription) {
      state.authSubscription.unsubscribe();
      set({ authSubscription: null });
    }
  },

  setUser: (user) => {
    const metadata = user?.user_metadata;
    const fallbackRole = (metadata?.role as 'customer' | 'handy' | null | undefined) ?? null;

    set({
      user,
      isAuthenticated: !!user,
      isEmailVerified: !!user?.email_confirmed_at,
      isPhoneVerified: !!user?.phone_confirmed_at,
      hasCompletedOnboarding: metadata?.onboarding_completed || false,
      userRole: fallbackRole,
      isRoleResolved: !user,
      isLoading: false
    });

    if (user?.id) {
      fetchProfileRole(user.id).then((dbRole) => {
        if (get().user?.id !== user.id) return;
        set({
          userRole: dbRole ?? fallbackRole,
          isRoleResolved: true,
        });
      });
    }
  },

  setSession: (session) => {
    const user = session?.user;
    const metadata = user?.user_metadata;
    const fallbackRole = (metadata?.role as 'customer' | 'handy' | null | undefined) ?? null;

    set({
      session,
      user: user || null,
      isAuthenticated: !!user,
      isEmailVerified: !!user?.email_confirmed_at,
      isPhoneVerified: !!user?.phone_confirmed_at,
      hasCompletedOnboarding: metadata?.onboarding_completed || false,
      userRole: fallbackRole,
      isRoleResolved: !user,
      isLoading: false
    });

    if (user?.id) {
      fetchProfileRole(user.id).then((dbRole) => {
        if (get().user?.id !== user.id) return;
        set({
          userRole: dbRole ?? fallbackRole,
          isRoleResolved: true,
        });
      });
    }
  },

  setCurrentPushToken: (token) => {
    set({ currentPushToken: token });
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      // Remove push token before signing out (requires auth context)
      try {
        const { currentPushToken } = get();
        if (currentPushToken) {
          await deleteDevicePushToken(currentPushToken);
        }
      } catch (tokenError) {
        console.error('Error removing push token on logout:', tokenError);
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Error signing out:', error);
        set({ isLoading: false });
        throw error;
      }

      // Clear all stores to prevent data leaking between users
      try {
        const { useProfileStore } = await import('./profile');
        const { useBookingsStore } = await import('./bookings');
        const { useProfessionalProfileStore } = await import('./professional-profile');
        const { useLocationStore } = await import('./location');
        const { useSupportStore } = await import('./support');
        const { useTaskFormStore } = await import('./taskForm');
        const { usePendingBookingStore } = await import('./pending-booking');

        useProfileStore.getState().reset();
        useBookingsStore.getState().reset();
        useProfessionalProfileStore.getState().clearProfile();
        useLocationStore.getState().clearLocation();
        useLocationStore.getState().clearRecentLocations();
        useSupportStore.getState().reset();
        useTaskFormStore.getState().reset();
        usePendingBookingStore.getState().clearPendingBooking();
      } catch (storeError) {
        console.error('Error clearing stores on sign-out:', storeError);
      }

      // Clear React Query cache
      queryClient.clear();

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isEmailVerified: false,
        isPhoneVerified: false,
        hasCompletedOnboarding: false,
        userRole: null,
        isRoleResolved: true,
        currentPushToken: null,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateOnboardingStatus: (completed: boolean) => {
    const state = get();
    if (state.user) {
      set({ hasCompletedOnboarding: completed });
    }
  },

  checkAuth: async () => {
    try {
      const { data: { session }, error } = await getSession();
      
      if (error) {
        console.error('Error checking auth:', error);
        return false;
      }

      const user = session?.user;
      const metadata = user?.user_metadata;
      const isAuthenticated = !!user;
      const fallbackRole = (metadata?.role as 'customer' | 'handy' | null | undefined) ?? null;

      set({
        user: user || null,
        session,
        isAuthenticated,
        isEmailVerified: !!user?.email_confirmed_at,
        isPhoneVerified: !!user?.phone_confirmed_at,
        hasCompletedOnboarding: metadata?.onboarding_completed || false,
        userRole: fallbackRole,
        isRoleResolved: !user,
        isLoading: false
      });

      // Fetch authoritative DB role asynchronously (non-blocking for faster navigation)
      if (user?.id) {
        fetchProfileRole(user.id).then((dbRole) => {
          if (get().user?.id !== user.id) return;
          set({
            userRole: dbRole ?? fallbackRole,
            isRoleResolved: true,
          });
        });
      }

      return isAuthenticated;
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ isLoading: false, isRoleResolved: true });
      return false;
    }
  }
}));
