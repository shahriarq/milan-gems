"use client";

import { useEffect, useState } from "react";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { scrollToTarget } from "@/lib/scroll";
import { anchorId, type AnchorKey } from "@/i18n/config";

/**
 * A quiet vertical index on the right edge of wide screens (home page only):
 * one hairline tick per chapter, the active one lengthened and labelled.
 * Appears once the first material chapter is reached and steps aside for
 * the footer. Hidden below xl so it never crowds the photography.
 */
export default function SectionProgress() {
  const locale = useLocale();
  const anchor = (key: AnchorKey) => anchorId(key, locale);
  const { SECTION_INDEX, UI } = useContent();
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = -1;
      SECTION_INDEX.forEach((s, i) => {
        const el = document.getElementById(anchorId(s.id as AnchorKey, locale));
        if (el && el.getBoundingClientRect().top <= vh * 0.45) idx = i;
      });
      const footer = document.querySelector("footer");
      const footerIn = footer ? footer.getBoundingClientRect().top < vh * 0.7 : false;
      setActive(idx);
      setVisible(idx !== -1 && !footerIn);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [SECTION_INDEX, locale]);

  return (
    <nav
      aria-label={UI.sectionProgress.label}
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-700 xl:block 2xl:right-10 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ol className="flex flex-col items-end gap-3.5">
        {SECTION_INDEX.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToTarget(`#${anchor(s.id as AnchorKey)}`)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`${UI.sectionProgress.goTo} ${s.label}`}
                tabIndex={visible ? 0 : -1}
                className="group flex items-center gap-3 py-0.5"
              >
                <span
                  className={`text-[0.7rem] uppercase tracking-[0.26em] transition-all duration-500 [text-shadow:0_1px_10px_rgba(0,0,0,0.95)] ${
                    isActive
                      ? "translate-x-0 text-bronze-soft opacity-100"
                      : "translate-x-1 text-bone-dim opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-px transition-all duration-500 ${
                    isActive ? "w-8 bg-bronze-soft" : "w-3.5 bg-bone-dim/60 group-hover:w-5 group-hover:bg-bone-dim"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
