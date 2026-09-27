"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneMaterial, StoneSpecimen } from "@/data/types";
import { AVAILABILITY_LABELS } from "@/data/labels";

interface StoneSectionProps {
  material: StoneMaterial;
  index: number;
  onSelectSpecimen: (specimen: StoneSpecimen) => void;
}

/**
 * One full-bleed visual chapter per material. The photograph occupies the
 * viewport; typography and specification sit as a quiet overlay rather than
 * a competing column. Replaces the earlier image-left/text-right/cards
 * layout entirely.
 */
export default function StoneSection({ material, index, onSelectSpecimen }: StoneSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const contentRefs = useRef<Array<HTMLElement | null>>([]);
  const chapterNumber = String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Curtain-style reveal of the chapter's photograph as it enters.
      gsap.fromTo(
        maskRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 90%", end: "top 30%", scrub: 0.7 },
        }
      );

      // Slow, camera-like zoom across the full time the chapter is in view.
      gsap.fromTo(
        imageRef.current,
        { scale: 1.22 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.9 },
        }
      );

      gsap.fromTo(
        chapterRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 0.4,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      const els = contentRefs.current.filter(Boolean) as HTMLElement[];
      gsap.fromTo(
        els,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={material.slug}
      aria-labelledby={`${material.slug}-heading`}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-ink"
    >
      <div ref={maskRef} className="absolute inset-0">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src={material.heroImage.src}
            alt={material.heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-0% via-ink/35 via-45% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_40%,rgba(7,7,7,0.5)_100%)]" />
        <div className="grain absolute inset-0" />
      </div>

      <span
        ref={chapterRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-10 select-none font-serif text-sm tracking-[0.4em] text-bone-dim opacity-0 sm:right-10 lg:right-16"
      >
        {chapterNumber} / 04
      </span>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <span
          ref={(el) => {
            contentRefs.current[0] = el;
          }}
          className="text-[0.72rem] uppercase tracking-[0.3em] text-bronze-soft"
        >
          {material.kicker}
        </span>

        <h2
          id={`${material.slug}-heading`}
          ref={(el) => {
            contentRefs.current[1] = el;
          }}
          className="mt-3 max-w-2xl font-serif text-4xl leading-[1.05] text-bone sm:text-5xl md:text-6xl"
        >
          {material.name}
        </h2>

        <p
          ref={(el) => {
            contentRefs.current[2] = el;
          }}
          className="mt-3 text-sm uppercase tracking-[0.16em] text-bone-dim"
        >
          {material.originSummary}
        </p>

        <p
          ref={(el) => {
            contentRefs.current[3] = el;
          }}
          className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-bone-dim"
        >
          {material.description[0]}
        </p>

        {material.isExperimental && (
          <p
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
            className="mt-5 max-w-lg text-xs italic leading-relaxed text-bone-dim/80"
          >
            Presented as an experimental material. Provenance, authenticity, and documentation
            claims are noted per specimen and are not presented as verified unless supporting
            documentation exists.
          </p>
        )}

        <div
          ref={(el) => {
            contentRefs.current[5] = el;
          }}
          className="mt-10 border-t border-line-soft pt-6 sm:mt-12"
        >
          <p className="mb-4 text-[0.62rem] uppercase tracking-[0.22em] text-bone-dim/80">
            Specimens — {material.specimens.length} Available
          </p>
          <ul className="flex flex-col divide-y divide-line-soft sm:max-w-xl">
            {material.specimens.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelectSpecimen(s)}
                  className="group flex w-full items-center justify-between gap-4 py-3 text-left"
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
      </div>
    </section>
  );
}
