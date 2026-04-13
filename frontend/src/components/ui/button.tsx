import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[var(--duration-normal)] cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white border-2 border-primary rounded-[10px] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 hover:bg-primary-hover",
        outline:
          "border-2 border-primary text-primary bg-transparent rounded-[10px] hover:bg-primary hover:text-white hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5",
        ghost:
          "text-[var(--foreground)] border-2 border-transparent rounded-[10px] hover:border-[var(--border-color)] hover:text-primary hover:bg-primary/5 hover:shadow-sm",
        enterprise:
          "bg-primary text-white border-2 border-primary rounded-[10px] hover:bg-primary-hover hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5",
        accent:
          "bg-accent text-secondary border-2 border-accent rounded-[10px] font-bold shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:-translate-y-0.5",
        "hero-outline":
          "text-white border-2 border-white/35 rounded-[10px] backdrop-blur-sm hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glass)]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        sm: "h-10 px-4 text-[13px]",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-[17px]",
        icon: "h-12 w-12",
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
  "data-magnetic"?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, "data-magnetic": dataMagnetic, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        data-magnetic={dataMagnetic !== false ? "true" : undefined}
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
