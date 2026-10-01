"use client";

import { useState, type FormEvent } from "react";
import type { RequestType } from "@/data/content";
import { useContent, useLocale } from "@/i18n/LocaleProvider";
import { track } from "@/lib/analytics";

type SubmitState = "idle" | "submitting" | "success" | "error";

interface SampleRequestFormProps {
  /** Controlled request type (contact page); uncontrolled when omitted. */
  requestType?: RequestType;
  onRequestTypeChange?: (value: RequestType) => void;
  defaultRequestType?: RequestType;
  /** Prefix for input ids, so two forms could coexist without id clashes. */
  idPrefix?: string;
}

/**
 * The single B2B inquiry / sample box form used across the site (home page
 * closing CTA and /contact), posting to /api/sample-request.
 */
export default function SampleRequestForm({
  requestType,
  onRequestTypeChange,
  defaultRequestType = "sample-box",
  idPrefix = "req",
}: SampleRequestFormProps) {
  const { CONTACT_FORM_FIELDS, CONTACT_PAGE, CTA, UI } = useContent();
  const locale = useLocale();
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localType, setLocalType] = useState<RequestType>(defaultRequestType);
  const currentType = requestType ?? localType;

  function setType(v: RequestType) {
    if (onRequestTypeChange) onRequestTypeChange(v);
    else setLocalType(v);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("submitting");
    setErrorMessage(null);

    const data = new FormData(form);
    try {
      const res = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: currentType,
          locale,
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          country: data.get("country"),
          materials: data.getAll("materials"),
          quantity: data.get("quantity"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        throw new Error(UI.form.genericError);
      }
      setState("success");
      track("generate_lead", { request_type: currentType, form_location: idPrefix, language: locale });
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : UI.form.genericError);
    }
  }

  if (state === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <span className="text-sm uppercase tracking-[0.18em] text-bronze-soft">{UI.form.received}</span>
        <p className="max-w-md text-sm leading-relaxed text-bone-dim">{CONTACT_PAGE.success}</p>
      </div>
    );
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 text-left sm:grid-cols-2" noValidate>
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">{UI.form.requestType}</legend>
        <div className="flex flex-wrap gap-3">
          {CONTACT_FORM_FIELDS.requestTypes.map((t) => {
            const checked = currentType === t.value;
            return (
              <label
                key={t.value}
                className={`cursor-pointer border px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-bronze-soft ${
                  checked ? "border-bronze-soft text-bone" : "border-line text-bone-dim hover:border-bronze-dim"
                }`}
              >
                <input
                  type="radio"
                  name="requestType"
                  value={t.value}
                  checked={checked}
                  onChange={() => setType(t.value as RequestType)}
                  className="sr-only"
                />
                {t.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field id={id("name")} label={UI.form.name} name="name" required autoComplete="name" />
      <Field id={id("company")} label={UI.form.company} name="company" required autoComplete="organization" />
      <Field id={id("email")} label={UI.form.email} name="email" type="email" required autoComplete="email" />
      <Field id={id("country")} label={UI.form.country} name="country" required autoComplete="country-name" />

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">{UI.form.materials}</legend>
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

      <Field id={id("quantity")} label={UI.form.quantity} name="quantity" autoComplete="off" />
      <div className="sm:col-span-2">
        <label htmlFor={id("message")} className="mb-2 block text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">
          {UI.form.message}
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={3}
          className="w-full border-b border-line bg-transparent py-2 text-base text-bone outline-none transition-colors focus:border-bronze-soft sm:text-sm"
        />
      </div>

      {state === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-400 sm:col-span-2">
          {errorMessage}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="group relative mt-2 inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.78rem] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-bronze-soft hover:text-bronze-soft disabled:opacity-60"
        >
          {state === "submitting" ? CTA.submitting : CTA.submit}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.66rem] uppercase tracking-[0.14em] text-bone-dim">
        {label}
        {required && <span className="text-bronze-soft"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full border-b border-line bg-transparent py-2 text-base text-bone outline-none transition-colors focus:border-bronze-soft sm:text-sm"
      />
    </div>
  );
}
