"use client";

import { useCallback } from "react";

/**
 * Advanced Haptic UI feedback for mobile devices using Web Haptics API
 * Usage:
 * const { vibrate } = useHaptic();
 * vibrate("success"); // Triggers [15, 30, 15] for a luxury physical click feel
 */
type HapticPattern = "click" | "success" | "error" | "ambient";

export function useHaptic() {
  const vibrate = useCallback((pattern: HapticPattern = "click") => {
    if (typeof window === "undefined" || !navigator.vibrate) return;

    try {
      switch (pattern) {
        case "click":
          // Sharp, short physical tick
          navigator.vibrate(15);
          break;
        case "success":
          // Analog switch click-clack feel
          navigator.vibrate([15, 40, 15]);
          break;
        case "error":
          navigator.vibrate([20, 50, 20, 50, 20]);
          break;
        case "ambient":
          // Very low sub-rumbles (if device supports sustained low ms)
          navigator.vibrate([5, 10, 5, 10, 5]);
          break;
      }
    } catch {
      console.debug("Haptics not supported or permitted on this device.");
    }
  }, []);

  return { vibrate };
}
