import { NextResponse } from "next/server";

/**
 * Handles B2B inquiries and sample box requests submitted from the shared
 * inquiry form (home page closing CTA and /contact).
 *
 * This currently validates and logs the submission server-side as a
 * placeholder integration point. Wire this up to a real email/CRM provider
 * (e.g. Resend, SendGrid, HubSpot) before production launch — no outbound
 * notification is sent yet.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const required = ["name", "company", "email", "country"];
  const missing = required.filter((key) => !body[key] || String(body[key]).trim() === "");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 422 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof body.email !== "string" || !emailPattern.test(body.email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 422 });
  }

  // Placeholder: log the submission. Replace with real persistence/notification.
  console.info("[sample-request] received submission", {
    requestType: body.requestType === "b2b-inquiry" ? "b2b-inquiry" : "sample-box",
    locale: body.locale === "en" ? "en" : "it",
    name: body.name,
    company: body.company,
    email: body.email,
    country: body.country,
    materials: body.materials,
    quantity: body.quantity,
  });

  return NextResponse.json({ ok: true });
}
