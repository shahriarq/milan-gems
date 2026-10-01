"use client";

/**
 * Thin GA4 layer. Nothing is sent and no Google script is loaded until the
 * visitor accepts analytics cookies (Italian Garante / GDPR): the consent
 * choice is stored locally and gtag.js is injected only after "Accept".
 */

export type ConsentChoice = "granted" | "denied";
const STORAGE_KEY = "mg-analytics-consent";
export const CONSENT_EVENT = "mg:consent-change";
export const OPEN_CONSENT_EVENT = "mg:open-consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* private mode: the choice simply isn't remembered */
  }
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: choice });
  }
  if (choice === "denied") clearGaCookies();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

/** Remove first-party GA cookies after a withdrawal of consent. */
function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}

export const openConsentSettings = () => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));

/** Send a GA4 event. A no-op until analytics has consent and has loaded. */
export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || !window.gtag || readConsent() !== "granted") return;
  window.gtag("event", event, params);
}
