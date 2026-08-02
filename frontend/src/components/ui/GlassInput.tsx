import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, type, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wider text-text-muted uppercase font-label"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-lg border border-glass-border bg-glass-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            "backdrop-blur-md shadow-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
