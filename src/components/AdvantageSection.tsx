"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useContent, useAnchors } from "@/i18n/LocaleProvider";

export default function AdvantageSection() {
  const { anchorProps } = useAnchors();
  const { ADVANTAGE } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      {...anchorProps("b2b")}
      aria-labelledby="advantage-heading"
      className="border-t border-line-soft bg-ink-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <span className="text-[0.75rem] uppercase tracking-[0.28em] text-gold-soft">
            {ADVANTAGE.kicker}
          </span>
          <h2 id="advantage-heading" className="mt-4 text-balance font-serif text-3xl leading-tight text-bone sm:text-4xl md:text-5xl">
            {ADVANTAGE.heading}
          </h2>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGE.items.map((item, i) => (
            <li
              key={item.title}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="border-t border-gold-dim/40 pt-6"
            >
              <span className="font-serif text-2xl text-gold-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-xl text-bone">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone-dim">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
