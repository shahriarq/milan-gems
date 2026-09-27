"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { NAV_LINKS, SITE } from "@/data/content";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<Array<HTMLElement | null>>([]);
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    gsap.to(el, {
      paddingTop: isCompact ? "0.85rem" : "1.75rem",
      paddingBottom: isCompact ? "0.85rem" : "1.75rem",
      backgroundColor: isCompact ? "rgba(8,8,10,0.88)" : "rgba(8,8,10,0)",
      backdropFilter: isCompact ? "blur(14px)" : "blur(0px)",
      borderBottomColor: isCompact ? "rgba(242,237,228,0.1)" : "rgba(242,237,228,0)",
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(logoRef.current, {
      scale: isCompact ? 0.92 : 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [isCompact]);

  // Set the panel's initial (closed) clip-path imperatively, once, before
  // paint — never as a React-managed inline style. If it were a plain JSX
  // `style` prop, any unrelated re-render of Header (e.g. the scroll-driven
  // isCompact updates above) would reset it mid-animation, since React
  // reconciles that literal value back onto the DOM node every render.
  useLayoutEffect(() => {
    if (menuPanelRef.current) {
      gsap.set(menuPanelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
    }
  }, []);

  // Mobile menu: a clip-path wipe for the panel plus a staggered rise for
  // the links, rather than a flat opacity cross-fade.
  useEffect(() => {
    const panel = menuPanelRef.current;
    const links = menuLinksRef.current.filter(Boolean) as HTMLElement[];
    if (!panel) return;

    if (prefersReducedMotion()) {
      gsap.set(panel, { clipPath: isMenuOpen ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" });
      gsap.set(links, { opacity: isMenuOpen ? 1 : 0 });
      return;
    }

    if (isMenuOpen) {
      gsap.set(panel, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(links, { opacity: 0, y: 18 });
      gsap
        .timeline()
        .to(panel, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "power4.inOut" })
        .to(links, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, 0.25);
    } else {
      gsap.to(links, { opacity: 0, y: -10, duration: 0.25, stagger: 0.03, ease: "power2.in" });
      gsap.to(panel, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.45,
        ease: "power3.in",
        delay: 0.1,
      });
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 inset-x-0 z-50 border-b border-transparent px-6 sm:px-10 lg:px-16 py-7"
        style={{ backgroundColor: "rgba(8,8,10,0)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            ref={logoRef}
            href="#top"
            className="font-serif text-lg sm:text-xl tracking-[0.14em] text-bone transition-colors hover:text-gold-soft"
            style={{ transformOrigin: "left center" }}
          >
            {SITE.name.toUpperCase()}
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-[0.8rem] tracking-[0.12em] uppercase text-bone-dim transition-colors hover:text-gold-soft"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold-soft transition-transform duration-400 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden relative z-[70] flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${
                isMenuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${
                isMenuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Rendered as a sibling of <header>, not a descendant — the header
          animates backdrop-filter/transform, either of which would create a
          new CSS containing block and trap this fixed-position panel inside
          the header's own (much shorter) box instead of the viewport. */}
      <div
        id="mobile-nav"
        ref={menuPanelRef}
        className={`md:hidden fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-ink ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              menuLinksRef.current[i] = el;
            }}
            onClick={() => setIsMenuOpen(false)}
            className="font-serif text-2xl text-bone transition-colors hover:text-gold-soft"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
