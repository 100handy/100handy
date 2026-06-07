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
  adminRoleHasPermission,
  type AdminPermission,
} from "@/lib/admin-permissions";

import {
  deriveBootstrapAuthState,
  getSessionRole,
} from "./auth-state";
import { emitAdminToast } from "@/lib/admin-toast";

interface Profile {
  user_id: string;
  role: UserRole;
  admin_role:
    | "super_admin"
    | "content_admin"
    | "ops_admin"
    | "support_admin"
    | "finance_admin"
    | "seo_admin"
    | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  account_status: "active" | "paused" | "deleted";
  status_reason: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
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
        .select("user_id, role, admin_role, first_name, last_name, phone, avatar_url, account_status, status_reason")
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

      if (resolvedProfile.account_status !== "active") {
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
              message: "Access denied. Active admin access is required.",
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
      emitAdminToast({
        tone: "error",
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "Failed to sign out of the admin panel.",
      });
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
      emitAdminToast({
        tone: "error",
        title: "Session refresh failed",
        description: error instanceof Error ? error.message : "Your admin session could not be refreshed.",
      });
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
          emitAdminToast({
            tone: "error",
            title: "Session check failed",
            description: error.message,
          });
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
        emitAdminToast({
          tone: "error",
          title: "Session check failed",
          description: error instanceof Error ? error.message : "The admin session check failed.",
        });
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
    hasPermission: (permission) => adminRoleHasPermission(profile?.admin_role, permission),
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
