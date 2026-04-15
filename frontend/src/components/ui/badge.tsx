import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--background-elevated)] text-[var(--foreground-secondary)] dark:bg-[var(--surface-elevated)] dark:text-[var(--foreground-secondary)]",
        primary: "bg-primary/10 text-primary",
        success:
          "bg-[var(--color-success-light)] text-[var(--color-success)] dark:bg-[var(--color-success-soft)] dark:text-[var(--color-success)]",
        warning:
          "bg-[var(--color-warning-light)] text-[var(--color-warning)] dark:bg-[var(--color-warning-soft)] dark:text-[var(--color-warning)]",
        error:
          "bg-[var(--color-error-light)] text-[var(--color-error)] dark:bg-[var(--color-error-soft)] dark:text-[var(--color-error)]",
        info:
          "bg-[var(--color-info-light)] text-[var(--color-info)] dark:bg-[var(--color-info-soft)] dark:text-[var(--color-info)]",
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
    created: "default",
    picked_up: "info",
    in_transit: "info",
    arrived_at_warehouse: "primary",
    out_for_delivery: "warning",
    delivered: "success",
    failed_delivery: "error",
    returned: "primary",
  };

  const variant = variantMap[statusLower] || "default";

  const displayStatus = status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)} {...props}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayStatus}
    </Badge>
  );
}

export { Badge, StatusBadge, badgeVariants };
