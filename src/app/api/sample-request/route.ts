import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/** Strip control characters / line breaks (header-injection safe) and cap length. */
const clean = (v: unknown, max = 200) =>
  String(v ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
const cleanLong = (v: unknown, max = 4000) =>
  String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);

/**
 * Handles B2B inquiries and sample box requests from the shared inquiry form
 * (home page closing CTA and /contact) and emails them through the Namecheap
 * Private Email mailbox over SMTP.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   SMTP_USER   mailbox address, e.g. info@milangems.com   (required)
 *   SMTP_PASS   that mailbox's password                    (required)
 *   SMTP_HOST   default mail.privateemail.com
 *   SMTP_PORT   default 465 (SSL)
 *   CONTACT_TO  where inquiries are delivered, default SMTP_USER
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

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error("[sample-request] SMTP_USER / SMTP_PASS are not configured");
    return NextResponse.json({ error: "Mail is not configured." }, { status: 503 });
  }

  const type = body.requestType === "b2b-inquiry" ? "B2B inquiry" : "Sample box request";
  const lang = body.locale === "en" ? "EN" : "IT";
  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 200);
  const country = clean(body.country, 100);
  const materials = Array.isArray(body.materials) ? body.materials.map((m) => clean(m, 60)).join(", ") : "";
  const quantity = clean(body.quantity, 120);
  const message = cleanLong(body.message);

  const text = [
    `Type: ${type}`,
    `Language: ${lang}`,
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Country: ${country}`,
    `Materials: ${materials || "—"}`,
    `Quantity: ${quantity || "—"}`,
    "",
    "Message:",
    message || "—",
  ].join("\n");

  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "mail.privateemail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transport.sendMail({
      from: `"Milan Gems website" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `[Milan Gems] ${type} — ${company}`,
      text,
    });
  } catch (err) {
    console.error("[sample-request] mail send failed", err);
    return NextResponse.json({ error: "Could not send the request." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
