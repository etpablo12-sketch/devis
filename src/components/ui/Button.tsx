import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type Props = {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus-visible:ring-primary-500 disabled:bg-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500",
  secondary:
    "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 focus-visible:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  outline:
    "border border-zinc-300 bg-transparent text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 focus-visible:ring-primary-500 dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900",
  ghost:
    "text-zinc-700 hover:bg-zinc-100 focus-visible:ring-primary-500 dark:text-zinc-300 dark:hover:bg-zinc-800",
};

const sizes = {
  sm: "gap-1.5 rounded-lg px-3 py-2 text-sm font-medium",
  md: "gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold",
  lg: "gap-2 rounded-xl px-5 py-3 text-base font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      children,
      className,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center transition duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "active:scale-[0.99]",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={size === "lg" ? "md" : "sm"}
            className={cn(
              variant === "primary" && "border-white border-t-transparent",
              variant === "secondary" &&
                "border-white border-t-transparent dark:border-zinc-900 dark:border-t-transparent",
            )}
          />
        )}
        {!isLoading && leftIcon}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
