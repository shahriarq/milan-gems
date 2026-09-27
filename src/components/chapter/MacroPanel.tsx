"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { MediaAsset } from "@/data/types";

interface MacroPanelProps {
  image: MediaAsset;
  label: string;
  caption: string;
}

/**
 * A second full-bleed beat within a chapter — a slow, isolated macro shot
 * (texture, crystal structure) with a single quiet caption. Exists so a
 * chapter reads as more than one photo before the specimen list.
 */
export default function MacroPanel({ image, label, caption }: MacroPanelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.9 },
        }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-hidden="false" className="relative h-[80svh] min-h-[440px] w-full overflow-hidden bg-ink">
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />
      <div className="grain absolute inset-0" />

      <div ref={panelRef} className="absolute bottom-8 left-6 inline-block px-5 py-4 text-scrim sm:bottom-10 sm:left-10 lg:left-16">
        <span className="block text-[0.62rem] uppercase tracking-[0.24em] text-bronze-soft">{label}</span>
        <span className="mt-1.5 block max-w-xs text-sm leading-relaxed text-bone-dim">{caption}</span>
      </div>
    </section>
  );
}
