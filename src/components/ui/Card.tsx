import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
} & HTMLAttributes<HTMLDivElement>;

const paddings = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({ children, className, padding = "md", ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/80 bg-white shadow-card transition-shadow duration-200 ease-in-out dark:border-zinc-800 dark:bg-zinc-900",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
