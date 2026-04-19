import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10", className)}
      {...props}
    >
      {children}
    </div>
  );
}
