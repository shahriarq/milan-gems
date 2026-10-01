"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import {
  CONSENT_EVENT,
  OPEN_CONSENT_EVENT,
  readConsent,
  track,
  writeConsent,
  type ConsentChoice,
} from "@/lib/analytics";

/**
 * Google Analytics 4 with a consent gate.
 *
 * - No GA script, cookie or request before the visitor clicks "Accept"
 *   (Garante / GDPR "basic" consent mode). "Decline" is as prominent as
 *   "Accept", and the choice can be changed later from the footer.
 * - Page views on client-side navigation are captured by GA4's enhanced
 *   measurement (browser history events), so no manual page_view is sent.
 * - Clicks on WhatsApp / phone / email links are tracked here, centrally.
 */
export default function Analytics({ gaId }: { gaId: string }) {
  const { UI } = useContent();
  const locale = useLocale();
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  // Read the stored choice after mount (localStorage is client-only).
  useEffect(() => {
    const stored = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage
    setConsent(stored);
    setBannerOpen(stored === null);
    setReady(true);
    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentChoice>).detail);
    const onOpen = () => setBannerOpen(true);
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
    };
  }, []);

  // Contact intent: WhatsApp, phone and email link clicks anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const where = a.closest("footer") ? "footer" : a.closest("#mobile-nav") ? "menu" : "page";
      if (href.includes("wa.me/")) track("contact_whatsapp", { link_location: where, language: locale });
      else if (href.startsWith("tel:")) track("contact_phone", { link_location: where, language: locale });
      else if (href.startsWith("mailto:")) track("contact_email", { link_location: where, language: locale });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale]);

  if (!gaId) return null;

  function choose(choice: ConsentChoice) {
    writeConsent(choice);
    setBannerOpen(false);
  }

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}

      {ready && bannerOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-text"
          className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-3xl border border-line bg-ink/90 px-5 py-4 text-bone backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:px-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p id="consent-text" className="text-sm leading-relaxed text-bone-dim">
              {UI.consent.text}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="min-w-[6.5rem] border border-line px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-bronze-dim hover:text-bronze-soft"
              >
                {UI.consent.decline}
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="min-w-[6.5rem] border border-bronze-dim px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-bone transition-colors hover:border-bronze-soft hover:text-bronze-soft"
              >
                {UI.consent.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
