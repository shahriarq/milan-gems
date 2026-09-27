import { FOOTER, NAV_LINKS, SITE } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line-soft bg-ink-soft py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-xl tracking-[0.1em] text-bone">{FOOTER.name.toUpperCase()}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-gold-soft">{FOOTER.tagline}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-dim">{FOOTER.body}</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.1em] text-bone-dim hover:text-gold-soft transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm text-bone-dim">
            <a href={`mailto:${SITE.email}`} className="hover:text-gold-soft transition-colors">
              {SITE.email}
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-soft transition-colors"
            >
              Instagram
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-soft transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line-soft pt-6 text-xs text-bone-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. {SITE.city}.</p>
          <p>All specifications and availability subject to review.</p>
        </div>
      </div>
    </footer>
  );
}
