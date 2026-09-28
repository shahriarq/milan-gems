"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { MediaAsset } from "@/data/types";

interface ShowcasePairProps {
  images: [MediaAsset, MediaAsset];
  label: string;
}

/**
 * Two vertical photographs following a chapter's opening shot. Side by side
 * on larger screens (staggered reveal + slow inner drift); a swipeable,
 * snap-scrolling slider with position dots on mobile.
 */
export default function ShowcasePair({ images, label }: ShowcasePairProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
      const inners = gsap.utils.toArray<HTMLElement>("[data-inner]");

      gsap.fromTo(
        frames,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: { trigger: wrapRef.current, start: "top 82%" },
        }
      );

      gsap.fromTo(
        inners,
        { scale: 1.14, yPercent: -3 },
        {
          scale: 1.02,
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / (track.scrollWidth / images.length));
    if (idx !== active) setActive(idx);
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  return (
    <div ref={wrapRef} className="w-full bg-ink py-10 sm:py-16 lg:py-20">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 sm:mx-auto sm:max-w-7xl sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-10 lg:gap-10 lg:px-16"
      >
        {images.map((img, i) => (
          <figure
            key={img.src}
            data-frame
            aria-label={`${i + 1} of ${images.length}`}
            className={`relative aspect-[4/5] w-[84%] shrink-0 snap-center overflow-hidden bg-ink-soft sm:w-auto ${
              i === 1 ? "sm:mt-24 lg:mt-32" : ""
            }`}
          >
            <div data-inner className="absolute inset-0 will-change-transform">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 50vw, 84vw"
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_45%,rgba(7,7,7,0.4)_100%)]" />
          </figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3 sm:hidden">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={active === i}
            className="py-3"
          >
            <span
              className={`block h-px transition-all duration-500 ${active === i ? "w-10 bg-bronze-soft" : "w-5 bg-bone-dim/50"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
