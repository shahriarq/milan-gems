import { getContent } from "@/data/content";
import type { Locale } from "@/i18n/config";
import SmartLink from "./SmartLink";

/**
 * The brand signature: a quiet three-column index (navigation, contact,
 * Milan) above a full-width MILAN GEMS wordmark set like a jeweller's
 * hallmark, then a single hairline legal line.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const { CTA, NAV_LINKS, SITE, UI } = getContent(locale);
  const year = new Date().getFullYear();
  const handle = SITE.instagram.split("/").pop();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-soft">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-10 sm:pt-24 lg:px-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <p className="text-[0.66rem] uppercase tracking-[0.3em] text-bronze-soft">{SITE.tagline}</p>
            <p className="mt-5 max-w-xs font-serif text-2xl leading-snug text-bone">
              {UI.footer.line}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-dim">{SITE.description}</p>
            <SmartLink
              href="/contact#inquiry"
              className="group mt-8 inline-flex items-center gap-3 border-b border-bronze-dim pb-2 text-[0.72rem] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-bronze-soft hover:text-bronze-soft"
            >
              {CTA.sampleBox}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </SmartLink>
          </div>

          <nav aria-label={UI.footer.label} className="md:col-span-2">
            <p className="text-[0.62rem] uppercase tracking-[0.26em] text-bone-dim/80">{UI.footer.navigate}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className="text-sm text-bone transition-colors hover:text-bronze-soft">
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="text-[0.62rem] uppercase tracking-[0.26em] text-bone-dim/80">{UI.footer.contact}</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-bone">
              <li>
                <a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-bronze-soft">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="transition-colors hover:text-bronze-soft">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze-soft">
                  Instagram <span className="text-bone-dim">@{handle}</span>
                </a>
              </li>
              <li>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bronze-soft">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <p className="text-[0.62rem] uppercase tracking-[0.26em] text-bone-dim/80">{UI.footer.studio}</p>
            <p className="mt-5 text-sm leading-relaxed text-bone">{SITE.city}</p>
            <p className="mt-1 text-sm leading-relaxed text-bone-dim">{UI.footer.studioNote}</p>
          </div>
        </div>
      </div>

      {/* Wordmark — an SVG so it spans the full width exactly at any size. */}
      <div className="mx-auto mt-20 max-w-[1600px] px-4 sm:mt-24 sm:px-8" aria-hidden="true">
        <svg viewBox="0 0 1000 118" className="block w-full select-none" role="presentation">
          <defs>
            <linearGradient id="wordmark-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e2d7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e8e2d7" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="104"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#wordmark-fade)"
            className="font-serif"
            style={{ fontSize: 132, letterSpacing: "0.06em" }}
          >
            {SITE.name.toUpperCase()}
          </text>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-2 border-t border-line pb-20 pt-7 text-[0.7rem] sm:pb-7 tracking-[0.06em] text-bone-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name} · {SITE.city}
          </p>
          <p>{UI.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
