"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO } from "@/data/content";

/**
 * The opening shot. Full-bleed cinematic media carries the first viewport —
 * there is no card, no border, no button. Typography is reduced to a
 * wordmark, two quiet lines of context, and a scroll cue; everything else
 * is the material itself.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaScaleRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<HTMLSpanElement>(null);
  const lineBRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const textEls = [markRef.current, lineARef.current, lineBRef.current];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([mediaScaleRef.current, ...textEls, cueRef.current], { opacity: 1, clearProps: "all" });
        return;
      }

      gsap.set(mediaScaleRef.current, { scale: 1.14, opacity: 0 });
      gsap.set(textEls, { opacity: 0, y: 16 });
      gsap.set(cueRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(mediaScaleRef.current, { opacity: 1, duration: 1.8, ease: "power1.out" }, 0)
        .to(mediaScaleRef.current, { scale: 1, duration: 6, ease: "power1.out" }, 0)
        .to(markRef.current, { opacity: 1, y: 0, duration: 1.4 }, 0.9)
        .to(lineARef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.5)
        .to(lineBRef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.75)
        .to(cueRef.current, { opacity: 1, duration: 1.2 }, 2.4);

      // A continuing, near-imperceptible drift as the visitor scrolls away —
      // camera-like, not a fade-in.
      gsap.to(mediaScaleRef.current, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      gsap.to([markRef.current, lineARef.current, lineBRef.current, cueRef.current], {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "55% top", scrub: 0.6 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-ink"
    >
      <div ref={mediaScaleRef} className="absolute inset-0 will-change-transform">
        {HERO.video.src ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={HERO.video.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={HERO.video.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={HERO.media.src}
            alt={HERO.media.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* Dark cinematic grade: bottom weight, faint top fall-off, a soft
          centered vignette so the type sits in a pocket of calm. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-5% via-ink/25 via-40% to-ink/35" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,transparent_30%,rgba(7,7,7,0.55)_100%)]" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div ref={markRef} className="overflow-hidden">
          <span className="block font-serif text-[0.95rem] uppercase tracking-[0.5em] text-bone sm:text-base">
            {HERO.eyebrow}
          </span>
        </div>

        <h1 className="mt-8 flex flex-col gap-1 sm:mt-10">
          <span className="overflow-hidden">
            <span
              ref={lineARef}
              className="block font-serif text-2xl uppercase leading-tight tracking-[0.14em] text-bone sm:text-3xl md:text-4xl"
            >
              {HERO.line1}
            </span>
          </span>
          <span className="overflow-hidden">
            <span
              ref={lineBRef}
              className="block font-serif text-2xl uppercase leading-tight tracking-[0.14em] text-bronze-soft sm:text-3xl md:text-4xl"
            >
              {HERO.line2}
            </span>
          </span>
        </h1>
      </div>

      <div
        ref={cueRef}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <a
          href="#collection"
          className="flex flex-col items-center gap-3 text-[0.62rem] uppercase tracking-[0.34em] text-bone-dim transition-colors duration-500 hover:text-bronze-soft"
        >
          <span>{HERO.scrollCue}</span>
          <span className="h-9 w-px bg-gradient-to-b from-bone-dim/70 to-transparent" />
        </a>
      </div>
    </section>
  );
}
