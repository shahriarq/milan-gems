"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { HERO } from "@/data/content";
import { STONES } from "@/data/stones";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineLinesRef = useRef<Array<HTMLSpanElement | null>>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Headline split into visual lines for a per-line mask reveal — closer to
  // an editorial magazine cover than a single fade-up block.
  const headlineLines = HERO.headline.split(". ").map((s, i, arr) => (i < arr.length - 1 ? `${s}.` : s));

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const allTextEls = [eyebrowRef.current, subRef.current, ctaRef.current, indexRef.current];
    const lineEls = headlineLinesRef.current.filter(Boolean) as HTMLSpanElement[];

    let cleanupTilt: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([imageWrapRef.current, frameRef.current, ...allTextEls, ...lineEls], {
          opacity: 1,
          clearProps: "all",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set(imageWrapRef.current, { clipPath: "inset(0% 0% 100% 0%)" })
        .set(imageRef.current, { scale: 1.28 })
        .set(frameRef.current, { opacity: 0 })
        .set(lineEls, { yPercent: 115 })
        .set(allTextEls, { opacity: 0, y: 22 })
        .to(imageWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.7, ease: "power4.inOut" }, 0.05)
        .to(imageRef.current, { scale: 1.06, duration: 2.6, ease: "power2.out" }, 0.05)
        .to(frameRef.current, { opacity: 1, duration: 1.2 }, 0.5)
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.65)
        .to(lineEls, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out" }, 0.78)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.25)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.42)
        .to(indexRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.55)
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.7);

      // Multi-layer parallax as the user scrolls past the hero: the image
      // drifts slower than the frame/text so depth reads even at rest.
      // Mobile gets shallower travel — enough to read as intentional, not
      // enough to fight a shrinking/growing viewport as browser chrome
      // shows or hides during scroll.
      const isMobile = window.innerWidth < 768;
      const distance = isMobile ? 0.5 : 1;

      gsap.to(imageRef.current, {
        scale: isMobile ? 1.1 : 1.2,
        y: -50 * distance,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      gsap.to(frameRef.current, {
        y: -20 * distance,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "60% top", scrub: 0.6 },
      });

      gsap.to([eyebrowRef.current, ...lineEls, subRef.current, ctaRef.current], {
        y: -70 * distance,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "65% top", scrub: 0.6 },
      });

      gsap.to(indexRef.current, {
        y: -30 * distance,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "40% top", scrub: 0.6 },
      });

      gsap.to(scrollCueRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "12% top", scrub: 0.6 },
      });

      // Subtle mouse-parallax "tilt" for depth — desktop, fine-pointer only.
      // Transform-only (translate), GPU-cheap, and skipped entirely on touch.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && tiltRef.current) {
        const xTo = gsap.quickTo(tiltRef.current, "x", { duration: 0.9, ease: "power3.out" });
        const yTo = gsap.quickTo(tiltRef.current, "y", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          xTo(((e.clientX / innerWidth) - 0.5) * -18);
          yTo(((e.clientY / innerHeight) - 0.5) * -12);
        };
        const el = sectionRef.current;
        el?.addEventListener("mousemove", onMove);
        cleanupTilt = () => el?.removeEventListener("mousemove", onMove);
      }
    }, sectionRef);

    return () => {
      cleanupTilt?.();
      ctx.revert();
    };
  }, [headlineLines.length]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink"
    >
      <div ref={imageWrapRef} className="absolute inset-0">
        <div ref={tiltRef} className="absolute -inset-[3%]">
          <div ref={imageRef} className="absolute inset-0 will-change-transform">
            <Image
              src={HERO.media.src}
              alt={HERO.media.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        {/* Layered depth: vignette + directional light + grain, static so the
            image parallax reads clearly against them. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/45 via-45% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(8,8,10,0.55)_100%)]" />
        <div className="grain absolute inset-0" />
      </div>

      {/* Museum-label frame: thin inset border with corner ticks, a quiet
          cue that this is a curated specimen rather than a stock banner. */}
      <div
        ref={frameRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 hidden border border-line sm:block sm:inset-6 lg:inset-8"
      >
        <span className="absolute -top-px -left-px h-4 w-4 border-t border-l border-gold-soft/70" />
        <span className="absolute -top-px -right-px h-4 w-4 border-t border-r border-gold-soft/70" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-gold-soft/70" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-gold-soft/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16 lg:pb-28">
        <div ref={eyebrowRef} className="mb-6 flex items-center gap-4">
          <span className="h-px w-8 bg-gold-soft" />
          <span className="text-[0.75rem] uppercase tracking-[0.32em] text-gold-soft">{HERO.eyebrow}</span>
        </div>

        <h1 className="max-w-4xl font-serif text-4xl leading-[1.1] text-bone sm:text-5xl md:text-6xl lg:text-7xl">
          {headlineLines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                ref={(el) => {
                  headlineLinesRef.current[i] = el;
                }}
                className="block text-balance will-change-transform"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p ref={subRef} className="mt-6 max-w-xl text-balance text-base leading-relaxed text-bone-dim sm:text-lg">
          {HERO.sub}
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={HERO.primaryCta.href}
            className="group relative inline-flex items-center justify-center overflow-hidden border border-gold bg-gold px-8 py-4 text-[0.8rem] uppercase tracking-[0.16em] text-ink transition-colors duration-500 hover:border-gold-soft"
          >
            <span className="absolute inset-0 -translate-x-full bg-gold-soft transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative">{HERO.primaryCta.label}</span>
          </a>
          <a
            href={HERO.secondaryCta.href}
            className="inline-flex items-center justify-center border border-line px-8 py-4 text-[0.8rem] uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft"
          >
            {HERO.secondaryCta.label}
          </a>
        </div>

        {/* Quiet material index — reads like a magazine cover's contents
            strip; ties the hero to the collection without new copy claims.
            Mobile gets its own compact, swipeable version rather than a
            shrunk copy of the desktop row. */}
        <div
          ref={indexRef}
          className="mt-12 flex gap-6 overflow-x-auto border-t border-line-soft pt-4 [scrollbar-width:none] sm:mt-14 sm:gap-8 sm:overflow-visible sm:pt-5"
        >
          {STONES.map((s, i) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="group flex shrink-0 items-baseline gap-2 text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim transition-colors hover:text-gold-soft sm:text-[0.68rem]"
            >
              <span className="font-serif text-gold-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className="border-b border-transparent group-hover:border-gold-soft/60">{s.name}</span>
            </a>
          ))}
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        aria-hidden="true"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-bone-dim">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold-soft to-transparent" />
      </div>
    </section>
  );
}
