"use client";

import { openConsentSettings } from "@/lib/analytics";

/** Footer link that reopens the analytics-cookie choice. */
export default function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className="underline-offset-4 transition-colors hover:text-bronze-soft hover:underline">
      {label}
    </button>
  );
}
