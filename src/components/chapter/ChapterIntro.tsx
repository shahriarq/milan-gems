"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneMaterial } from "@/data/types";

interface ChapterIntroProps {
  material: StoneMaterial;
  index: number;
}

/**
 * The opening shot of a material chapter: full-bleed photograph, a curtain
 * reveal + slow zoom, and a legibility panel (rather than a bare gradient)
 * behind the heading so the type reads cleanly against bright or busy
 * regions of the photograph.
 */
export default function ChapterIntro({ material, index }: ChapterIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chapterNumber = String(index + 1).padStart(2, "0");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
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
            priority={index === 0}
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-0% via-ink/25 via-40% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgba(7,7,7,0.45)_100%)]" />
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
        <div ref={panelRef} className="inline-block max-w-2xl px-6 py-6 text-scrim sm:px-8 sm:py-8">
          <span className="text-[0.72rem] uppercase tracking-[0.3em] text-bronze-soft">{material.kicker}</span>

          <h2
            id={`${material.slug}-heading`}
            className="mt-3 font-serif text-4xl leading-[1.05] text-bone sm:text-5xl md:text-6xl"
          >
            {material.name}
          </h2>

          <p className="mt-3 text-sm uppercase tracking-[0.16em] text-bone-dim">{material.originSummary}</p>

          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-bone-dim">{material.description[0]}</p>
        </div>
      </div>
    </section>
  );
}
