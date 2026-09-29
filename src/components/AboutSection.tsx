"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useContent, useAnchors } from "@/i18n/LocaleProvider";
import IranMark from "./provenance/IranMark";

export default function AboutSection() {
  const { anchorProps } = useAnchors();
  const { ABOUT } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      {...anchorProps("about")}
      aria-labelledby="about-heading"
      className="border-t border-line-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <span className="text-[0.75rem] uppercase tracking-[0.28em] text-gold-soft">{ABOUT.kicker}</span>
        <h2 id="about-heading" className="mt-4 text-balance font-serif text-3xl leading-tight text-bone sm:text-4xl md:text-5xl">
          {ABOUT.heading}
        </h2>
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-4">
          {ABOUT.body.map((p) => (
            <p key={p} className="text-balance text-base leading-relaxed text-bone-dim">
              {p}
            </p>
          ))}
        </div>

        {/* Why Iran — a restrained aside within About, not a new section. */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-6 border-t border-line pt-12 text-left sm:flex-row sm:items-start sm:gap-10">
          <div className="flex shrink-0 flex-col items-center gap-3 sm:w-28">
            <IranMark className="h-14 w-16 text-bronze-soft/70" />
            <span className="text-[0.66rem] uppercase tracking-[0.28em] text-gold-soft">{ABOUT.whyIran.kicker}</span>
          </div>
          <div className="flex flex-col gap-3 text-center sm:text-left">
            {ABOUT.whyIran.body.map((p, i) => (
              <p key={p} className={i === 0 ? "font-serif text-lg leading-relaxed text-bone" : "text-base leading-relaxed text-bone-dim"}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
