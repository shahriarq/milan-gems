"use client";

import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { B2B_CTA, CONTACT_FORM_FIELDS, HERO } from "@/data/content";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function B2BCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

      gsap.fromTo(
        [introRef.current, formRef.current],
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const materials = data.getAll("materials");

    try {
      const res = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          country: data.get("country"),
          materials,
          quantity: data.get("quantity"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-line-soft bg-ink py-28 sm:py-36"
    >
      {/* Atmosphere: a dimmed reprise of the hero specimen, grounding the
          closing moment in the same visual world rather than dropping to a
          flat form on black. */}
      <div className="absolute inset-0" aria-hidden="true">
        <div ref={bgImageRef} className="absolute inset-0 opacity-[0.16] will-change-transform">
          <Image src={HERO.media.src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/92 to-ink" />
        <div className="grain absolute inset-0" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 hidden border border-line sm:block sm:inset-6 lg:inset-8"
      >
        <span className="absolute -top-px -left-px h-4 w-4 border-t border-l border-gold-soft/50" />
        <span className="absolute -top-px -right-px h-4 w-4 border-t border-r border-gold-soft/50" />
        <span className="absolute -bottom-px -left-px h-4 w-4 border-b border-l border-gold-soft/50" />
        <span className="absolute -bottom-px -right-px h-4 w-4 border-b border-r border-gold-soft/50" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-12 lg:px-16">
        <div ref={introRef} className="lg:col-span-5">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-8 bg-gold-soft" />
            <span className="text-[0.75rem] uppercase tracking-[0.28em] text-gold-soft">
              {B2B_CTA.kicker}
            </span>
          </div>
          <h2
            id="cta-heading"
            ref={headingRef}
            className="text-balance font-serif text-3xl leading-[1.1] text-bone sm:text-4xl md:text-5xl"
          >
            {B2B_CTA.heading}
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-bone-dim">{B2B_CTA.body}</p>

          <div className="mt-12 hidden flex-col gap-3 border-t border-line-soft pt-8 sm:flex">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-bone-dim">Milan Gems</p>
            <p className="font-serif text-lg text-gold-soft">Milan, Italy</p>
          </div>
        </div>

        <div ref={formRef} className="lg:col-span-7">
          {state === "success" ? (
            <div className="flex flex-col items-start gap-5 border border-gold-dim/50 bg-slate/60 p-8 backdrop-blur-sm sm:p-12">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-soft text-gold-soft">
                ✓
              </span>
              <div>
                <p className="font-serif text-2xl text-bone">Request received.</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-bone-dim">
                  Thank you — we will review your request and follow up regarding a curated sample
                  selection for professional review.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 border border-line-soft bg-slate/40 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-10"
              noValidate
            >
              <Field label="Name" name="name" required autoComplete="name" />
              <Field label="Company / Atelier" name="company" required autoComplete="organization" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Country" name="country" required autoComplete="country-name" />

              <fieldset className="sm:col-span-2">
                <legend className="mb-3 text-[0.7rem] uppercase tracking-[0.1em] text-bone-dim">
                  Materials of Interest
                </legend>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {CONTACT_FORM_FIELDS.materialsOfInterest.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm text-bone">
                      <input
                        type="checkbox"
                        name="materials"
                        value={m}
                        className="h-4 w-4 border border-line-soft bg-transparent accent-[#c5a059]"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Approximate Quantity" name="quantity" autoComplete="off" />
              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-2 block text-[0.7rem] uppercase tracking-[0.1em] text-bone-dim">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-gold-soft"
                />
              </div>

              {state === "error" && errorMessage && (
                <p role="alert" className="sm:col-span-2 text-sm text-red-400">
                  {errorMessage}
                </p>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="group relative inline-flex w-full items-center justify-center overflow-hidden border border-gold bg-gold px-8 py-4 text-[0.8rem] uppercase tracking-[0.16em] text-ink transition-colors duration-500 disabled:opacity-60 sm:w-auto"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gold-soft transition-transform duration-500 ease-out group-hover:translate-x-0" />
                  <span className="relative">{state === "submitting" ? "Sending…" : B2B_CTA.ctaLabel}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[0.7rem] uppercase tracking-[0.1em] text-bone-dim">
        {label}
        {required && <span className="text-gold-soft"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-line-soft bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-gold-soft"
      />
    </div>
  );
}
