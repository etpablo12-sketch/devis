import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { DivasLogo } from "../DivasLogo";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { cn } from "../../lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#novidades", label: "Novidades" },
  { href: "#contato", label: "Contato" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
          >
            <DivasLogo className="text-3xl text-primary-600 dark:text-primary-400 sm:text-4xl" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex lg:gap-2">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {label}
              </a>
            ))}
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="ml-1" type="button" onClick={() => navigate("/app/listing")}>
                  Agendar
                </Button>
                {profile?.role === "admin" && (
                  <Button variant="outline" size="sm" className="ml-1" type="button" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="ml-1" type="button" onClick={() => navigate("/login")}>
                  Entrar
                </Button>
                <Button size="sm" className="ml-1" type="button" onClick={() => navigate("/signup")}>
                  Cadastrar
                </Button>
              </>
            )}
            <ThemeToggle className="ml-2" />
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className={cn(
                "rounded-lg p-2 text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              )}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            "overflow-hidden border-t border-zinc-200 transition-all duration-200 ease-in-out dark:border-zinc-800 md:hidden",
            open ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0",
          )}
        >
          <nav className="flex flex-col gap-1 py-4">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            {user ? (
              <>
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-primary-600 px-3 py-3 text-center text-base font-semibold text-white"
                  onClick={() => {
                    setOpen(false);
                    navigate("/app/listing");
                  }}
                >
                  Agendar
                </button>
                {profile?.role === "admin" && (
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-300 px-3 py-3 text-center dark:border-zinc-600"
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin");
                    }}
                  >
                    Admin
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mt-2 rounded-lg border border-zinc-300 px-3 py-3 text-center dark:border-zinc-600"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-primary-600 px-3 py-3 font-semibold text-white"
                  onClick={() => {
                    setOpen(false);
                    navigate("/signup");
                  }}
                >
                  Cadastrar
                </button>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
