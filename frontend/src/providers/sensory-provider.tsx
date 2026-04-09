"use client";

import { useEffect, type ReactNode } from "react";
import { useTheme } from "next-themes";

export function SensoryProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // 1. Magnetic / Glow Cursor Tracking
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 2. Ambient Light Sensor (Adaptive Color Theory)
    let sensor: any = null;
    
    const initLightSensor = async () => {
      try {
        // @ts-ignore
        if ("AmbientLightSensor" in window) {
          // @ts-ignore
          sensor = new AmbientLightSensor();
          
          sensor.onreading = () => {
            const illuminance = sensor.illuminance;
            // Map illuminance to temperature shifts
            // Normal office: 300-500 lux
            // Dark room: < 50 lux
            
            if (illuminance < 50 && theme !== "dark") {
              setTheme("dark");
            } else if (illuminance > 500 && theme !== "light") {
              setTheme("light");
            }
            
            // Subtly shift CSS temperature based on live lux
            const shift = Math.min(Math.max((illuminance - 300) / 100, -10), 10);
            document.documentElement.style.setProperty("--ambient-lux-shift", `${shift}`);
          };
          
          sensor.onerror = (event: any) => {
            console.debug("AmbientLightSensor error:", event.error.name);
          };
          
          sensor.start();
        }
      } catch (err) {
        console.debug("Adaptive Color Theory requires AmbientLightSensor flag:", err);
      }
    };

    initLightSensor();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (sensor) sensor.stop();
    };
  }, [theme, setTheme]);

  return <>{children}</>;
}
