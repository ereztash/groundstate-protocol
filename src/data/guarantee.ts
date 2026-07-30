/**
 * The guarantee, in three variants, none of them live.
 *
 * Round 1 replaced a stage-1 promise ("a sharper narrative or you do not pay",
 * phrased "no forms, no argument") with the stage-4 guarantee, which is the one
 * with a stated source. That was the right call on sourcing and the wrong call
 * to make alone: removing a guarantee is a commercial decision, and removing it
 * bought no evidence hygiene. The recorded exposure is on the NUMBER (₪1,900 was
 * set operationally, with no derivation, ledger 2026-07-29), not on the promise.
 *
 * So all three options are built and none ships. `ACTIVE_VARIANT` stays "none"
 * until Erez picks; /guarantee-review renders all three side by side, in dev.
 *
 * Wording per operator guidance 2026-07-30. The five signals and the exclusion
 * are part of the guarantee rather than decoration: a trigger the client cannot
 * check is a guarantee that lowers no risk. The documentation rule travels with
 * them for the same reason.
 *
 * Never add "no questions asked", and never add a condition that is not here.
 */

export type GuaranteeVariantId = "with-amount" | "without-amount" | "none";

/** Flip only on Erez's decision. "none" renders no guarantee anywhere. */
export const ACTIVE_VARIANT: GuaranteeVariantId = "none";

const SIGNALS = [
  "תגובה מילולית להודעה, ולא רק קריאה",
  "בקשה מפורשת לפגישה",
  "שאלה ספציפית על המוצר או על התנאים",
  "הפניה לאדם אחר, עם פירוט הסיבה",
  "מעבר לפלטפורמה אחרת ביוזמת לקוח הקצה",
] as const;

const EXCLUDED = [
  "הצעת מחיר שאתה הוצאת מיוזמתך. היא תלויה רק בך, ואינה דורשת פעולה מצד שלישי.",
] as const;

const DOCUMENTATION = "אות שלא תועד אינו נחשב.";

export type GuaranteeVariant = {
  id: Exclude<GuaranteeVariantId, "none">;
  /** One-line summary for the review page. */
  reviewNote: string;
  /** The money amount, or null when the variant states no number. */
  amount: string | null;
  headline: string;
  signalsLabel: string;
  signals: readonly string[];
  signalsNote: string;
  excludedLabel: string;
  excluded: readonly string[];
  documentation: string;
};

export const GUARANTEE_VARIANTS: readonly GuaranteeVariant[] = [
  {
    id: "with-amount",
    reviewNote:
      "כלשונו בגרף. מפחית סיכון נתפס בצורה הברורה ביותר, ומשאיר את החשיפה על ₪1,900 פתוחה.",
    amount: "₪1,900",
    headline:
      "בסוף הספרינט יש בידך אות התעניינות מתועד מלקוח קצה אחד לפחות, או החזר מלא של ₪1,900.",
    signalsLabel: "מה נחשב אות",
    signals: SIGNALS,
    signalsNote: "כל אלה מצד לקוח הקצה.",
    excludedLabel: "מה לא נחשב",
    excluded: EXCLUDED,
    documentation: DOCUMENTATION,
  },
  {
    id: "without-amount",
    reviewNote:
      "מסיר את החשיפה על הנגזרת, כי אינו נוקב במספר. דורש הכרעת תמחור על מה בדיוק מוחזר.",
    amount: null,
    headline:
      "בסוף הספרינט יש בידך אות התעניינות מתועד מלקוח קצה אחד לפחות, או החזר מלא של שלב 4.",
    signalsLabel: "מה נחשב אות",
    signals: SIGNALS,
    signalsNote: "כל אלה מצד לקוח הקצה.",
    excludedLabel: "מה לא נחשב",
    excluded: EXCLUDED,
    documentation: DOCUMENTATION,
  },
];

export function activeGuarantee(): GuaranteeVariant | null {
  return (
    GUARANTEE_VARIANTS.find((v) => v.id === ACTIVE_VARIANT) ?? null
  );
}
