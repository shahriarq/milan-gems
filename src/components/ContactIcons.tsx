import type { SVGProps } from "react";

/**
 * Hairline contact icons drawn to match the site's 1.2px line language.
 * All inherit `currentColor` and are decorative (aria-hidden) — the text
 * beside them carries the meaning.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="M3.6 6.6 12 12.9l8.4-6.3" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6.6 3.5h2.6l1.4 4-1.9 1.3a11 11 0 0 0 6.5 6.5l1.3-1.9 4 1.4v2.6a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1z" />
    </Base>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.4a8.6 8.6 0 0 0-7.4 13l-1.1 4.2 4.3-1.1A8.6 8.6 0 1 0 12 3.4z" />
      <path
        strokeWidth={1}
        d="M9.1 8.2c.2-.3.5-.4.8-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5a5.5 5.5 0 0 0 2.3 2.2c.2.1.4.1.5-.1l.6-.6c.2-.2.4-.2.7-.1l1.4.6c.3.1.4.3.4.6v.5c0 .3-.1.6-.4.8-.6.4-1.4.5-2.1.3a6.8 6.8 0 0 1-4.5-4.4c-.2-.7-.1-1.5.3-2.1z"
      />
    </Base>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8 10.5v6M11.5 16.5v-6M11.5 13.1c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3.4" />
      <circle cx="8" cy="7.6" r="0.4" fill="currentColor" />
    </Base>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.3" />
    </Base>
  );
}

/** wa.me link with a pre-filled, localized opening message. */
export function whatsappHref(base: string, message: string) {
  return `${base}?text=${encodeURIComponent(message)}`;
}
