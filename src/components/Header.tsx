"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";
import { useContent, useHref, useLocale } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { MailIcon, PhoneIcon, WhatsAppIcon, whatsappHref } from "./ContactIcons";

const menuIconClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone-dim transition-colors hover:border-bronze-dim hover:text-bronze-soft";

/**
 * Site header. Transparent and airy over the home hero, then settles into a
 * slim, solid sticky bar (with a hairline scroll-progress rule) once the
 * visitor has scrolled past it. On other pages it is solid after a few px.
 *
 * The mobile menu is a full-screen panel rendered as a *sibling* of
 * <header> (the header animates backdrop-filter, which would otherwise
 * become the containing block for a fixed child). It carries its own
 * visible × button, closes on Escape, backdrop click, or any link, locks
 * page scroll while open, and keeps keyboard focus inside itself.
 */
export default function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const toHref = useHref();
  const { CTA, NAV_LINKS, SITE, UI } = useContent();
  const homePath = `/${locale}`;
  const isHome = pathname === homePath;

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<Array<HTMLElement | null>>([]);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isSolid, setIsSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wasOpenRef = useRef(false);

  // Solid-state threshold + hairline progress. Progress is written straight
  // to the DOM (no React state) so scrolling never re-renders the header.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const threshold = isHome ? window.innerHeight * 0.85 : 24;
      setIsSolid(window.scrollY > threshold);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const duration = prefersReducedMotion() ? 0 : 0.7;
    gsap.to(el, {
      paddingTop: isSolid ? "0.9rem" : "2rem",
      paddingBottom: isSolid ? "0.9rem" : "2rem",
      backgroundColor: isSolid ? "rgba(7,7,7,0.88)" : "rgba(7,7,7,0)",
      backdropFilter: isSolid ? "blur(16px)" : "blur(0px)",
      borderBottomColor: isSolid ? "rgba(232,226,215,0.07)" : "rgba(232,226,215,0)",
      duration,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(logoRef.current, { scale: isSolid ? 0.92 : 1, duration, ease: "power3.out", overwrite: "auto" });
  }, [isSolid]);

  // Initial closed clip-path, set imperatively (see note in earlier
  // revisions: a JSX style would be re-applied on every re-render).
  useLayoutEffect(() => {
    if (menuPanelRef.current) gsap.set(menuPanelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Open/close animation, scroll lock and focus handling.
  useEffect(() => {
    const panel = menuPanelRef.current;
    const links = menuLinksRef.current.filter(Boolean) as HTMLElement[];
    if (!panel) return;

    setScrollLocked(isMenuOpen);

    if (isMenuOpen) {
      wasOpenRef.current = true;
      closeRef.current?.focus({ preventScroll: true });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      burgerRef.current?.focus({ preventScroll: true });
    }

    if (prefersReducedMotion()) {
      gsap.set(panel, { clipPath: isMenuOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" });
      gsap.set(links, { opacity: isMenuOpen ? 1 : 0, y: 0 });
      return;
    }

    if (isMenuOpen) {
      gsap.killTweensOf([panel, ...links]);
      gsap.set(links, { opacity: 0, y: 18 });
      gsap
        .timeline()
        .to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.inOut" })
        .to(links, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, 0.22);
    } else {
      gsap.killTweensOf([panel, ...links]);
      gsap.to(links, { opacity: 0, y: -10, duration: 0.2, stagger: 0.02, ease: "power2.in" });
      gsap.to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power3.in", delay: 0.08 });
    }
  }, [isMenuOpen]);

  // Escape to close + keep Tab focus within the open panel.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab" || !menuPanelRef.current) return;
      const focusables = Array.from(
        menuPanelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, closeMenu]);

  // Close when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && closeMenu();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  // Always release the scroll lock if the header unmounts.
  useEffect(() => () => setScrollLocked(false), []);

  /** Anchors on the current page scroll smoothly instead of jumping. */
  function handleNavClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (isMenuOpen) {
      setScrollLocked(false);
      closeMenu();
    }
    const [path, hash] = href.split("#");
    if (hash && path === pathname) {
      e.preventDefault();
      scrollToTarget(`#${hash}`);
    }
  }

  function handleLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (isMenuOpen) {
      setScrollLocked(false);
      closeMenu();
    }
    if (isHome) {
      e.preventDefault();
      scrollToTarget(0);
    }
  }

  const isActive = (href: string) => toHref(href) === pathname;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent px-6 py-8 sm:px-10 lg:px-16"
        style={{ backgroundColor: "rgba(7,7,7,0)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            ref={logoRef}
            href={homePath}
            onClick={handleLogoClick}
            aria-label={`${SITE.name} — ${UI.homeLabel}`}
            className="font-serif text-[0.95rem] tracking-[0.32em] text-bone/90 transition-colors hover:text-bronze-soft sm:text-base"
            style={{ transformOrigin: "left center" }}
          >
            {SITE.name.toUpperCase()}
          </Link>

          <nav aria-label={UI.menu.primary} className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={toHref(link.href)}
                onClick={(e) => handleNavClick(e, toHref(link.href))}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-[0.68rem] uppercase tracking-[0.22em] transition-colors duration-300 hover:text-bronze-soft ${
                  isActive(link.href) ? "text-bronze-soft" : "text-bone-dim/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="h-3 w-px bg-line" />
            <LanguageSwitcher />
          </nav>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={UI.menu.open}
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className="block h-px w-5 bg-bone" />
            <span className="block h-px w-5 bg-bone" />
            <span className="block h-px w-5 bg-bone" />
          </button>
        </div>

        {/* Hairline scroll-progress rule — only visible once the bar is solid. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px transition-opacity duration-500 ${
            isSolid ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={progressRef} className="h-full origin-left bg-bronze-soft/70" style={{ transform: "scaleX(0)" }} />
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={menuPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label={UI.menu.label}
        inert={!isMenuOpen}
        onClick={(e) => {
          // Backdrop click: anything that isn't a link or button closes.
          if (!(e.target as HTMLElement).closest("a, button")) closeMenu();
        }}
        className={`fixed inset-0 z-[60] flex flex-col bg-ink md:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href={homePath}
            onClick={handleLogoClick}
            className="font-serif text-[0.95rem] tracking-[0.32em] text-bone/90"
          >
            {SITE.name.toUpperCase()}
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={closeMenu}
            aria-label={UI.menu.close}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-bronze-soft"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label={UI.menu.mobile} className="flex flex-1 flex-col items-center justify-center gap-9">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={toHref(link.href)}
              ref={(el) => {
                menuLinksRef.current[i] = el;
              }}
              onClick={(e) => handleNavClick(e, toHref(link.href))}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`font-serif text-3xl transition-colors hover:text-bronze-soft ${
                isActive(link.href) ? "text-bronze-soft" : "text-bone"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3 px-6 pb-10 text-center">
          <div className="mb-5">
            <LanguageSwitcher
              size="lg"
              onSwitch={() => {
                setScrollLocked(false);
                closeMenu();
              }}
            />
          </div>
          <Link
            href={toHref("/contact#inquiry")}
            onClick={(e) => handleNavClick(e, toHref("/contact#inquiry"))}
            className="border-b border-bronze-dim pb-1.5 text-[0.72rem] uppercase tracking-[0.22em] text-bone"
          >
            {CTA.sampleBox} →
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <a href={`mailto:${SITE.email}`} aria-label={`${UI.contact.email}: ${SITE.email}`} className={menuIconClass}>
              <MailIcon size={17} />
            </a>
            <a href={SITE.phoneHref} aria-label={`${UI.contact.phone}: ${SITE.phone}`} className={menuIconClass}>
              <PhoneIcon size={17} />
            </a>
            <a
              href={whatsappHref(SITE.whatsapp, UI.contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={UI.contact.whatsapp}
              className={menuIconClass}
            >
              <WhatsAppIcon size={17} />
            </a>
          </div>
          <p className="text-[0.66rem] uppercase tracking-[0.3em] text-bone-dim/70">{SITE.city}</p>
        </div>
      </div>
    </>
  );
}
