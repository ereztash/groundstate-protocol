import type { GuaranteeVariantId } from "./guarantee";

/**
 * Operator-facing notes on the three guarantee options. Never shipped.
 *
 * These lived on the variant objects until a reviewer pointed out what that
 * actually bought: the split in the previous commit kept them out of the
 * bundle only while ACTIVE_VARIANT was "none". The whole purpose of the
 * variants is that one of them eventually goes live, and on that day all three
 * notes would have shipped again. A protection that holds only while the
 * feature is switched off is not a protection, it is a coincidence.
 *
 * They are not secret, but they are a negotiating position: each one is the
 * read on how much perceived risk that option reverses and what commercial
 * exposure it leaves open. A prospect who opened the bundle would be reading
 * an assessment of the weakness of the promise being made to them.
 *
 * Keyed by id rather than nested in the variants so this module has exactly
 * one importer, /guarantee-review, which is compiled out of production builds
 * alongside /case-intake. e2e/case-intake.spec.ts asserts the absence
 * unconditionally, not only while nothing is live.
 */
export const GUARANTEE_REVIEW_NOTES: Record<
  Exclude<GuaranteeVariantId, "none">,
  string
> = {
  "outreach-sent":
    "מבטיח תוצר שנמצא כולו בשליטתך, ולכן אינו יכול להיכשל מסיבה חיצונית. מפחית פחות סיכון נתפס מהבטחה על תוצאה.",
  "with-amount":
    "כלשונו בגרף. מפחית סיכון נתפס בצורה הברורה ביותר, ומשאיר את החשיפה על ₪1,900 פתוחה.",
  "without-amount":
    "מסיר את החשיפה על הנגזרת, כי אינו נוקב במספר. דורש הכרעת תמחור על מה בדיוק מוחזר.",
};
