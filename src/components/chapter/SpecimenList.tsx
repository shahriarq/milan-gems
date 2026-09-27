"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneSpecimen } from "@/data/types";
import { AVAILABILITY_LABELS } from "@/data/labels";

interface SpecimenListProps {
  specimens: StoneSpecimen[];
  onSelectSpecimen: (specimen: StoneSpecimen) => void;
}

/** Quiet, text-only "Specimens / Lots" list — no cards, just a lit list of names. */
export default function SpecimenList({ specimens, onSelectSpecimen }: SpecimenListProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapRef.current, start: "top 85%" },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
      <p className="mb-4 text-[0.62rem] uppercase tracking-[0.22em] text-bone-dim/80">
        Specimens / Lots — {specimens.length} Available
      </p>
      <ul className="flex flex-col divide-y divide-line-soft sm:max-w-xl">
        {specimens.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelectSpecimen(s)}
              className="group flex w-full items-center justify-between gap-4 py-3.5 text-left"
            >
              <span className="flex flex-col">
                <span className="font-serif text-base text-bone transition-colors duration-300 group-hover:text-bronze-soft">
                  {s.name}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.1em] text-bone-dim">
                  {AVAILABILITY_LABELS[s.availability]}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-bone-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-bronze-soft"
              >
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
