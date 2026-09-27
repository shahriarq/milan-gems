"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { StoneSpecimen } from "@/data/types";
import {
  AVAILABILITY_LABELS,
  DOCUMENTATION_LABELS,
  TREATMENT_LABELS,
} from "@/data/labels";

interface StoneDetailModalProps {
  specimen: StoneSpecimen | null;
  onClose: () => void;
}

const ANIMATION_MS = 480;

export default function StoneDetailModal({ specimen, onClose }: StoneDetailModalProps) {
  // The rendered specimen lags one tick behind the prop so the panel can
  // play a proper exit animation before actually unmounting. Derived during
  // render (React's recommended "adjust state on prop change" pattern)
  // rather than in an effect, so there's no cascading-render setState.
  const [rendered, setRendered] = useState<StoneSpecimen | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [prevSpecimenProp, setPrevSpecimenProp] = useState(specimen);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  if (specimen !== prevSpecimenProp) {
    setPrevSpecimenProp(specimen);
    if (specimen) {
      setRendered(specimen);
      setIsClosing(false);
    } else if (rendered) {
      setIsClosing(true);
    }
  }

  // Purely a timer subscription (a legitimate effect): once closing starts,
  // actually unmount after the exit animation would have finished.
  useEffect(() => {
    if (!isClosing) return;
    const t = setTimeout(() => {
      setRendered(null);
      setIsClosing(false);
    }, ANIMATION_MS);
    return () => clearTimeout(t);
  }, [isClosing]);

  useEffect(() => {
    if (!rendered) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (isClosing) {
        if (reduced) {
          gsap.set([backdropRef.current, panelRef.current], { opacity: 0 });
          return;
        }
        gsap.to(backdropRef.current, { opacity: 0, duration: ANIMATION_MS / 1000, ease: "power2.in" });
        gsap.to(panelRef.current, {
          opacity: 0,
          y: 16,
          scale: 0.98,
          duration: ANIMATION_MS / 1000,
          ease: "power2.in",
        });
      } else {
        if (reduced) {
          gsap.set([backdropRef.current, panelRef.current], { opacity: 1, y: 0, scale: 1 });
          return;
        }
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set(panelRef.current, { opacity: 0, y: 28, scale: 0.97 });
        gsap.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(panelRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.05 });
      }
    });
    return () => ctx.revert();
  }, [rendered, isClosing]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [rendered, onClose]);

  if (!rendered) return null;

  const slides = [rendered.mainImage, ...rendered.gallery];

  const specRows: Array<[string, string]> = [
    ["Origin", rendered.origin],
    ["Treatment", TREATMENT_LABELS[rendered.treatment]],
    ...(rendered.weightCarats ? ([["Weight", `${rendered.weightCarats} ct`]] as Array<[string, string]>) : []),
    ...(rendered.weightGrams ? ([["Weight", `${rendered.weightGrams} g`]] as Array<[string, string]>) : []),
    ...(rendered.dimensionsMm ? ([["Dimensions", `${rendered.dimensionsMm} mm`]] as Array<[string, string]>) : []),
    ...(rendered.matrix ? ([["Matrix", rendered.matrix]] as Array<[string, string]>) : []),
    ["Availability", AVAILABILITY_LABELS[rendered.availability]],
    ["Documentation", DOCUMENTATION_LABELS[rendered.documentation]],
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={rendered.name}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-ink/95 backdrop-blur-md" />

      {/* Near-full-viewport presentation — the specimen as an object in a
          dark room, not a bounded dialog box. */}
      <div
        ref={panelRef}
        className="relative flex h-full w-full flex-col overflow-hidden sm:h-[92vh] sm:w-[94vw] sm:max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close specimen detail"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center text-bone-dim transition-colors duration-300 hover:text-bronze-soft"
        >
          ✕
        </button>

        <div className="relative flex-1 bg-ink-soft">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, EffectFade]}
            effect={slides.length > 1 ? "fade" : undefined}
            fadeEffect={{ crossFade: true }}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            className="h-full w-full [--swiper-navigation-color:var(--color-bronze-soft)] [--swiper-navigation-size:18px] [--swiper-pagination-color:var(--color-bronze-soft)]"
          >
            {slides.map((img, i) => (
              <SwiperSlide key={img.src + i}>
                <div className="relative h-full w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="94vw"
                    className="object-contain sm:object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Minimal metadata, laid quietly over the image rather than in a
              separate panel — a museum label, not a spec sheet. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-6 pb-6 pt-16 sm:px-10 sm:pb-8">
            <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-bronze-soft">{rendered.origin}</p>
                <h3 className="mt-1.5 font-serif text-xl text-bone sm:text-2xl">{rendered.name}</h3>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
                  {specRows.map(([label, value]) => (
                    <div key={label} className="flex items-baseline gap-1.5">
                      <dt className="text-[0.62rem] uppercase tracking-[0.1em] text-bone-dim">{label}</dt>
                      <dd className="text-[0.78rem] text-bone">{value}</dd>
                    </div>
                  ))}
                </dl>
                {rendered.notes && (
                  <p className="mt-3 max-w-md text-xs italic leading-relaxed text-bone-dim">{rendered.notes}</p>
                )}
              </div>

              <a
                href="#contact"
                onClick={onClose}
                className="shrink-0 border-b border-bronze-dim pb-1 text-[0.72rem] uppercase tracking-[0.16em] text-bronze-soft transition-colors duration-300 hover:border-bronze-soft hover:text-bone"
              >
                Inquire About This Specimen
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
