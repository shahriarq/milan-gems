"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { MediaAsset } from "@/data/types";

interface HorizontalGalleryProps {
  images: MediaAsset[];
  label: string;
}

/**
 * A horizontally scrolling sequence of full-height photographs — the
 * chapter's "walk past the display case" beat, used for materials whose
 * character reads best as a set (agate's banding) rather than one texture.
 */
export default function HorizontalGallery({ images, label }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        trackRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-ink py-14 sm:py-20">
      <p className="mx-auto mb-6 max-w-7xl px-6 text-[0.62rem] uppercase tracking-[0.24em] text-bone-dim/80 sm:px-10 lg:px-16">
        {label}
      </p>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] snap-x snap-mandatory sm:gap-6 sm:px-10 lg:px-16"
      >
        {images.map((img, i) => (
          <div
            key={img.src + i}
            className="relative h-[62svh] w-[78vw] shrink-0 snap-start overflow-hidden bg-ink-soft sm:w-[46vw] lg:h-[68svh] lg:w-[32vw]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
