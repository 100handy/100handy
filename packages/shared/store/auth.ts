import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { getSession } from '../supabase/auth';
import { supabase } from '../supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
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
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateOnboardingStatus: (completed: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
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

      set({ isLoading: true });

      // Set up auth listener FIRST to avoid missing events between getSession and listener setup
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.phone || session?.user?.email);

        const user = session?.user;
        const metadata = user?.user_metadata;

        set({
          user: user || null,
          session,
          isAuthenticated: !!user,
          isEmailVerified: !!user?.email_confirmed_at,
          isPhoneVerified: !!user?.phone_confirmed_at,
          hasCompletedOnboarding: metadata?.onboarding_completed || false,
          userRole: metadata?.role || null,
          isLoading: false
        });
      });

      // Store subscription for cleanup
      set({ authSubscription: subscription });

      // Then hydrate with current session as fallback
      const { data: { session }, error } = await getSession();

      if (error) {
        console.error('Error getting session:', error);
        set({ user: null, session: null, isAuthenticated: false, isEmailVerified: false, isPhoneVerified: false, userRole: null, isLoading: false });
        return;
      }

      const user = session?.user;
      const metadata = user?.user_metadata;

      set({
        user: user || null,
        session,
        isAuthenticated: !!user,
        isEmailVerified: !!user?.email_confirmed_at,
        isPhoneVerified: !!user?.phone_confirmed_at,
        hasCompletedOnboarding: metadata?.onboarding_completed || false,
        userRole: metadata?.role || null,
        isLoading: false
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, session: null, isAuthenticated: false, isLoading: false });
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
    set({
      user,
      isAuthenticated: !!user,
      isEmailVerified: !!user?.email_confirmed_at,
      isPhoneVerified: !!user?.phone_confirmed_at,
      hasCompletedOnboarding: metadata?.onboarding_completed || false,
      userRole: metadata?.role || null,
      isLoading: false
    });
  },

  setSession: (session) => {
    const user = session?.user;
    const metadata = user?.user_metadata;
    set({
      session,
      user: user || null,
      isAuthenticated: !!user,
      isEmailVerified: !!user?.email_confirmed_at,
      isPhoneVerified: !!user?.phone_confirmed_at,
      hasCompletedOnboarding: metadata?.onboarding_completed || false,
      userRole: metadata?.role || null,
      isLoading: false
    });
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        set({ isLoading: false });
        throw error;
      }

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isEmailVerified: false,
        isPhoneVerified: false,
        hasCompletedOnboarding: false,
        userRole: null,
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

      set({
        user: user || null,
        session,
        isAuthenticated,
        isEmailVerified: !!user?.email_confirmed_at,
        isPhoneVerified: !!user?.phone_confirmed_at,
        hasCompletedOnboarding: metadata?.onboarding_completed || false,
        userRole: metadata?.role || null,
        isLoading: false
      });

      return isAuthenticated;
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ isLoading: false });
      return false;
    }
  }
}));