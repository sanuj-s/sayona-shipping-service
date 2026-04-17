"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.02, y: -20, filter: "blur(8px)" }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="flex flex-col flex-1 min-h-screen origin-bottom"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
