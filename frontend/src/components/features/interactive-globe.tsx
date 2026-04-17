"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

export function InteractiveGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1, // High contrast spatial baseline
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.04, 0.1, 0.2], // Subtle navy
      markerColor: [0.96, 0.62, 0.04], // Premium Accent (Amber/Orange)
      glowColor: [0.1, 0.15, 0.35], // Controlled secondary glow
      markers: [
        // Representing Global Logistics Hubs
        { location: [37.7595, -122.4367], size: 0.05 }, // SF
        { location: [31.2304, 121.4737], size: 0.08 }, // Shanghai
        { location: [51.5072, -0.1276], size: 0.04 }, // London
        { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney
        { location: [1.3521, 103.8198], size: 0.07 }, // Singapore
        { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
      ],
      onRender: (state) => {
        // Continuous smooth cinematic rotation
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [r]);

  return (
    <div
      className={`relative w-full max-w-[600px] aspect-square mx-auto flex justify-center items-center ${className || ""}`}
      style={{
        cursor: pointerInteracting.current !== null ? "grabbing" : "grab",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setR(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setR(delta / 100);
          }
        }}
        className="w-full h-full opacity-0 animate-fade-in"
        style={{
          contain: "layout paint size",
          transition: "opacity 1s ease",
        }}
      />
      {/* Dynamic Refraction Glare (Glassmorphism overlap) */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none z-10" />
    </div>
  );
}
