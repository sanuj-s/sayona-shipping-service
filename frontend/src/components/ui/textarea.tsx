import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full min-h-[120px] rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-secondary)] shadow-sm transition-all duration-[var(--duration-normal)] hover:border-[var(--foreground-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--glow-primary)] focus:border-primary resize-y disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--background-alt)] disabled:text-[var(--foreground-secondary)]",
            error && "border-error focus:ring-[var(--color-error-soft)] focus:border-error hover:border-error",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[var(--foreground-secondary)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
