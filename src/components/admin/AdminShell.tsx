import {
  ArrowLeftIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasAdminDashboardAccess } from "../../lib/adminAccess";
import { ThemeToggle } from "../layout/ThemeToggle";
import { Button } from "../ui/Button";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Painel", icon: HomeIcon, end: true },
  { to: "/admin/users", label: "Usuários", icon: UsersIcon },
  { to: "/admin/posts", label: "Publicações", icon: DocumentTextIcon },
  { to: "/admin/site", label: "Site", icon: GlobeAltIcon },
];

export function AdminShell() {
  const { profile, user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!hasAdminDashboardAccess(profile, user?.email)) {
    return <Navigate to="/app/listing" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:static">
        <div className="flex h-14 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
          <span className="font-script text-2xl text-primary-600 dark:text-primary-400">Divas Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={Boolean(end)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300" : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <Button variant="ghost" className="mb-2 w-full justify-start gap-2" onClick={() => navigate("/")}>
            <ArrowLeftIcon className="h-5 w-5" />
            Site público
          </Button>
          <Button variant="outline" className="w-full" size="sm" onClick={handleLogout}>
            Sair
          </Button>
          <div className="mt-3 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* pl-64: fixed sidebar (w-64) on small screens; lg:pl-0 when aside is static in the row */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-64 lg:pl-0">
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
