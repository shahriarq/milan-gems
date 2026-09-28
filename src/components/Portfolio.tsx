"use client";

import { useContent, useStones } from "@/i18n/LocaleProvider";
import StoneSection from "./StoneSection";

export default function Portfolio() {
  const { PORTFOLIO_INTRO } = useContent();
  const STONES = useStones();
  return (
    <div id="collection" className="relative">
      <div id="materials" className="mx-auto max-w-4xl px-6 pb-24 pt-28 text-center sm:px-10 sm:pb-36 sm:pt-36 lg:pb-44">
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
