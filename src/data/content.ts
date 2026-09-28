import type { Locale } from "@/i18n/config";
import { en } from "./content.en";
import { it } from "./content.it";

/**
 * Locale-aware entry point for all non-stone site copy. English
 * (content.en.ts) defines the shape; Italian (content.it.ts) must match it.
 */
export type SiteContent = typeof en;

export type RequestType = "sample-box" | "b2b-inquiry";

const CONTENT: Record<Locale, SiteContent> = { en, it };

export const getContent = (locale: Locale): SiteContent => CONTENT[locale];
