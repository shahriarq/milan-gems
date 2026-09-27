"use client";

import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { B2B_CTA, CLOSING_SEQUENCE, CONTACT_FORM_FIELDS, HERO } from "@/data/content";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function B2BCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLParagraphElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      className="relative flex w-full flex-col items-center overflow-hidden bg-ink py-28 sm:py-36"
    >
      {/* The final scene: a dimmed reprise of the opening material, dark and
          quiet, so the closing moment feels like it belongs to the same
          film rather than dropping into a flat contact form. */}
      <div className="absolute inset-0" aria-hidden="true">
        <div ref={bgImageRef} className="absolute inset-0 opacity-[0.22] will-change-transform">
          <Image src={HERO.media.src} alt="" fill sizes="100vw" className="object-cover" />
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
        <p className="mt-6 text-balance font-serif text-4xl leading-[1.1] text-bone sm:text-5xl md:text-6xl">
          {CLOSING_SEQUENCE.statement}
        </p>
        <p className="mt-5 text-sm uppercase tracking-[0.4em] text-bone-dim">{CLOSING_SEQUENCE.city}</p>
      </div>

      {/* Beat two: the ask. */}
      <div ref={introRef} className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
        <span className="text-[0.72rem] uppercase tracking-[0.32em] text-bronze-soft">{B2B_CTA.kicker}</span>
        <h2
          id="cta-heading"
          className="mt-6 text-balance font-serif text-4xl leading-[1.08] text-bone sm:text-5xl md:text-6xl"
        >
          {B2B_CTA.heading}
        </h2>
        <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-bone-dim">{B2B_CTA.body}</p>

        {state === "success" ? (
          <div className="mt-12 flex flex-col items-center gap-3">
            <span className="text-sm uppercase tracking-[0.18em] text-bronze-soft">Request Received</span>
            <p className="max-w-sm text-sm leading-relaxed text-bone-dim">
              We will review your request and follow up regarding a curated sample selection for
              professional review.
            </p>
          </div>
        ) : (
          <>
            {!formOpen && (
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="group relative mt-11 inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.78rem] uppercase tracking-[0.2em] text-bone transition-colors duration-400 hover:border-bronze-soft hover:text-bronze-soft"
              >
                {B2B_CTA.ctaLabel}
                <span aria-hidden="true" className="transition-transform duration-400 group-hover:translate-x-1">
                  →
                </span>
              </button>
            )}

            {formOpen && (
              <div ref={formWrapRef} className="mt-12 w-full overflow-hidden text-left">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 sm:grid-cols-2" noValidate>
                  <Field label="Name" name="name" required autoComplete="name" />
                  <Field label="Company / Atelier" name="company" required autoComplete="organization" />
                  <Field label="Email" name="email" type="email" required autoComplete="email" />
                  <Field label="Country" name="country" required autoComplete="country-name" />

                  <fieldset className="sm:col-span-2">
                    <legend className="mb-3 text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">
                      Materials of Interest
                    </legend>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {CONTACT_FORM_FIELDS.materialsOfInterest.map((m) => (
                        <label key={m} className="flex items-center gap-2 text-sm text-bone">
                          <input
                            type="checkbox"
                            name="materials"
                            value={m}
                            className="h-4 w-4 border border-line-soft bg-transparent accent-[#9b7b4a]"
                          />
                          {m}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field label="Approximate Quantity" name="quantity" autoComplete="off" />
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-2 block text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full border-b border-line-soft bg-transparent py-2 text-sm text-bone outline-none transition-colors focus:border-bronze-soft"
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
                      className="group relative mt-2 inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.78rem] uppercase tracking-[0.2em] text-bone transition-colors duration-400 hover:border-bronze-soft hover:text-bronze-soft disabled:opacity-60"
                    >
                      {state === "submitting" ? "Sending…" : "Submit Request"}
                      <span aria-hidden="true" className="transition-transform duration-400 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
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
      <label htmlFor={name} className="mb-2 block text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">
        {label}
        {required && <span className="text-bronze-soft"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border-b border-line-soft bg-transparent py-2 text-sm text-bone outline-none transition-colors focus:border-bronze-soft"
      />
    </div>
  );
}
