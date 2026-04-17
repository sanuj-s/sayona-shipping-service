import { motion } from "framer-motion";
import { fadeUp, DURATION, EASE } from "@/lib/motion/variants";
import { PackageOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZeroStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export function ZeroState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = PackageOpen,
}: ZeroStateProps) {
  return (
    <motion.div
      variants={fadeUp()}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--border-color)] rounded-[var(--radius-xl)] bg-[var(--surface)] shadow-[var(--shadow-soft)] min-h-[400px]"
    >
      <div className="w-20 h-20 bg-[var(--background)] rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-[var(--border-color)]">
        <Icon className="w-8 h-8 text-[var(--foreground-secondary)] opacity-50" />
      </div>
      
      <h3 className="text-xl font-display font-bold text-[var(--foreground)] mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-[var(--foreground-secondary)] max-w-md mx-auto mb-8 text-sm">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="accent" onClick={onAction}>
          {actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </motion.div>
  );
}
