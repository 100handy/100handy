import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute() {
  const { user, session, isAdmin, loading, roleResolved } = useAuth();
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

  return <Outlet />;
}
