import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";
import { CONTACT_PAGE } from "@/data/content";

export const metadata: Metadata = {
  title: CONTACT_PAGE.metaTitle,
  description: CONTACT_PAGE.metaDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Milan Gems",
    description: CONTACT_PAGE.metaDescription,
    url: "https://www.milangems.com/contact",
  },
};

export default function Page() {
  return (
    <main className="flex-1">
      <ContactPage />
    </main>
  );
}
