"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, anchorId, rememberLocale, switchLocalePath, type AnchorKey, type Locale } from "@/i18n/config";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { track } from "@/lib/analytics";

/**
 * The section the visitor is currently reading: the last tagged section
 * (data-anchor, see useAnchors) whose top has passed ~35% of the viewport.
 */
function currentSection(): AnchorKey | null {
  const line = window.innerHeight * 0.35;
  let found: AnchorKey | null = null;
  document.querySelectorAll<HTMLElement>("[data-anchor]").forEach((el) => {
    if (el.getBoundingClientRect().top <= line) found = el.dataset.anchor as AnchorKey;
  });
  return found;
}

/**
 * IT / EN toggle. Opens the same page in the other language — with its
 * localized URL (/it/contatti ↔ /en/contact) — on the same section, and
 * remembers the choice in a cookie that the proxy reads on the next visit.
 */
export default function LanguageSwitcher({ size = "sm", onSwitch }: { size?: "sm" | "lg"; onSwitch?: () => void }) {
  const locale = useLocale();
  const { UI } = useContent();
  const pathname = usePathname();
  const router = useRouter();

  function choose(to: Locale) {
    if (to === locale) return;
    rememberLocale(to);
    track("language_switch", { from_language: locale, to_language: to });
    onSwitch?.();
    const section = window.scrollY > 40 ? currentSection() : null;
    const target = switchLocalePath(pathname, to, section ? `#${anchorId(section, to)}` : "");
    // With a section hash, let the router scroll to it (the new language's
    // copy can be longer or shorter, so the old pixel offset would drift).
    router.push(target, { scroll: Boolean(section) });
  }

  return (
    <div role="group" aria-label={UI.language.label} className="flex items-center">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className={`${size === "lg" ? "mx-4 h-4" : "mx-2 h-3"} w-px bg-bone-dim/40`} />
          )}
          <button
            type="button"
            lang={l}
            onClick={() => choose(l)}
            aria-pressed={l === locale}
            aria-label={UI.language.names[l]}
            className={`uppercase transition-colors duration-300 ${
              size === "lg" ? "px-1 py-2 text-sm tracking-[0.28em]" : "px-0.5 py-1 text-[0.66rem] tracking-[0.22em]"
            } ${l === locale ? "text-bronze-soft" : "text-bone-dim hover:text-bone"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
