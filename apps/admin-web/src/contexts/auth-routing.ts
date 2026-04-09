import type { Session, User } from "@supabase/supabase-js";

interface AuthRoutingState {
  loading: boolean;
  roleResolved: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
}

export function isAuthPending(state: AuthRoutingState): boolean {
  return state.loading || (!!state.user && !!state.session && !state.roleResolved);
}

export function resolveInitialRoute(state: AuthRoutingState): "/login" | "/dashboard" | null {
  if (isAuthPending(state)) {
    return null;
  }

  if (state.user && state.session && state.isAdmin) {
    return "/dashboard";
  }

  return "/login";
}
