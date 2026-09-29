"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import IranMark from "./IranMark";

interface OriginRouteProps {
  originLabel: string;
  origin: string;
  destinationLabel: string;
  destination: string;
}

/**
 * IRAN ——→ MILAN: a small editorial transition for "From Origin to
 * Atelier". A hairline draws itself between the two places as it scrolls
 * into view; a point travels along it once.
 */
export default function OriginRoute({ originLabel, origin, destinationLabel, destination }: OriginRouteProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: wrapRef.current, start: "top 85%" } });
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }).fromTo(
        dotRef.current,
        { left: "0%", opacity: 0 },
        { left: "100%", opacity: 1, duration: 1.6, ease: "power2.inOut" },
        0
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="mt-8 flex w-full max-w-md items-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-2">
        <IranMark className="h-9 w-10 text-bronze-soft/80" />
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-bone-dim">{originLabel}</span>
        <span className="text-sm uppercase tracking-[0.34em] text-bone">{origin}</span>
      </div>

      <div className="relative -mt-8 h-px flex-1" aria-hidden="true">
        <span ref={lineRef} className="absolute inset-0 origin-left bg-gradient-to-r from-bronze-soft/70 via-bone-dim/40 to-bronze-soft/70" />
        <span
          ref={dotRef}
          className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze-soft"
          style={{ left: "100%" }}
        />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 text-[0.7rem] leading-none text-bronze-soft/80">→</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="flex h-9 items-end font-serif text-2xl leading-none text-bronze-soft/80" aria-hidden="true">
          M
        </span>
        <span className="text-[0.7rem] uppercase tracking-[0.3em] text-bone-dim">{destinationLabel}</span>
        <span className="text-sm uppercase tracking-[0.34em] text-bone">{destination}</span>
      </div>
    </div>
  );
}
