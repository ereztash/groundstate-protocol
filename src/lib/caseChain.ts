import type { EvidenceLevel } from "./evidence";

/**
 * Case-chain records: what was said, what was identified, what was created,
 * what was done, what happened. One row per client case.
 *
 * Loading is deliberately gated twice, and both gates default to closed:
 *
 *  1. `consent_state` must be "granted". Publication consent is the client's,
 *     not the site's.
 *  2. `source_integrity_confirmed` must be true. Per operator guidance
 *     2026-07-30, C1 carries provenance "השלמה" in the graph, so the operator
 *     confirms the source passed the integrity gate before it goes live.
 *
 * A record that fails either gate is dropped, not partially rendered. There is
 * no flag that renders a case "anonymously but visibly": a half-shown case is
 * the failure mode this file exists to prevent.
 *
 * The site displays these records. It never edits a level, infers one, or
 * promotes maturity.
 */

export type ChainColumn =
  | "said"
  | "identified"
  | "created"
  | "done"
  | "happened";

export const CHAIN_COLUMNS: readonly ChainColumn[] = [
  "said",
  "identified",
  "created",
  "done",
  "happened",
];

export const CHAIN_COLUMN_LABEL: Record<ChainColumn, string> = {
  said: "מה נאמר",
  identified: "מה זוהה",
  created: "מה נוצר",
  done: "מה נעשה",
  happened: "מה קרה",
};

export type ChainCell = {
  column: ChainColumn;
  text: string;
  evidence_level: EvidenceLevel;
};

export type CaseOutcome = "converted" | "not_converted";

export type CaseRecord = {
  id: string;
  consent_state: "granted" | "pending" | "declined";
  source_integrity_confirmed: boolean;
  outcome: CaseOutcome;
  /** Generalised descriptor. Never a name, never an identifying niche. */
  subject_label: string;
  niche_generalized: boolean;
  /**
   * The decision rule recorded before the outcome was known. Publishing a case
   * that did not convert alongside the rule written in advance is the point of
   * a counter-case: it shows the rule was not chosen after the fact.
   */
  pre_registered_rule: string | null;
  chain: ChainCell[];
  caveats: string[];
};

const LEVELS: EvidenceLevel[] = ["anchored", "operator", "pending"];

/**
 * Validates an untrusted JSON record. Returns null rather than throwing: one
 * malformed file must not take the page down, and a case that cannot be
 * validated is a case that must not render.
 */
export function parseCaseRecord(raw: unknown): CaseRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  if (typeof r.id !== "string" || !r.id) return null;
  if (
    r.consent_state !== "granted" &&
    r.consent_state !== "pending" &&
    r.consent_state !== "declined"
  ) {
    return null;
  }
  if (typeof r.source_integrity_confirmed !== "boolean") return null;
  if (r.outcome !== "converted" && r.outcome !== "not_converted") return null;
  if (typeof r.subject_label !== "string" || !r.subject_label) return null;
  if (typeof r.niche_generalized !== "boolean") return null;
  if (r.pre_registered_rule !== null && typeof r.pre_registered_rule !== "string") {
    return null;
  }
  if (!Array.isArray(r.caveats) || r.caveats.some((c) => typeof c !== "string")) {
    return null;
  }
  if (!Array.isArray(r.chain)) return null;

  const chain: ChainCell[] = [];
  for (const cell of r.chain) {
    if (!cell || typeof cell !== "object") return null;
    const c = cell as Record<string, unknown>;
    if (!CHAIN_COLUMNS.includes(c.column as ChainColumn)) return null;
    if (typeof c.text !== "string" || !c.text) return null;
    if (!LEVELS.includes(c.evidence_level as EvidenceLevel)) return null;
    chain.push({
      column: c.column as ChainColumn,
      text: c.text,
      evidence_level: c.evidence_level as EvidenceLevel,
    });
  }
  // Every column present exactly once. A chain with a gap would render as a
  // shorter, tidier story than the one that actually happened.
  if (chain.length !== CHAIN_COLUMNS.length) return null;
  if (new Set(chain.map((c) => c.column)).size !== CHAIN_COLUMNS.length) {
    return null;
  }

  return {
    id: r.id,
    consent_state: r.consent_state,
    source_integrity_confirmed: r.source_integrity_confirmed,
    outcome: r.outcome,
    subject_label: r.subject_label,
    niche_generalized: r.niche_generalized,
    pre_registered_rule: (r.pre_registered_rule as string | null) ?? null,
    chain,
    caveats: r.caveats as string[],
  };
}

/** Both gates. Exported so the test can assert on the rule directly. */
export function isPublishable(c: CaseRecord): boolean {
  return c.consent_state === "granted" && c.source_integrity_confirmed;
}

/**
 * Every case file under src/data/cases, validated, in id order. Includes
 * records that are not publishable; callers filter.
 */
export function allCases(): CaseRecord[] {
  const modules = import.meta.glob("../data/cases/*.json", { eager: true });
  return Object.keys(modules)
    .sort()
    .map((k) => {
      const m = modules[k] as { default?: unknown };
      return parseCaseRecord(m?.default ?? m);
    })
    .filter((c): c is CaseRecord => c !== null);
}

/** The cases the site is allowed to render. */
export function publishableCases(): CaseRecord[] {
  return allCases().filter(isPublishable);
}
