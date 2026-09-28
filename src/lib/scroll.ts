"use client";

import type Lenis from "lenis";
import { prefersReducedMotion } from "./gsap";

/**
 * Small shared scroll layer so the header, menu, back-to-top control and
 * in-page CTAs all move through the same smoothed scroll (Lenis) instead of
 * fighting it with native jumps. Falls back to native scrolling when Lenis
 * is not running (reduced motion) or not yet mounted.
 */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/**
 * Offset so anchored sections are not hidden under the fixed header. Lenis
 * already honours `html { scroll-padding-top }` (globals.css), so this is
 * only applied on the native fallback path.
 */
const HEADER_OFFSET = -64;

export function scrollToTarget(target: string | number | HTMLElement) {
  const el =
    typeof target === "string"
      ? target === "#top"
        ? 0
        : (document.querySelector<HTMLElement>(target) ?? null)
      : target;
  if (el === null) return false;

  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4 });
    return true;
  }

  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof el === "number") {
    window.scrollTo({ top: el, behavior });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top, behavior });
  }
  return true;
}

/** Freeze / release page scrolling (used while the mobile menu is open). */
export function setScrollLocked(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  const root = document.documentElement;
  root.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
}
