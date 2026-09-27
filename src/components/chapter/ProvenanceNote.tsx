"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface ProvenanceNoteProps {
  note: string;
}

/**
 * The experimental chapter's closing beat — a single quiet note on
 * provenance and documentation status, in place of a specimen list and
 * technical data table (meteorite's documentation is not yet verified).
 */
export default function ProvenanceNote({ note }: ProvenanceNoteProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapRef.current, start: "top 80%" },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="w-full bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center sm:px-10">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bronze-soft">Provenance Note</p>
        <p className="mt-5 text-balance font-serif text-lg italic leading-relaxed text-bone-dim sm:text-xl">
          {note}
        </p>
      </div>
    </div>
  );
}
