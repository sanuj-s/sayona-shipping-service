import { cn } from "@/lib/utils/cn";
import { forwardRef, type HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "full";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-5",
          {
            "max-w-[1200px]": size === "default",
            "max-w-[900px]": size === "sm",
            "max-w-[1400px]": size === "lg",
            "max-w-none": size === "full",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

export { Container };
