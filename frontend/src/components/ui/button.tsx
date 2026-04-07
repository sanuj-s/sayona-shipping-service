import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-250 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white border-2 border-primary rounded-lg hover:bg-transparent hover:text-primary",
        outline:
          "border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-primary hover:text-white",
        ghost:
          "text-[var(--foreground)] border border-[var(--border-color)] rounded-md hover:border-primary hover:text-primary hover:bg-primary/5",
        enterprise:
          "bg-primary text-white border-2 border-primary rounded-md hover:bg-transparent hover:text-primary",
        accent:
          "bg-accent text-secondary border-2 border-accent rounded-[10px] font-bold shadow-[0_4px_20px_rgba(232,168,56,0.35)] hover:shadow-[0_6px_28px_rgba(232,168,56,0.5)] hover:-translate-y-0.5",
        "hero-outline":
          "text-white border-2 border-white/35 rounded-[10px] backdrop-blur-sm hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px]",
        md: "h-11 px-7 text-[15px]",
        lg: "h-[52px] px-10 text-[17px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
