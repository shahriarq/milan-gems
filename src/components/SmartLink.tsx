"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/scroll";

/**
 * A next/link that glides (through Lenis) to anchors on the current page
 * instead of jumping, and navigates normally to other pages.
 */
export default function SmartLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const [path, hash] = href.split("#");
    if (hash !== undefined && (path || pathname) === pathname) {
      e.preventDefault();
      scrollToTarget(hash ? `#${hash}` : 0);
    } else if (href === pathname) {
      e.preventDefault();
      scrollToTarget(0);
    }
  }

  return <Link href={href} onClick={handleClick} {...rest} />;
}
