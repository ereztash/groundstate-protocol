/**
 * Evidence classification, mirroring the levels the knowledge graph uses for
 * external artefacts. Per operator guidance 2026-07-30.
 *
 * The site displays evidence. It never produces or promotes it: nothing here
 * upgrades a level, and no level is inferred from anything the site does.
 *
 * Display rule that the rest of the code must honour: a `pending` level is
 * shown in full, never hidden. Hiding a caveat so the page reads more smoothly
 * is precisely the defect this classification exists to prevent.
 */

export type EvidenceLevel =
  /** A ledger or CRM row exists. */
  | "anchored"
  /** Reported by the operator, not cross-checked against a second source. */
  | "operator"
  /** Not measured. */
  | "pending";

export const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  anchored: "מעוגן",
  operator: "עדות-מפעיל",
  pending: "טרם",
};

/**
 * What each level means, in the visitor's words. Shown next to the tag rather
 * than kept as a code comment: a tag whose meaning lives only in the repo is a
 * caveat the reader cannot use.
 */
export const EVIDENCE_MEANING: Record<EvidenceLevel, string> = {
  anchored: "קיימת שורת פנקס או CRM",
  operator: "דיווח שלי, לא הוצלב מול מקור שני",
  pending: "לא נמדד",
};

/**
 * Whether a sample artefact is a redacted excerpt of a real deliverable or a
 * reconstruction built from the method. Both are permitted; conflating them is
 * not, so the label the visitor sees is derived from this rather than written
 * by hand per card.
 */
export type SampleSource = "redacted-real" | "method-reconstruction";

export const SAMPLE_SOURCE_LABEL: Record<SampleSource, string> = {
  "redacted-real": "קטע מתוצר אמיתי, פרטים מושחרים",
  "method-reconstruction": "דוגמה, לא לקוח",
};
