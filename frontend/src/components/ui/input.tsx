import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "w-full rounded-[var(--radius-md)] border bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] shadow-sm transition-all duration-[var(--duration-normal)] hover:border-[var(--foreground-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--glow-primary)] focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-alt)] disabled:text-[var(--foreground-secondary)]",
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-[15px]",
        lg: "h-12 px-5 text-base",
      },
      state: {
        default: "border-[var(--border-color)]",
        error: "border-error focus:ring-[var(--color-error-soft)] focus:border-error hover:border-error",
        success: "border-success focus:ring-[var(--color-success-soft)] focus:border-success hover:border-success",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, label, helperText, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const effectiveState = error ? "error" : state;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-secondary)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ size, state: effectiveState }),
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--foreground-secondary)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
