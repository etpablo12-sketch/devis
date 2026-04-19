import { Link, useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { DivasLogo } from "../DivasLogo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export function BookingHeader() {
  const navigate = useNavigate();
  const { logout, profile } = useAuth();

  async function handleSignOut() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex min-w-0 items-center gap-2 rounded-lg py-1 text-left transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          aria-label="Go to site"
        >
          <DivasLogo className="truncate text-2xl text-primary-600 dark:text-primary-400 sm:text-3xl" />
        </button>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {profile?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-lg px-2 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950 sm:px-3 sm:text-sm"
            >
              Admin
            </Link>
          )}
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/")}>
            Site
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-1 px-2 sm:px-3"
            aria-label="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
