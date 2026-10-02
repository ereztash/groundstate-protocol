import type { EvidenceLevel } from "@/lib/evidence";

/**
 * The two claims the method makes, kept apart on purpose.
 *
 * Per operator guidance 2026-07-30, these sit at different evidence levels, and
 * the failure mode is presenting them as one. The structural claim is that the
 * same move recurs across domains. The business claim is that the sprint
 * produces a result at some rate. The first is anchored; the second is not
 * earned yet and is committed to a pre-registration instead.
 *
 * Both render together or neither does. A page showing only the first would let
 * a reader carry it straight to a conclusion about revenue, which is exactly the
 * inference the second claim is not entitled to.
 *
 * Numbers held back on purpose: the corpus size and the per-vector percentages
 * wait on the source-integrity gate. The shape of the claim can be published
 * now; its measurements cannot.
 */

export type Claim = {
  id: "structural" | "business";
  label: string;
  statement: string;
  level: EvidenceLevel;
  /** What a reader is entitled to conclude, in plain terms. */
  entitlement: string;
};

export const claims: readonly Claim[] = [
  {
    id: "structural",
    label: "מה נבדק",
    statement:
      "עברתי את אותו רצף עם אנשים מתחומים שונים מאוד, והשלבים חזרו אצלם באותו סדר.",
    // Was "anchored", which this site defines as "a ledger or CRM row exists".
    // Checked 2026-09-29: the research note behind it is still marked low
    // trust, waiting on its source-integrity check, and no corroboration row
    // backs the structural claim. The analysis is the operator's own, so the
    // honest tag is the operator tag until that check passes.
    level: "operator",
    entitlement: "",
  },
  {
    id: "business",
    label: "מה טרם נבדק",
    statement:
      "אצל כמה מהלקוחות זה באמת מביא תוצאה בעסק. מעט מדי אנשים עברו את הרצף, אז אני עוד לא יודע לתת פה אחוז.",
    level: "pending",
    entitlement:
      "את זה אני בודק עכשיו, אצל 20 הלקוחות הבאים.",
  },
];
