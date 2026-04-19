import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isFirebaseConfigured } from "../../services/firebase";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isFirebaseConfigured()) {
    return <Navigate to="/login" replace state={{ reason: "config" }} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
