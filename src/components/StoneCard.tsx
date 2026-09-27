"use client";

import Image from "next/image";
import type { StoneSpecimen } from "@/data/types";
import { AVAILABILITY_LABELS } from "@/data/labels";

interface StoneCardProps {
  specimen: StoneSpecimen;
  onSelect: (specimen: StoneSpecimen) => void;
}

export default function StoneCard({ specimen, onSelect }: StoneCardProps) {
  const hoverImage = specimen.gallery[0];

  return (
    <button
      type="button"
      onClick={() => onSelect(specimen)}
      className="group relative flex w-[72vw] shrink-0 flex-col overflow-hidden border border-line-soft bg-slate text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold-dim hover:shadow-[0_24px_50px_-20px_rgba(197,160,89,0.32)] sm:w-72"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft">
        <Image
          src={specimen.mainImage.src}
          alt={specimen.mainImage.alt}
          fill
          sizes="(min-width: 640px) 288px, 72vw"
          className="object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.08] group-hover:opacity-0"
        />
        {/* A quiet glimpse of a second angle on hover, in lieu of a static
            image — a small, tactile cue that there is more to see. */}
        {hoverImage && (
          <Image
            src={hoverImage.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 640px) 288px, 72vw"
            className="object-cover opacity-0 scale-[1.12] transition-[transform,opacity] duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-gold-soft/25" />
        <span className="absolute right-3 top-3 border border-line-soft bg-ink/60 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-bone-dim backdrop-blur-sm transition-colors duration-300 group-hover:border-gold-dim/60 group-hover:text-gold-soft">
          {AVAILABILITY_LABELS[specimen.availability]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-serif text-lg text-bone transition-colors duration-300 group-hover:text-gold-soft">
          {specimen.name}
        </h3>
        <p className="text-xs uppercase tracking-[0.1em] text-bone-dim">{specimen.origin}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-[0.72rem] uppercase tracking-[0.1em] text-gold-soft">
          <span className="relative">
            View Specimen
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-soft transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </span>
          <span aria-hidden="true" className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
            →
          </span>
        </div>
      </div>
    </button>
  );
}
