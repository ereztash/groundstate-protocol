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
      "אותו מהלך זוהה בכמה תחומים שונים. זו טענה על מבנה: הצורה חוזרת על עצמה, ואפשר לזהות אותה שוב.",
    level: "anchored",
    entitlement: "מותר להסיק שהמהלך אינו ייחודי לתחום אחד.",
  },
  {
    id: "business",
    label: "מה טרם נבדק",
    statement:
      "באיזה שיעור מהמקרים הרצף מייצר תוצאה עסקית. המדגם קטן מכדי לקבוע שיעור, ולכן אין כאן מספר.",
    level: "pending",
    entitlement:
      "אסור להסיק מכאן שיעור הצלחה. זה מה שההתחייבות שנרשמה מראש נועדה למדוד.",
  },
];
