import type { GuaranteeVariant } from "./guarantee";

/**
 * The three guarantee options, in full.
 *
 * Split out of guarantee.ts because all three were shipping to every visitor
 * while ACTIVE_VARIANT was "none" and none of them rendered. activeGuarantee()
 * reaches this module only when ACTIVE_VARIANT is not "none", and that
 * comparison folds at build time, so the variants ship exactly when one of them
 * is live and not before. /guarantee-review imports it directly and is already
 * compiled out of production.
 *
 * Visitor copy only. The operator-facing notes on each option moved to
 * ./guaranteeReviewNotes when a reviewer pointed out that this split protected
 * them only while the feature was switched off, which is the one state in which
 * protecting them does not matter.
 */

const SIGNALS = [
  "תגובה מילולית להודעה, ולא רק קריאה",
  "בקשה מפורשת לפגישה",
  "שאלה ספציפית על המוצר או על התנאים",
  "הפניה לאדם אחר, עם פירוט הסיבה",
  "מעבר לפלטפורמה אחרת ביוזמת לקוח הקצה",
] as const;

const EXCLUDED = [
  "הצעת מחיר שאת הוצאת מיוזמתך. היא תלויה רק בך, ואינה דורשת פעולה מצד שלישי.",
] as const;

const DOCUMENTATION = "אות שלא תועד אינו נחשב.";

export const GUARANTEE_VARIANTS: readonly GuaranteeVariant[] = [
  {
    /**
     * Guarantees a deliverable rather than an outcome.
     *
     * The two variants below promise a documented interest signal, which depends
     * on an end client choosing to respond. That can fail without anyone doing
     * anything wrong, and neither Erez nor his client controls it. This one
     * promises the act of sending, which is entirely inside the engagement and
     * cannot fail for an outside reason.
     *
     * The cost of that safety: a deliverable guarantee reverses less perceived
     * risk. To a buyer, "I promise to do the work I am selling you" is close to
     * tautological, since their risk is whether it was worth it rather than
     * whether it happened.
     *
     * The four conditions are what keep it from being tautological. Without
     * them, "five outreach messages" could be five generic emails; with them,
     * both sides can check whether the guarantee held.
     */
    id: "outreach-sent",
    amount: null,
    headline:
      "בסוף שלב 4 יצאו חמש פניות בפועל, כל אחת לנמען שנבחר בשמו ובניסוח שנכתב איתי בפגישה. אם לא יצאו, החזר מלא של שלב 4.",
    signalsLabel: "מה נחשב פנייה שיצאה",
    signals: [
      "הנמען נבחר בשמו ובתפקידו, מתוך מיפוי שעשינו יחד",
      "הניסוח נכתב לנמען הזה ספציפית, ולא תבנית שהותאמה",
      "ההודעה נשלחה בזמן הפגישה, מהחשבון שלך",
      "יש לה תיעוד: צילום מסך או קישור",
    ],
    signalsNote: "ארבעת התנאים צריכים להתקיים יחד.",
    excludedLabel: "מה לא מובטח",
    excluded: [
      "תגובה מהנמען.",
      "פגישה.",
      "עסקה.",
      "אלה תלויים בצד שלישי, ואינם בשליטתי ולא בשליטתך.",
    ],
    documentation: "פנייה שלא תועדה אינה נחשבת.",
  },
  {
    id: "with-amount",
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

