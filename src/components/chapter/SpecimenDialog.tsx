"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/scroll";
import { useContent } from "@/i18n/LocaleProvider";
import type { ShowcaseItem, SpecimenFacts, StoneMaterial } from "@/data/types";
import SmartLink from "../SmartLink";

interface SpecimenDialogProps {
  material: StoneMaterial;
  items: ShowcaseItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Order of the rows in the specification list. */
const FACT_ORDER: Array<keyof SpecimenFacts> = [
  "reference",
  "weight",
  "dimensions",
  "origin",
  "treatment",
  "availability",
  "price",
];

/**
 * The detail box for one showcase piece: photograph beside its
 * specification sheet. Empty fields read "to be announced", so the box can
 * be live before the figures are final — fill them in `facts` in
 * /src/data/stones.ts. Closes on ×, Escape or backdrop; ← → move between
 * the chapter's pieces. Portaled to <body> so no transformed ancestor can
 * trap its fixed positioning.
 */
export default function SpecimenDialog({ material, items, index, onClose, onNavigate }: SpecimenDialogProps) {
  const { UI, CTA } = useContent();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const item = items[index];
  const pieceLabel = `${UI.detail.piece} ${String(index + 1).padStart(2, "0")}`;

  const go = useCallback(
    (delta: number) => onNavigate((index + delta + items.length) % items.length),
    [index, items.length, onNavigate]
  );

  // Lock page scroll, remember + restore focus.
  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      setScrollLocked(false);
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 28, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", delay: 0.05 }
    );
  }, []);

  // Keyboard: Escape, arrows, and a simple focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "Tab" && panelRef.current) {
        const f = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-stretch justify-center bg-ink/85 backdrop-blur-md sm:items-center sm:p-6 lg:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="specimen-title"
        data-lenis-prevent
        className="relative grid max-h-full w-full max-w-5xl grid-cols-1 overflow-y-auto overscroll-contain border-line bg-ink-soft sm:border md:grid-cols-[1fr_1fr]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={UI.detail.close}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60 text-bone backdrop-blur-md transition-colors hover:text-bronze-soft"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-[4/5] w-full bg-ink md:aspect-auto md:min-h-[560px]">
          <Image
            key={item.image.src}
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 768px) 512px, 100vw"
            className="object-cover"
          />
          {items.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              <NavButton label={UI.detail.previous} onClick={() => go(-1)} dir="prev" />
              <NavButton label={UI.detail.next} onClick={() => go(1)} dir="next" />
            </div>
          )}
        </div>

        <div className="flex flex-col px-6 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-12">
          <p className="text-[0.66rem] uppercase tracking-[0.3em] text-bronze-soft">{material.name}</p>
          <h2 id="specimen-title" className="mt-3 font-serif text-3xl leading-tight text-bone sm:text-4xl">
            {pieceLabel}
          </h2>
          <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em] text-bone-dim">
            {index + 1} {UI.showcase.of} {items.length}
          </p>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {FACT_ORDER.map((key) => {
              const value = item.facts[key];
              return (
                <div key={key} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-[0.66rem] uppercase tracking-[0.2em] text-bone-dim">{UI.detail[key]}</dt>
                  <dd className={`text-right text-sm ${value ? "text-bone" : "font-serif italic text-bone-dim/70"}`}>
                    {value ?? UI.detail.pending}
                  </dd>
                </div>
              );
            })}
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-bone-dim">{UI.detail.note}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-4 pt-10">
            <SmartLink
              href="/contact#inquiry"
              onClick={onClose}
              className="group inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.72rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-bronze-soft hover:text-bronze-soft"
            >
              {CTA.sampleBox}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </SmartLink>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function NavButton({ label, onClick, dir }: { label: string; onClick: () => void; dir: "prev" | "next" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/25 bg-ink/55 text-bone backdrop-blur-md transition-colors hover:border-bronze-soft hover:text-bronze-soft"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d={dir === "prev" ? "M14 6 L8 12 L14 18" : "M10 6 L16 12 L10 18"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
