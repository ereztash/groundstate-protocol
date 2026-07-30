/**
 * The guarantee, once.
 *
 * Wording per operator guidance 2026-07-30. Two surfaces used to carry two
 * different guarantees: /protocol promised a documented interest signal or a
 * refund of stage 4, while the landing page promised a sharper narrative or no
 * payment for stage 1. Only the first has a stated source, so both now render
 * this one.
 *
 * The two lists are part of the guarantee rather than decoration around it. A
 * guarantee whose trigger is undefined cannot be checked by the person it is
 * offered to, and an uncheckable guarantee lowers no risk.
 *
 * Deliberately absent: any "no questions asked" phrasing, and any condition
 * beyond the ones stated here.
 */
export const guarantee = {
  /** Split out so surfaces can isolate it from RTL text. See Price.tsx. */
  amount: "₪1,900",
  headline:
    "בסוף שלב 4 יש בידך אות התעניינות מתועד מלקוח קצה אחד לפחות, או החזר מלא של ₪1,900.",
  countsLabel: "מה נחשב אות",
  counts: [
    "תגובה",
    "בקשת פגישה",
    "שאלה ספציפית",
    "הפניה",
    "מעבר פלטפורמה",
  ],
  countsNote: "כל אלה מצד לקוח הקצה.",
  excludedLabel: "מה לא נחשב",
  excluded: ["הצעת מחיר שהלקוח שלך הוציא מיוזמתו."],
} as const;
