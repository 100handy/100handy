import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import type { AdminPermission } from "@/lib/admin-permissions";

export function ProtectedRoute({ permissions }: { permissions?: AdminPermission[] }) {
  const { user, session, isAdmin, loading, roleResolved, hasPermission } = useAuth();
  const location = useLocation();

  if (loading || (!!session && !!user && !roleResolved)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading access...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: location.pathname, reason: "unauthenticated" }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        replace
        to="/login"
        state={{ from: location.pathname, reason: "unauthorized" }}
      />
    );
  }

  if (permissions && permissions.length > 0 && !permissions.some((permission) => hasPermission(permission))) {
    return (
      <Navigate
        replace
        to="/dashboard"
        state={{ from: location.pathname, reason: "forbidden" }}
      />
    );
  }

  return <Outlet />;
}
