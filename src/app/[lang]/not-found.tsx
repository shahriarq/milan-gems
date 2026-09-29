"use client";

import { useEffect } from "react";
import SmartLink from "@/components/SmartLink";
import { useContent } from "@/i18n/LocaleProvider";

/** Localized 404 (Next.js marks it noindex automatically). */
export default function NotFound() {
  const { UI, CTA, SITE } = useContent();
  useEffect(() => {
    document.title = `${UI.notFound.title} | ${SITE.name}`;
  }, [UI.notFound.title, SITE.name]);
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-40 text-center">
      <div className="max-w-lg">
        <p className="text-[0.72rem] uppercase tracking-[0.32em] text-bronze-soft">404</p>
        <h1 className="mt-5 font-serif tracking-[-0.01em] text-4xl leading-tight text-bone sm:text-5xl">{UI.notFound.heading}</h1>
        <p className="mt-6 text-base leading-relaxed text-bone-dim">{UI.notFound.body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <SmartLink
            href="/"
            className="press border-b border-bronze-dim pb-2 text-[0.72rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-bronze-soft hover:text-bronze-soft"
          >
            {CTA.explore} →
          </SmartLink>
          <SmartLink
            href="/contact"
            className="border-b border-line pb-2 text-[0.72rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bronze-soft"
          >
            {CTA.contact} →
          </SmartLink>
        </div>
      </div>
    </main>
  );
}
