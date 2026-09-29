"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useContent, useAnchors } from "@/i18n/LocaleProvider";
import SampleRequestForm from "./SampleRequestForm";
import SmartLink from "./SmartLink";
import CinematicVideo from "./CinematicVideo";
import OriginRoute from "./provenance/OriginRoute";

export default function B2BCTA() {
  const { anchorProps } = useAnchors();
  const { B2B_CTA, CLOSING_FILM, CLOSING_SEQUENCE, CTA } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLParagraphElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

      gsap.fromTo(
        statementRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: introRef.current, start: "top 82%" },
        }
      );

      gsap.fromTo(
        finalRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: finalRef.current, start: "top 90%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!formOpen || !formWrapRef.current) return;
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      formWrapRef.current,
      { opacity: 0, y: 16, height: 0 },
      { opacity: 1, y: 0, height: "auto", duration: 0.7, ease: "power3.out" }
    );
  }, [formOpen]);

  return (
    <section
      ref={sectionRef}
      {...anchorProps("request")}
      aria-labelledby="cta-heading"
      className="relative flex w-full flex-col items-center overflow-hidden bg-ink py-28 sm:py-36"
    >
      {/* The final scene: a dimmed reprise of the brand film — the sample
          box opening, then macro cuts of the material — so the closing
          moment feels like it belongs to the same film rather than
          dropping into a flat contact form. Trimmed before its own
          title card so it never duplicates the copy below it. */}
      <div className="absolute inset-0" aria-hidden="true">
        <div ref={bgImageRef} className="absolute inset-0 opacity-[0.22] will-change-transform">
          <CinematicVideo src={CLOSING_FILM.src} poster={CLOSING_FILM.poster} className="h-full w-full object-cover" lazy />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
        <div className="grain absolute inset-0" />
      </div>

      {/* Beat one: the brand statement — "The Collection" → a line of intent
          → the city. Sets the closing scene before the ask arrives. */}
      <div ref={statementRef} className="relative z-10 mb-20 flex max-w-2xl flex-col items-center px-6 text-center sm:mb-28">
        <span className="text-[0.72rem] uppercase tracking-[0.32em] text-bronze-soft">
          {CLOSING_SEQUENCE.kicker}
        </span>
        <p className="mt-6 text-balance font-serif tracking-[-0.01em] md:tracking-[-0.02em] text-4xl leading-[1.1] text-bone sm:text-5xl md:text-6xl">
          {CLOSING_SEQUENCE.statement}
        </p>
        {/* Origin → atelier: a small editorial transition, not a new section. */}
        <OriginRoute {...CLOSING_SEQUENCE.route} />
      </div>

      {/* Beat two: the ask. */}
      <div ref={introRef} className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
        <span className="text-[0.72rem] uppercase tracking-[0.32em] text-bronze-soft">{B2B_CTA.kicker}</span>
        <h2
          id="cta-heading"
          className="mt-6 text-balance font-serif tracking-[-0.01em] md:tracking-[-0.02em] text-4xl leading-[1.08] text-bone sm:text-5xl md:text-6xl"
        >
          {B2B_CTA.heading}
        </h2>
        <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-bone-dim">{B2B_CTA.body}</p>

        {!formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            aria-expanded={formOpen}
            className="press group relative mt-11 inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.78rem] uppercase tracking-[0.2em] text-bone transition-colors duration-400 hover:border-bronze-soft hover:text-bronze-soft"
          >
            {B2B_CTA.ctaLabel}
            <span aria-hidden="true" className="transition-transform duration-400 group-hover:translate-x-1">
              →
            </span>
          </button>
        )}
        {!formOpen && (
          <SmartLink
            href="/contact#inquiry"
            className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bronze-soft"
          >
            {CTA.or} {CTA.inquiry} →
          </SmartLink>
        )}

        {formOpen && (
          <div ref={formWrapRef} className="mt-12 w-full overflow-hidden">
            <SampleRequestForm idPrefix="home" defaultRequestType="sample-box" />
          </div>
        )}
      </div>

      {/* Beat three: the final statement, closing the film. */}
      <p
        ref={finalRef}
        className="relative z-10 mt-24 max-w-md text-balance px-6 text-center font-serif text-base italic leading-relaxed text-bone-dim sm:mt-32"
      >
        {CLOSING_SEQUENCE.finalStatement}
      </p>
    </section>
  );
}

