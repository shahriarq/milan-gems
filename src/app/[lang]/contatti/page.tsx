import type { Metadata } from "next";
import { ContactRoute, contactMetadata } from "@/lib/contact-route";

/** Italian contact page: /it/contatti (English lives at /en/contact). */
export async function generateMetadata({ params }: PageProps<"/[lang]/contatti">): Promise<Metadata> {
  return contactMetadata((await params).lang, "it");
}

export default async function Page({ params }: PageProps<"/[lang]/contatti">) {
  return <ContactRoute lang={(await params).lang} owner="it" />;
}
