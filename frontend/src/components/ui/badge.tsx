import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        primary: "bg-primary/10 text-primary",
        success: "bg-success-light text-success dark:bg-success/20",
        warning: "bg-warning-light text-warning dark:bg-warning/20",
        error: "bg-error-light text-error dark:bg-error/20",
        info: "bg-info-light text-info dark:bg-info/20",
        accent: "bg-accent-soft text-accent-hover",
        outline: "border border-[var(--border-color)] text-[var(--foreground-secondary)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] rounded-md",
        md: "px-2.5 py-1 text-xs rounded-lg",
        lg: "px-3 py-1.5 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Shipping status badge with automatic color mapping
function StatusBadge({
  status,
  className,
  ...props
}: { status: string } & Omit<BadgeProps, "variant">) {
  const statusLower = status.toLowerCase();

  const variantMap: Record<string, BadgeProps["variant"]> = {
    pending: "default",
    "picked up": "info",
    "in transit": "info",
    "at port": "primary",
    "customs clearance": "warning",
    "out for delivery": "warning",
    delivered: "success",
    failed: "error",
    returned: "primary",
  };

  const variant = variantMap[statusLower] || "default";

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)} {...props}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants };
