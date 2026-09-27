"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { ABOUT } from "@/data/content";

export default function AboutSection() {
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
      id="about"
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
      </div>
    </section>
  );
}
