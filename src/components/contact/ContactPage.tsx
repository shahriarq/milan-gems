"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import type { RequestType } from "@/data/content";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import SampleRequestForm from "../SampleRequestForm";
import CinematicVideo from "../CinematicVideo";

/**
 * /contact — a cinematic opening (the sample-box film, dimmed), the Sample
 * Box proposition, then the B2B inquiry form beside direct contact details
 * and Milan information. Both hero CTAs preset the form's request type and
 * glide down to it.
 */
export default function ContactPage() {
  const { CLOSING_FILM, CONTACT_PAGE, CTA, SITE, UI } = useContent();
  const [requestType, setRequestType] = useState<RequestType>("sample-box");
  const rootRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);

  function goToForm(type: RequestType) {
    setRequestType(type);
    scrollToTarget("#inquiry");
  }

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(heroMediaRef.current, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" });
      gsap.fromTo(
        "[data-hero-line]",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out", delay: 0.5 }
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section
        aria-labelledby="contact-heading"
        className="relative flex min-h-[88svh] w-full items-end overflow-hidden bg-ink pb-16 pt-32 sm:items-center sm:pb-0"
      >
        <div ref={heroMediaRef} className="absolute inset-0 will-change-transform" aria-hidden="true">
          <CinematicVideo src={CLOSING_FILM.src} poster={CONTACT_PAGE.heroPoster} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent via-45% to-ink/30" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,transparent_40%,rgba(7,7,7,0.35)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="text-scrim-soft inline-block max-w-2xl px-6 py-8 sm:px-10 sm:py-10">
            <p data-hero-line className="text-[0.72rem] uppercase tracking-[0.32em] text-bronze-soft">
              {CONTACT_PAGE.kicker}
            </p>
            <h1
              id="contact-heading"
              data-hero-line
              className="mt-5 font-serif text-4xl leading-[1.05] text-bone sm:text-5xl md:text-6xl"
            >
              {CONTACT_PAGE.heading}
            </h1>
            <p data-hero-line className="mt-6 max-w-lg text-base leading-relaxed text-bone-dim">
              {CONTACT_PAGE.intro}
            </p>
            <div data-hero-line className="mt-9 flex flex-wrap items-center gap-x-9 gap-y-5">
              <CtaButton onClick={() => goToForm("sample-box")}>{CTA.sampleBox}</CtaButton>
              <CtaButton onClick={() => goToForm("b2b-inquiry")} quiet>
                {CTA.inquiry}
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Box */}
      <section id="sample-box" aria-labelledby="sample-box-heading" className="bg-ink py-20 sm:py-28 lg:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 md:grid-cols-2 lg:gap-20 lg:px-16">
          <div data-reveal className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft">
            <Image
              src={CONTACT_PAGE.sampleBox.image.src}
              alt={CONTACT_PAGE.sampleBox.image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div data-reveal>
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-bronze-soft">{CONTACT_PAGE.sampleBox.kicker}</p>
            <h2 id="sample-box-heading" className="mt-4 font-serif text-3xl leading-tight text-bone sm:text-4xl md:text-5xl">
              {CONTACT_PAGE.sampleBox.heading}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bone-dim">{CONTACT_PAGE.sampleBox.body}</p>
            <ul className="mt-8 flex max-w-md flex-col divide-y divide-line border-y border-line">
              {CONTACT_PAGE.sampleBox.points.map((p) => (
                <li key={p} className="flex items-baseline gap-4 py-3.5 text-sm text-bone">
                  <span aria-hidden="true" className="h-px w-4 shrink-0 translate-y-[-3px] bg-bronze-soft" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton onClick={() => goToForm("sample-box")}>{CTA.sampleBox}</CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry form + details */}
      <section
        id="inquiry"
        aria-labelledby="inquiry-heading"
        className="border-t border-line bg-ink-soft py-20 sm:py-28 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-16">
          <aside data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[0.72rem] uppercase tracking-[0.3em] text-bronze-soft">{CONTACT_PAGE.inquiry.kicker}</p>
            <h2 id="inquiry-heading" className="mt-4 font-serif text-3xl leading-tight text-bone sm:text-4xl">
              {CONTACT_PAGE.inquiry.heading}
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-bone-dim">{CONTACT_PAGE.inquiry.body}</p>

            <dl className="mt-12 grid max-w-sm grid-cols-1 gap-7 border-t border-line pt-10">
              <Detail term={UI.contact.email}>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-bronze-soft">
                  {SITE.email}
                </a>
              </Detail>
              <Detail term={UI.contact.phone}>
                <a href={SITE.phoneHref} className="transition-colors hover:text-bronze-soft">
                  {SITE.phone}
                </a>
              </Detail>
              <Detail term={UI.contact.instagram}>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze-soft">
                  @{SITE.instagram.split("/").pop()}
                </a>
              </Detail>
              <Detail term={UI.contact.linkedin}>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze-soft">
                  {SITE.name}
                </a>
              </Detail>
              <Detail term={CONTACT_PAGE.details.heading}>
                <span className="block">{SITE.city}</span>
                <MilanTime />
                <span className="mt-2 block text-sm leading-relaxed text-bone-dim">{CONTACT_PAGE.details.body}</span>
              </Detail>
            </dl>
          </aside>

          <div data-reveal>
            <SampleRequestForm
              idPrefix="contact"
              requestType={requestType}
              onRequestTypeChange={setRequestType}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CtaButton({ children, onClick, quiet = false }: { children: ReactNode; onClick: () => void; quiet?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 border-b pb-2 text-[0.76rem] uppercase tracking-[0.2em] transition-colors duration-300 hover:border-bronze-soft hover:text-bronze-soft ${
        quiet ? "border-line text-bone-dim" : "border-bronze-dim text-bone"
      }`}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.62rem] uppercase tracking-[0.24em] text-bone-dim">{term}</dt>
      <dd className="mt-2 font-serif text-lg text-bone">{children}</dd>
    </div>
  );
}

/** Local time in Milan, rendered after mount to avoid hydration mismatch. */
function MilanTime() {
  const locale = useLocale();
  const { UI } = useContent();
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [locale]);
  return (
    <span className="mt-1 block text-sm tracking-[0.08em] text-bone-dim" aria-live="off">
      {time ? `${UI.contact.localTime} ${time}` : "\u00a0"}
    </span>
  );
}
