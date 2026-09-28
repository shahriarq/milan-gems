"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { registerLenis } from "@/lib/scroll";

/**
 * Wraps the app with Lenis smooth scrolling synced to GSAP's ticker so
 * ScrollTrigger stays perfectly in step with the smoothed scroll position.
 *
 * When the user has requested reduced motion, Lenis is skipped entirely and
 * the browser's native (instant) scrolling is used — GSAP-driven components
 * independently check `prefersReducedMotion()` before registering any
 * scroll-triggered animation, so the site remains fully usable and calm.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      // Slightly slower and heavier than the default — reads as deliberate
      // and controlled rather than snappy, in keeping with the editorial
      // pacing the rest of the animation system aims for.
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -9.5 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });
    lenisRef.current = lenis;
    registerLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
