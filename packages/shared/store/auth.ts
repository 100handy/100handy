import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { getSession } from '../supabase/auth';
import { supabase } from '../supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Get initial session
      const { data: { session }, error } = await getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ user: null, session: null, isAuthenticated: false, isLoading: false });
        return;
      }

      set({
        user: session?.user || null,
        session,
        isAuthenticated: !!session?.user,
        isLoading: false
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        set({
          user: session?.user || null,
          session,
          isAuthenticated: !!session?.user,
          isLoading: false
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, session: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  },

  setSession: (session) => {
    set({ 
      session, 
      user: session?.user || null,
      isAuthenticated: !!session?.user,
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
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const { data: { session }, error } = await getSession();
      
      if (error) {
        console.error('Error checking auth:', error);
        return false;
      }

      const isAuthenticated = !!session?.user;
      
      set({
        user: session?.user || null,
        session,
        isAuthenticated,
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