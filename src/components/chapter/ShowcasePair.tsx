"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useContent } from "@/i18n/LocaleProvider";
import type { StoneMaterial } from "@/data/types";
import SpecimenDialog from "./SpecimenDialog";

interface ShowcasePairProps {
  material: StoneMaterial;
}

/**
 * Two vertical photographs following a chapter's opening shot. Side by side
 * on larger screens (staggered reveal + slow inner drift); a swipeable,
 * snap-scrolling slider with position markers on mobile. Each photograph
 * opens that piece's detail box; a small "Details" mark signals it.
 */
export default function ShowcasePair({ material }: ShowcasePairProps) {
  const { UI, CTA } = useContent();
  const items = material.showcase;
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    const idx = Math.round(track.scrollLeft / (track.scrollWidth / items.length));
    if (idx !== active) setActive(idx);
  }

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }

  const lotLabel = (i: number) => `${UI.detail.lot} ${String(i + 1).padStart(2, "0")}`;

  return (
    <div ref={wrapRef} className="w-full bg-ink py-10 sm:py-16 lg:py-20">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${material.name} — ${UI.showcase.photos}`}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 sm:mx-auto sm:grid sm:max-w-7xl sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-10 lg:gap-10 lg:px-16"
      >
        {items.map((item, i) => (
          <figure
            key={item.image.src}
            data-frame
            className={`group relative aspect-[4/5] w-[84%] shrink-0 snap-center overflow-hidden bg-ink-soft sm:w-auto ${
              i === 1 ? "sm:mt-24 lg:mt-32" : ""
            }`}
          >
            <div data-inner className="absolute inset-0 will-change-transform">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 640px) 50vw, 84vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.035]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_45%,rgba(7,7,7,0.4)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Specimen label: lot, material, origin. */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[60%] sm:bottom-5 sm:left-5 [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">
              <p className="text-[0.58rem] uppercase tracking-[0.3em] text-bronze-soft">{lotLabel(i)}</p>
              <p className="mt-1.5 font-serif text-lg leading-tight text-bone sm:text-xl">{material.name}</p>
              <p className="mt-1 text-[0.58rem] uppercase tracking-[0.24em] text-bone-dim">{material.originSummary}</p>
              <p className="mt-3 text-[0.62rem] uppercase tracking-[0.24em] text-bone transition-colors duration-500 group-hover:text-bronze-soft">
                {CTA.viewSpecimen} <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-haspopup="dialog"
              aria-label={`${CTA.viewSpecimen}: ${material.name} — ${lotLabel(i)}`}
              className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-8 focus-visible:outline-bronze-soft"
            >
              <DetailsMark />
            </button>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3 sm:hidden">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${UI.showcase.showImage} ${i + 1}`}
            aria-current={active === i}
            className="py-3"
          >
            <span
              className={`block h-px transition-all duration-500 ${active === i ? "w-10 bg-bronze-soft" : "w-5 bg-bone-dim/50"}`}
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <SpecimenDialog
          material={material}
          items={items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}

/**
 * The "there is more here" mark: a hairline circle with a plus, breathing
 * with a slow halo; the plus turns on hover.
 */
function DetailsMark() {
  return (
    <span aria-hidden="true" className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center sm:bottom-5 sm:right-5">
      <span className="details-halo absolute inset-0 rounded-full border border-bronze-soft/60" />
      <span className="absolute inset-0 rounded-full border border-bone/35 bg-ink/45 backdrop-blur-md transition-colors duration-500 group-hover:border-bronze-soft group-hover:bg-ink/65" />
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        className="relative text-bone transition-transform duration-500 group-hover:rotate-90 group-hover:text-bronze-soft"
      >
        <path d="M12 5 V19 M5 12 H19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
