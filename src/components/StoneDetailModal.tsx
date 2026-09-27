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
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div ref={backdropRef} className="absolute inset-0 bg-ink/92 backdrop-blur-md" />

      <div
        ref={panelRef}
        className="relative grid w-full max-w-5xl grid-cols-1 overflow-hidden border border-line bg-slate shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close specimen detail"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-line-soft bg-ink/60 text-bone transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft"
        >
          ✕
        </button>

        <div className="relative bg-ink-soft">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, EffectFade]}
            effect={slides.length > 1 ? "fade" : undefined}
            fadeEffect={{ crossFade: true }}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            className="h-full min-h-[280px] w-full [--swiper-navigation-color:var(--color-gold-soft)] [--swiper-navigation-size:20px] [--swiper-pagination-color:var(--color-gold-soft)]"
          >
            {slides.map((img, i) => (
              <SwiperSlide key={img.src + i}>
                <div className="relative aspect-square w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gold-soft">{rendered.origin}</p>
            <h3 className="mt-2 font-serif text-2xl text-bone sm:text-3xl">{rendered.name}</h3>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-soft pt-6">
            {specRows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.66rem] uppercase tracking-[0.12em] text-bone-dim">{label}</dt>
                <dd className="mt-1.5 font-serif text-base text-bone">{value}</dd>
              </div>
            ))}
          </dl>

          {rendered.notes && (
            <p className="border-t border-line-soft pt-6 text-xs italic leading-relaxed text-bone-dim">
              {rendered.notes}
            </p>
          )}

          <a
            href="#contact"
            onClick={onClose}
            className="group relative mt-auto inline-flex items-center justify-center overflow-hidden border border-gold px-6 py-3.5 text-center text-[0.75rem] uppercase tracking-[0.14em] text-gold-soft transition-colors duration-500"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative transition-colors duration-500 group-hover:text-ink">
              Inquire About This Specimen
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
