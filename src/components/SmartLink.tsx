"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";
import { useHref } from "@/i18n/LocaleProvider";

/**
 * A next/link that (1) prefixes internal hrefs with the current locale —
 * callers pass neutral paths like "/#about" or "/contact" — and (2) glides
 * through Lenis to anchors on the current page instead of jumping.
 */
export default function SmartLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  const toHref = useHref();
  const target = toHref(href);

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const [path, hash] = target.split("#");
    if (hash !== undefined && path === pathname) {
      e.preventDefault();
      scrollToTarget(hash ? `#${hash}` : 0);
    } else if (target === pathname) {
      e.preventDefault();
      scrollToTarget(0);
    }
  }

  return <Link href={target} onClick={handleClick} {...rest} />;
}
