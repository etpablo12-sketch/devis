import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasAdminDashboardAccess } from "../../lib/adminAccess";
import { BookingHeader } from "./BookingHeader";

/**
 * Full-width responsive shell for the in-app booking flow (after login).
 * Admins are redirected to `/admin` so booking UI and admin panel stay separate.
 */
export function BookingShell() {
  const { user, profile, loading } = useAuth();

  if (!loading && user && hasAdminDashboardAccess(profile, user.email)) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 dark:bg-zinc-950">
      <BookingHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </div>
    </div>
  );
}
