import type { Session, User } from "@supabase/supabase-js";

import type { UserRole } from "@/lib/database.types";

interface UserRoleMetadata {
  role?: UserRole;
}

export interface BootstrapAuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  roleResolved: boolean;
  loading: boolean;
}

export function getSessionRole(user: User | null): UserRole | null {
  const appRole = (user?.app_metadata as UserRoleMetadata | undefined)?.role;
  const userRole = (user?.user_metadata as UserRoleMetadata | undefined)?.role;
  const role = appRole ?? userRole;

  if (role === "admin" || role === "customer" || role === "handy") {
    return role;
  }

  return null;
}

export function deriveBootstrapAuthState(
  session: Session | null,
): BootstrapAuthState {
  const user = session?.user ?? null;
  const role = getSessionRole(user);

  return {
    user,
    session,
    isAdmin: role === "admin",
    roleResolved: !user || role !== null,
    loading: false,
  };
}
