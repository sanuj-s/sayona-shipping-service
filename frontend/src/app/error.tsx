"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { fadeUp, DURATION, EASE } from "@/lib/motion/variants";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an observability layer in Phase 5
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <motion.div
        variants={fadeUp()}
        initial="hidden"
        animate="show"
        className="max-w-md w-full glass-3d rounded-2xl p-8 border border-error/20 flex flex-col items-center text-center shadow-[0_12px_48px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error/40 via-error to-error/40" />
        
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>
        
        <h2 className="text-xl font-display font-bold text-[var(--foreground)] mb-3">
          Telemetry Desync
        </h2>
        
        <p className="text-sm text-[var(--foreground-secondary)] mb-8 leading-relaxed">
          The operational request failed to reconcile. This may be a momentary network disengagement or an invalid payload structure.
        </p>

        <Button variant="outline" onClick={() => reset()} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" /> Re-establish Connection
        </Button>
        
        <p className="text-[10px] text-[var(--foreground-secondary)] opacity-50 mt-4 font-mono">
          ERROR_DIGEST: {error.digest || error.message?.slice(0, 15) || "UNKNOWN_FAULT"}
        </p>
      </motion.div>
    </div>
  );
}
