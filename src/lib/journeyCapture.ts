import { trackEvent } from "./analytics";

/**
 * Journey capture for the first of the three headline measures,
 * `qualified_conversation_yield`: does exposure reach a conversation with a fit.
 * The other two measures are not the site's to report.
 *
 * The payload shape follows operator guidance 2026-07-30, which points at the
 * `cor_customer_journey_optimizer.py capture` schema. That script is not
 * reachable from this environment, so the enums below are transcribed from the
 * guidance and have NOT been validated against the script itself. Treat field
 * names as unconfirmed until someone diffs them against it.
 *
 * Hard payload rules, enforced by assertCleanPayload and covered by a failing
 * test: enums only. No names, no free text, no message bodies, no price, no
 * transcript. `journey_ref` is random and cannot be traced back to a person.
 */

export type JourneyStage =
  | "exposure"
  | "interest"
  | "lead_capture"
  | "fit";

export type JourneyEvent =
  | "reached"
  | "started"
  | "completed"
  | "abandoned";

export type EvidenceType = "self_report" | "observed" | "ledger";

export type OutcomeType = "qualified" | "unqualified" | "unknown";

/**
 * Short, bounded codes standing in for what would otherwise be a sentence.
 * Adding a code is a deliberate act; passing prose is not possible.
 */
export type SummaryCode =
  | "form_reached"
  | "form_step_one_done"
  | "form_submitted"
  | "screen_active_practice_yes"
  | "screen_active_practice_no"
  | "wizard_started"
  | "wizard_completed"
  | "pricing_seen"
  | "evidence_seen";

export type JourneyPayload = {
  journey_ref: string;
  stage: JourneyStage;
  event: JourneyEvent;
  evidence_type: EvidenceType;
  outcome_type: OutcomeType;
  summary_code: SummaryCode;
};

const STAGES: JourneyStage[] = ["exposure", "interest", "lead_capture", "fit"];
const EVENTS: JourneyEvent[] = ["reached", "started", "completed", "abandoned"];
const EVIDENCE: EvidenceType[] = ["self_report", "observed", "ledger"];
const OUTCOMES: OutcomeType[] = ["qualified", "unqualified", "unknown"];
const CODES: SummaryCode[] = [
  "form_reached",
  "form_step_one_done",
  "form_submitted",
  "screen_active_practice_yes",
  "screen_active_practice_no",
  "wizard_started",
  "wizard_completed",
  "pricing_seen",
  "evidence_seen",
];

/** Exactly the six allowed keys, nothing else. */
const ALLOWED_KEYS = [
  "journey_ref",
  "stage",
  "event",
  "evidence_type",
  "outcome_type",
  "summary_code",
] as const;

/** journey_ref is opaque: 12 lowercase hex characters, no embedded meaning. */
const JOURNEY_REF = /^[0-9a-f]{12}$/;

export class PayloadError extends Error {}

/**
 * Throws on anything that is not an enum or the opaque ref. This exists so a
 * future edit that "just adds the visitor's answer for context" fails a test
 * rather than shipping identifiable text to an analytics vendor.
 */
export function assertCleanPayload(p: JourneyPayload): void {
  const keys = Object.keys(p);
  for (const k of keys) {
    if (!(ALLOWED_KEYS as readonly string[]).includes(k)) {
      throw new PayloadError(`unexpected field: ${k}`);
    }
  }
  for (const k of ALLOWED_KEYS) {
    if (!(k in p)) throw new PayloadError(`missing field: ${k}`);
  }
  if (typeof p.journey_ref !== "string" || !JOURNEY_REF.test(p.journey_ref)) {
    throw new PayloadError("journey_ref must be 12 hex characters");
  }
  if (!STAGES.includes(p.stage)) throw new PayloadError("stage not an enum");
  if (!EVENTS.includes(p.event)) throw new PayloadError("event not an enum");
  if (!EVIDENCE.includes(p.evidence_type)) {
    throw new PayloadError("evidence_type not an enum");
  }
  if (!OUTCOMES.includes(p.outcome_type)) {
    throw new PayloadError("outcome_type not an enum");
  }
  if (!CODES.includes(p.summary_code)) {
    throw new PayloadError("summary_code not an enum");
  }
}

const REF_KEY = "cor-journey-ref";

/**
 * Per-browser opaque reference, so several events from one visit can be joined
 * without knowing who the visitor is. Regenerated whenever storage is cleared,
 * which is the intended privacy property rather than a limitation.
 */
export function journeyRef(): string {
  if (typeof window === "undefined") return "000000000000";
  try {
    const existing = window.localStorage.getItem(REF_KEY);
    if (existing && JOURNEY_REF.test(existing)) return existing;
    const bytes = new Uint8Array(6);
    window.crypto.getRandomValues(bytes);
    const ref = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    window.localStorage.setItem(REF_KEY, ref);
    return ref;
  } catch {
    return "000000000000";
  }
}

/**
 * Emits one journey event. Validation runs before the send, so a malformed
 * payload is dropped rather than transmitted; in development it also throws so
 * the mistake is visible while it is being made.
 */
export function captureJourney(
  fields: Omit<JourneyPayload, "journey_ref">,
): void {
  const payload: JourneyPayload = { journey_ref: journeyRef(), ...fields };
  try {
    assertCleanPayload(payload);
  } catch (err) {
    if (import.meta.env.DEV) throw err;
    return;
  }
  trackEvent("journey_capture", payload as unknown as Record<string, unknown>);
}
