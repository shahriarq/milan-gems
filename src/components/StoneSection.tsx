"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneMaterial, StoneSpecimen } from "@/data/types";
import StoneCard from "./StoneCard";

interface StoneSectionProps {
  material: StoneMaterial;
  index: number;
  onSelectSpecimen: (specimen: StoneSpecimen) => void;
}

export default function StoneSection({ material, index, onSelectSpecimen }: StoneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageColRef = useRef<HTMLDivElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const textRefs = useRef<Array<HTMLElement | null>>([]);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;
  const chapterNumber = String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Image: revealed via clip-path wipe (echoes the hero), then drifts
      // slowly — with a faint horizontal component so alternating chapters
      // feel like they're panning across a display case rather than
      // repeating the same up/down motion.
      gsap.fromTo(
        imageMaskRef.current,
        { clipPath: reversed ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 45%", scrub: 0.7 },
        }
      );

      // Mobile keeps the same choreography but with shallower travel — the
      // image column isn't sticky below lg, so a smaller viewport sees this
      // motion compressed into a shorter scroll distance and it should stay
      // gentle rather than swim.
      const isMobile = window.innerWidth < 768;
      const distance = isMobile ? 0.4 : 1;

      gsap.fromTo(
        imageRef.current,
        { scale: 1.22, xPercent: reversed ? -4 * distance : 4 * distance },
        {
          scale: isMobile ? 1.06 : 1.02,
          xPercent: reversed ? 3 * distance : -3 * distance,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

      // Large faint chapter numeral watermark — quiet editorial detail that
      // drifts opposite the image for a subtle sense of depth.
      gsap.fromTo(
        watermarkRef.current,
        { y: 60 * distance, opacity: 0 },
        {
          y: -40 * distance,
          opacity: 0.05,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

      // Heading: per-line mask reveal for consistency with the hero.
      const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (lines.length) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
          }
        );
      }

      const validTextEls = textRefs.current.filter(Boolean) as HTMLElement[];
      gsap.fromTo(
        validTextEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        }
      );

      if (cardsWrapRef.current) {
        gsap.fromTo(
          cardsWrapRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: cardsWrapRef.current, start: "top 90%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reversed]);

  return (
    <section
      ref={sectionRef}
      id={material.slug}
      aria-labelledby={`${material.slug}-heading`}
      className="relative overflow-hidden border-t border-line-soft py-28 sm:py-36 lg:py-44"
    >
      <span
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-2 select-none font-serif text-[5.5rem] leading-none text-gold opacity-[0.05] sm:right-8 sm:text-[10rem] lg:text-[14rem] xl:text-[18rem]"
      >
        {chapterNumber}
      </span>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          <div
            ref={imageColRef}
            className={`lg:sticky lg:top-28 lg:col-span-5 lg:h-fit lg:self-start ${
              reversed ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div
              ref={imageMaskRef}
              className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft"
            >
              <div ref={imageRef} className="absolute inset-0 will-change-transform">
                <Image
                  src={material.heroImage.src}
                  alt={material.heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line-soft" />
              {material.isExperimental && (
                <span className="absolute left-4 top-4 border border-gold-dim/60 bg-ink/70 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-gold-soft backdrop-blur-sm">
                  Experimental
                </span>
              )}
            </div>
          </div>

          <div className={`flex flex-col justify-center lg:col-span-7 ${reversed ? "lg:order-1" : "lg:order-2"}`}>
            <span
              ref={(el) => {
                textRefs.current[0] = el;
              }}
              className="text-[0.75rem] uppercase tracking-[0.28em] text-gold-soft"
            >
              {material.kicker}
            </span>

            <h2
              id={`${material.slug}-heading`}
              className="mt-4 font-serif text-3xl leading-[1.08] text-bone sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {material.name.split(" ").map((word, i) => (
                <span key={word + i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    className="inline-block will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h2>

            <p
              ref={(el) => {
                textRefs.current[1] = el;
              }}
              className="mt-3 text-sm uppercase tracking-[0.12em] text-bone-dim"
            >
              {material.originSummary}
            </p>

            <div
              ref={(el) => {
                textRefs.current[2] = el;
              }}
              className="mt-7 flex max-w-xl flex-col gap-4"
            >
              {material.description.map((p) => (
                <p key={p} className="text-base leading-relaxed text-bone-dim">
                  {p}
                </p>
              ))}
            </div>

            <ul
              ref={(el) => {
                textRefs.current[3] = el;
              }}
              className="mt-9 flex flex-wrap gap-x-8 gap-y-3"
            >
              {material.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-bone">
                  <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>

            {material.isExperimental && (
              <p
                ref={(el) => {
                  textRefs.current[4] = el;
                }}
                className="mt-7 max-w-xl border-l border-gold-dim pl-4 text-xs italic leading-relaxed text-bone-dim"
              >
                Presented as an experimental material. Provenance, authenticity, and documentation
                claims are noted per specimen and are not presented as verified unless supporting
                documentation exists.
              </p>
            )}

            <div
              ref={(el) => {
                textRefs.current[5] = el;
              }}
              className="mt-16"
            >
              <p className="mb-5 text-[0.68rem] uppercase tracking-[0.18em] text-bone-dim">
                Specimens — {material.specimens.length} Available
              </p>
              <div ref={cardsWrapRef}>
                <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:thin] snap-x snap-mandatory">
                  {material.specimens.map((s) => (
                    <div key={s.id} className="snap-start">
                      <StoneCard specimen={s} onSelect={onSelectSpecimen} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
