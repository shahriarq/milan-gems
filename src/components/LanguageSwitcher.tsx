"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, rememberLocale, switchLocalePath, type Locale } from "@/i18n/config";
import { useContent, useLocale } from "@/i18n/LocaleProvider";

/**
 * IT / EN toggle. Keeps the visitor on the same page (and section) in the
 * other language, and remembers the choice in a cookie that the proxy
 * reads on the next visit.
 */
export default function LanguageSwitcher({ size = "sm", onSwitch }: { size?: "sm" | "lg"; onSwitch?: () => void }) {
  const locale = useLocale();
  const { UI } = useContent();
  const pathname = usePathname();
  const router = useRouter();

  function choose(to: Locale) {
    if (to === locale) return;
    rememberLocale(to);
    onSwitch?.();
    router.push(switchLocalePath(pathname, to) + window.location.hash, { scroll: false });
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
