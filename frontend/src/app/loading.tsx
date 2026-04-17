"use client";

import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    <div className="flex bg-[var(--background)] min-h-[70vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        {/* Radar / Sonar pulse animation */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-2 border-2 border-primary/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.4s]" />
          <div className="w-4 h-4 bg-primary rounded-full shadow-[var(--shadow-glow-primary)] animate-pulse" />
        </div>
        
        {/* Animated typed status */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: [0.4, 1, 0.4] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary"
        >
          Establishing Handshake...
        </motion.div>

        {/* Structural Skeleton hints */}
        <div className="flex gap-3 max-w-sm w-full mt-4">
          <div className="flex-1 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
             <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2 bg-primary/40 rounded-full"
             />
          </div>
        </div>
      </div>
    </div>
  );
}
