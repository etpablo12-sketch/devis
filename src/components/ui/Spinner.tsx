import { cn } from "../../lib/cn";

type Props = { className?: string; size?: "sm" | "md" | "lg" };

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-[3px]",
};

export function Spinner({ className, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-primary-600 border-t-transparent dark:border-primary-400 dark:border-t-transparent",
        sizes[size],
        className,
      )}
      aria-hidden
    />
  );
}
