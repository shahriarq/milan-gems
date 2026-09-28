"use client";

import { STONES } from "@/data/stones";
import { PORTFOLIO_INTRO } from "@/data/content";
import StoneSection from "./StoneSection";

export default function Portfolio() {
  return (
    <div id="collection" className="relative">
      <div id="materials" className="mx-auto max-w-4xl px-6 pt-28 text-center sm:pt-36 sm:px-10">
        <span className="text-[0.75rem] uppercase tracking-[0.28em] text-gold-soft">
          {PORTFOLIO_INTRO.kicker}
        </span>
        <h2 className="mt-4 text-balance font-serif text-3xl leading-tight text-bone sm:text-4xl md:text-5xl">
          {PORTFOLIO_INTRO.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-bone-dim">
          {PORTFOLIO_INTRO.body}
        </p>
      </div>

      {STONES.map((material, i) => (
        <StoneSection key={material.slug} material={material} index={i} />
      ))}
    </div>
  );
}
