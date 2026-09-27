"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneSpecimen } from "@/data/types";
import { AVAILABILITY_LABELS, DOCUMENTATION_LABELS, TREATMENT_LABELS } from "@/data/labels";

interface TechnicalDataTableProps {
  specimens: StoneSpecimen[];
}

function sizeOf(s: StoneSpecimen): string {
  if (s.weightCarats) return `${s.weightCarats} ct`;
  if (s.weightGrams) return `${s.weightGrams} g`;
  return "—";
}

/** A quiet, tabular "Technical Data" reference — a spec sheet, not a card. */
export default function TechnicalDataTable({ specimens }: TechnicalDataTableProps) {
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
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapRef.current, start: "top 85%" },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="w-full border-t border-line-soft bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <p className="mb-6 text-[0.62rem] uppercase tracking-[0.22em] text-bone-dim/80">Technical Data</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line-soft text-[0.62rem] uppercase tracking-[0.12em] text-bone-dim">
                <th className="py-3 pr-6 font-normal">Lot</th>
                <th className="py-3 pr-6 font-normal">Origin</th>
                <th className="py-3 pr-6 font-normal">Treatment</th>
                <th className="py-3 pr-6 font-normal">Size</th>
                <th className="py-3 pr-6 font-normal">Availability</th>
                <th className="py-3 font-normal">Documentation</th>
              </tr>
            </thead>
            <tbody>
              {specimens.map((s) => (
                <tr key={s.id} className="border-b border-line-soft text-sm text-bone">
                  <td className="py-3.5 pr-6 font-serif">{s.name}</td>
                  <td className="py-3.5 pr-6 text-bone-dim">{s.origin}</td>
                  <td className="py-3.5 pr-6 text-bone-dim">{TREATMENT_LABELS[s.treatment]}</td>
                  <td className="py-3.5 pr-6 text-bone-dim">{sizeOf(s)}</td>
                  <td className="py-3.5 pr-6 text-bone-dim">{AVAILABILITY_LABELS[s.availability]}</td>
                  <td className="py-3.5 text-bone-dim">{DOCUMENTATION_LABELS[s.documentation]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
