import type { Metadata } from "next";
// Self-hosted via @fontsource (no external network calls at build/runtime) —
// next/font/google requires fetching fonts.googleapis.com, which is not
// reachable in restricted network environments.
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { SITE } from "@/data/content";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.milangems.com"),
  title: {
    default: "Milan Gems — Iranian Gemstones & Natural Materials for Jewelry Professionals",
    template: "%s | Milan Gems",
  },
  description:
    "Milan Gems sources Persian turquoise, Iranian agate, garnet, and meteorite for bespoke jewelry ateliers, master jewelers, and professional buyers across Europe. B2B gemstone supply, Milan.",
  keywords: [
    "Iranian gemstones",
    "Persian turquoise",
    "Neyshabur turquoise",
    "Iranian agate",
    "Iranian garnet",
    "gemstones for jewelry designers",
    "B2B gemstone supplier Milan",
    "wholesale gemstones Italy",
  ],
  openGraph: {
    title: "Milan Gems — Iranian Gemstones & Natural Materials",
    description:
      "Rare materials, ancient origins, exceptional craft. Selected Iranian gemstones sourced for bespoke jewelry makers and professional buyers.",
    url: "https://www.milangems.com",
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milan Gems — Iranian Gemstones & Natural Materials",
    description:
      "Rare materials, ancient origins, exceptional craft. Selected Iranian gemstones sourced for bespoke jewelry makers and professional buyers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink text-bone font-sans">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
