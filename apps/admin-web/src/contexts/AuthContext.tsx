import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";

import type { UserRole } from "@/lib/database.types";
import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";

import {
  deriveBootstrapAuthState,
  getSessionRole,
} from "./auth-state";

interface Profile {
  user_id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  roleResolved: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const PROFILE_FETCH_TIMEOUT_MS = 10000;
const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleResolved, setRoleResolved] = useState(false);

  const signingInRef = useRef(false);
  const sessionCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const applyBootstrapState = useCallback((nextSession: Session | null) => {
    const nextState = deriveBootstrapAuthState(nextSession);

    setUser(nextState.user);
    setSession(nextState.session);
    setIsAdmin(nextState.isAdmin);
    setRoleResolved(nextState.roleResolved);
    setLoading(nextState.loading);

    if (!nextState.user) {
      setProfile(null);
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    setRoleResolved(true);
    setLoading(false);
    queryClient.clear();
  }, []);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const queryPromise = supabase
        .from("profiles")
        .select("user_id, role, first_name, last_name, phone, avatar_url")
        .eq("user_id", userId)
        .single();

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Fetch profile timed out")),
          PROFILE_FETCH_TIMEOUT_MS,
        );
      });

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise,
      ]);

      if (error || !data) {
        console.error("[Auth] Error fetching profile:", error ?? "No data returned");
        setRoleResolved(true);
        return null;
      }

      setProfile(data);
      setIsAdmin(data.role === "admin");
      setRoleResolved(true);
      return data;
    } catch (error) {
      console.error("[Auth] Error in fetchProfile:", error);
      setRoleResolved(true);
      return null;
    }
  }, []);

  const reconcileAdminAccess = useCallback(
    async (nextSession: Session, strict = false) => {
      const fallbackRole = getSessionRole(nextSession.user);
      const resolvedProfile = await fetchProfile(nextSession.user.id);

      if (!resolvedProfile) {
        if (strict && fallbackRole !== "admin") {
          await supabase.auth.signOut();
          clearAuthState();
        }
        return null;
      }

      if (resolvedProfile.role !== "admin") {
        await supabase.auth.signOut();
        clearAuthState();
        return null;
      }

      return resolvedProfile;
    },
    [clearAuthState, fetchProfile],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      signingInRef.current = true;
      setLoading(true);
      setRoleResolved(false);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        if (!data.session || !data.user) {
          clearAuthState();
          return {
            error: {
              message: "No session returned after sign in",
              name: "UnknownError",
              status: 500,
            } as AuthError,
          };
        }

        applyBootstrapState(data.session);

        const resolvedProfile = await reconcileAdminAccess(data.session, true);

        if (!resolvedProfile) {
          return {
            error: {
              message: "Access denied. Admin privileges required.",
              name: "AuthorizationError",
              status: 403,
            } as AuthError,
          };
        }

        return { error: null };
      } catch (error) {
        console.error("[Auth] Sign in error:", error);
        return {
          error: {
            message: "An unexpected error occurred during sign in",
            name: "UnknownError",
            status: 500,
          } as AuthError,
        };
      } finally {
        signingInRef.current = false;
        setLoading(false);
      }
    },
    [applyBootstrapState, clearAuthState, reconcileAdminAccess],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("[Auth] Sign out error:", error);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState]);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (!data.session) {
        clearAuthState();
        return;
      }

      applyBootstrapState(data.session);

      if (getSessionRole(data.session.user) === null) {
        await reconcileAdminAccess(data.session);
      } else {
        void reconcileAdminAccess(data.session);
      }
    } catch (error) {
      console.error("[Auth] Session refresh error:", error);
      clearAuthState();
    }
  }, [applyBootstrapState, clearAuthState, reconcileAdminAccess]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (signingInRef.current && event !== "SIGNED_OUT") {
        return;
      }

      if (event === "SIGNED_OUT") {
        clearAuthState();
        return;
      }

      applyBootstrapState(nextSession);

      if (nextSession?.user) {
        void reconcileAdminAccess(nextSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [applyBootstrapState, clearAuthState, reconcileAdminAccess]);

  useEffect(() => {
    sessionCheckIntervalRef.current = setInterval(async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("[Auth] Session check error:", error);
          clearAuthState();
          return;
        }

        if (!currentSession) {
          clearAuthState();
          return;
        }

        const expiresAt = currentSession.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt - now <= 300) {
          await refreshSession();
        }
      } catch (error) {
        console.error("[Auth] Periodic session check failed:", error);
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => {
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [clearAuthState, refreshSession]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isAdmin,
    loading,
    roleResolved,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
