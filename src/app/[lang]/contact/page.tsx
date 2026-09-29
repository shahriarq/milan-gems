import type { Metadata } from "next";
import { ContactRoute, contactMetadata } from "@/lib/contact-route";

/** English contact page: /en/contact (Italian lives at /it/contatti). */
export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  return contactMetadata((await params).lang, "en");
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  return <ContactRoute lang={(await params).lang} owner="en" />;
}
