"use client";

import { useEffect, useState } from "react";
import { CTA } from "@/data/content";
import { scrollToTarget } from "@/lib/scroll";

/** A small, quiet return-to-top control that appears after the first screen. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setShow(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      aria-label={CTA.backToTop}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink/70 text-bone-dim backdrop-blur-md transition-all duration-500 hover:border-bronze-dim hover:text-bronze-soft sm:bottom-8 sm:right-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M12 19 V5 M6 11 L12 5 L18 11" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
