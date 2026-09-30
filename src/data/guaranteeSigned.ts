import type { GuaranteeVariant } from "./guarantee";

/**
 * The guarantee Erez adopted, 2026-09-29.
 *
 * Not one of the three options that waited in ./guaranteeVariants. It is the
 * wording of the guarantee section in the proposal he signed with a client on
 * 2026-08-31, which he chose "כמו שהיא" when asked which guarantee the site
 * should carry. Only the address changed, to the plural the site now uses.
 *
 * It guarantees two things the process produces, a sales unit and five active
 * outreaches that actually went out, and refunds the whole payment if either is
 * missing at the end of meeting 4. The definitions in `signals` are the
 * proposal's own "מה בידך בסוף" lines for those two deliverables.
 *
 * Deliberately absent, because the proposal does not say them: any
 * documentation rule, and any requirement that the outreach be sent inside the
 * meeting (the graph marks that criterion 🪦). Never add a condition that is
 * not in the signed text.
 *
 * Kept in its own module so that activeGuarantee() can return it without
 * pulling the three superseded options into the production bundle.
 */
export const SIGNED_PROPOSAL_GUARANTEE: GuaranteeVariant = {
  id: "signed-proposal",
  amount: null,
  headline:
    "בסוף התוכנית תהיה בידיכם יחידת מכר אחת, עם מוצר, משך זמן ומחיר קבוע, וחמש פניות פעילות שיצאו איתה בפועל לקהל היעד שהגדרנו. אם שני אלה לא קיימים בסוף מפגש 4, אני מחזיר את התשלום במלואו.",
  signalsLabel: "מה נחשב",
  signals: [
    "יחידת מכר: מוצר, משך זמן ומחיר קבוע. אותה יחידה יוצאת ללקוח הבא בלי בנייה מחדש",
    "פנייה פעילה: יצאה בפועל לקהל היעד שהגדרנו, עם אותה יחידה ואותו מחיר",
  ],
  signalsNote: "שניהם נדרשים בסוף מפגש 4.",
  excludedLabel: "מה לא מובטח",
  excluded: ["תגובה מהנמענים, פגישה או עסקה. אלה תלויים בצד שלישי."],
};
