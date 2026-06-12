'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useSessionMonitor } from '@/hooks/use-session-monitor';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor session for timeouts and token refresh
  useSessionMonitor();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const resolveActiveUser = async (nextUser: User | null): Promise<User | null> => {
      if (!nextUser) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('account_status')
          .eq('user_id', nextUser.id)
          .single();

        if (error) {
          console.error('Error resolving web account status:', error);
          return nextUser;
        }

        if (data?.account_status && data.account_status !== 'active') {
          await supabase.auth.signOut();
          return null;
        }

        return nextUser;
      } catch (error) {
        console.error('Unexpected web account status error:', error);
        return nextUser;
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(await resolveActiveUser(session?.user ?? null));
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      void (async () => {
        setUser(await resolveActiveUser(session?.user ?? null));
        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
