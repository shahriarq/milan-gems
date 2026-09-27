import type { Availability, DocumentationStatus, TreatmentStatus } from "./types";

/** Human-readable labels for the enumerated specimen fields, kept in one place. */

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  "in-stock": "In Stock",
  limited: "Limited",
  "made-to-order": "Made to Order",
  inquire: "Inquire",
};

export const TREATMENT_LABELS: Record<TreatmentStatus, string> = {
  untreated: "Untreated",
  stabilized: "Stabilized",
  "treatment-undisclosed": "Treatment Undisclosed",
  "not-specified": "Not Specified",
};

export const DOCUMENTATION_LABELS: Record<DocumentationStatus, string> = {
  "available-on-request": "Available on Request",
  included: "Included",
  "not-applicable": "Not Applicable",
  "pending-verification": "Pending Verification",
};
