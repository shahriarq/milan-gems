import { useId } from "react";

/**
 * A quiet provenance mark — "MILAN GEMS · IRAN · MILAN" set around a hairline
 * ring, like a hallmark rather than a logo. Decorative (aria-hidden).
 */
export default function ProvenanceSeal({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const text = "MILAN GEMS · IRAN · MILAN · ";
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <path id={`seal-${id}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <text fill="currentColor" style={{ fontSize: 8.4, letterSpacing: "0.26em" }} className="font-sans uppercase">
        <textPath href={`#seal-${id}`} textLength="236" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
      <text x="50" y="58.5" textAnchor="middle" fill="currentColor" className="font-serif" style={{ fontSize: 24 }}>
        M
      </text>
    </svg>
  );
}
