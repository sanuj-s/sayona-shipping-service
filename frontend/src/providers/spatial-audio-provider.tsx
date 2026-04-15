"use client";

import { useEffect, useCallback } from "react";

type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };

export function SpatialAudioProvider({ children }: { children: React.ReactNode }) {
  // We use WebAudio API to synthesize procedural luxury sounds
  // to avoid downloading mp3s.

  const playLuxuryThud = useCallback(() => {
    try {
      const w = window as WindowWithWebkitAudio;
      const Ctor = w.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) return;

      const audioCtx = new Ctor();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      
      // Deep sub-bass frequency sweep
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      // Volume envelope (quick attack, smooth slow release)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch {
      console.debug("AudioContext not supported or blocked");
    }
  }, []);

  const playShimmer = useCallback(() => {
    try {
      const w = window as WindowWithWebkitAudio;
      const Ctor = w.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) return;

      const audioCtx = new Ctor();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch {
      // AudioContext blocked
    }
  }, []);

  useEffect(() => {
    const handleThud = () => playLuxuryThud();
    const handleShimmer = () => playShimmer();

    window.addEventListener("play-luxury-thud", handleThud);
    window.addEventListener("play-shimmer", handleShimmer);

    return () => {
      window.removeEventListener("play-luxury-thud", handleThud);
      window.removeEventListener("play-shimmer", handleShimmer);
    };
  }, [playLuxuryThud, playShimmer]);

  return <>{children}</>;
}
