import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type TextFieldProps = {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, error, helperText, leftSlot, rightSlot, containerClassName, className, disabled, ...props }, ref) => {
    const describedBy = error ? `${id}-error` : helperText ? `${id}-helper` : undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div
          className={cn(
            "flex items-stretch overflow-hidden rounded-lg border bg-white transition duration-200 ease-in-out dark:bg-zinc-950",
            "focus-within:ring-2 focus-within:ring-primary-500/30 dark:focus-within:ring-primary-400/25",
            error
              ? "border-red-500 ring-2 ring-red-500/15 dark:border-red-400"
              : "border-zinc-300 focus-within:border-primary-500 dark:border-zinc-600 dark:focus-within:border-primary-500",
            disabled && "opacity-60",
          )}
        >
          {leftSlot && (
            <span className="flex shrink-0 items-center border-r border-zinc-200 bg-zinc-50 px-3 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              {leftSlot}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              "min-h-[44px] flex-1 px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100",
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <span className="flex shrink-0 items-center border-l border-zinc-200 bg-zinc-50 px-2 dark:border-zinc-700 dark:bg-zinc-900">
              {rightSlot}
            </span>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${id}-helper`} className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
