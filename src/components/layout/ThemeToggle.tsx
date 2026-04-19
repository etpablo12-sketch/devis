import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "rounded-lg p-2 text-zinc-600 transition duration-200 ease-in-out hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className,
      )}
      aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
