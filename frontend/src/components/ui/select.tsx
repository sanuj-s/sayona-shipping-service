import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full h-11 appearance-none premium-border rounded-[var(--radius-md)] bg-[var(--surface)] px-4 pr-10 text-[15px] text-[var(--foreground)] shadow-sm transition-[box-shadow,transform,background-color,border-color,color] duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:border-[var(--foreground-secondary)] focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary focus:shadow-[var(--shadow-card)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-alt)] disabled:text-[var(--foreground-secondary)] cursor-pointer",
              error && "border-error focus:ring-[var(--color-error-soft)] focus:border-error hover:border-error",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-secondary)] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--foreground-secondary)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
