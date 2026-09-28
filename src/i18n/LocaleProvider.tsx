"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getContent, type SiteContent } from "@/data/content";
import { getStones } from "@/data/stones";
import type { StoneMaterial } from "@/data/types";
import { localizeHref, type Locale } from "./config";

interface LocaleValue {
  locale: Locale;
  content: SiteContent;
  stones: StoneMaterial[];
}

const LocaleContext = createContext<LocaleValue | null>(null);

/** Set once in the [lang] root layout; everything below reads from it. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(() => ({ locale, content: getContent(locale), stones: getStones(locale) }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocaleValue(): LocaleValue {
  const v = useContext(LocaleContext);
  if (!v) throw new Error("LocaleProvider is missing above this component.");
  return v;
}

export const useLocale = () => useLocaleValue().locale;
export const useContent = () => useLocaleValue().content;
export const useStones = () => useLocaleValue().stones;

/** Returns a function that prefixes internal hrefs with the current locale. */
export function useHref() {
  const locale = useLocale();
  return (href: string) => localizeHref(href, locale);
}
