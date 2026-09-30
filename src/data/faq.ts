/**
 * The FAQ, once.
 *
 * index.html carries an FAQPage JSON-LD block, which was a hand-maintained copy
 * of this list and had drifted badly: it was still serving Google the stage-1
 * guarantee ("no forms, no argument"), the value-derived framing of ₪1,900, and
 * the "not X, it is Y" construction, all of which had been taken off the page.
 * Search results were showing answers the site no longer gave.
 *
 * Both surfaces read from here now, and src/data/faq.test.ts fails if the
 * structured data and this list disagree.
 *
 * The guarantee question is NOT here. It is generated in FAQSection only while a
 * guarantee variant is live, so it never reaches the structured data while the
 * decision is open.
 */
import { program } from "./sprint-stages";

export type QA = { q: string; a: string };

/**
 * The two objections that decide the sale, raised in the body of the page
 * instead of waiting inside a closed accordion.
 *
 * These are questions a reader is already asking; leaving them behind a click
 * means the only people who get an answer are the ones who cared enough to look
 * for one, which is the wrong half of the audience. ObjectionsSection reads
 * them from here by question text rather than re-typing them, so the visible
 * prose, the accordion and the FAQPage structured data cannot drift apart.
 *
 * Matched on a distinctive fragment rather than the full string: an edit to
 * punctuation in the question should not silently empty the section. The lookup
 * throws instead, and faq.test.ts covers it.
 */
export const SURFACED_OBJECTIONS = [
  "אי אפשר פשוט להשתמש ב-GPT",
  "מה ההבדל בינך לבין יועץ עסקי או מאמן עסקי",
] as const;

export function surfacedObjections(): QA[] {
  return SURFACED_OBJECTIONS.map((fragment) => {
    const hit = faq.find((item) => item.q.includes(fragment));
    if (!hit) {
      throw new Error(
        `surfacedObjections: no FAQ entry matches "${fragment}". The question was edited; update SURFACED_OBJECTIONS.`
      );
    }
    return hit;
  });
}

// "רוב הלקוחות מתחילים בשלב 1" became a description of stage 1 (2026-09-30):
// it was a frequency claim with no count behind it.
export const faq: readonly QA[] = [
  {
    q: "מאיפה להתחיל כשלא ברור באיזה שלב אני?",
    a: "זה בדיוק מה שהשיחה הראשונה עושה. שלב 1 (נרטיב) הוא המקום שבו יושב הבידול שעוד לא נוסח. אם כבר יש לכם נרטיב ברור, מדלגים ומתחילים מהצעת הערך. לא צריך להחליט לבד.",
  },
  {
    q: "אני כבר עם נרטיב, אפשר להתחיל משלב 2?",
    a: "כן. בשיחה נבדוק שהנרטיב הקיים עומד בתנאים, ואם כן, מתחילים משלב 2.",
  },
  {
    q: "מה ההבדל בינך לבין יועץ עסקי או מאמן עסקי?",
    // "ושולח פניות" became "ומריץ איתך את הפניות". Weaker case than the stage-4
    // criterion and not a ledger refutation, but the same assertion in
    // miniature: `S-ACQ` records that what happens is a guided run in the room,
    // and the verb list should not be the one place that still says otherwise.
    a: "אולי כבר עבדתם עם מישהו ש״פחות הבין את התחום, יותר היה כללי״. יועץ נותן עצות. מאמן שואל שאלות. אני מחלץ נרטיב, מנסח הצעת ערך, בונה מוצר, ומריץ איתכם את הפניות. בסוף כל שלב יש מסמך שאפשר להשתמש בו מחר בבוקר.",
  },
  {
    q: "אי אפשר פשוט להשתמש ב-GPT?",
    a: "ניסיתם ״תעזור לי לדייק את עצמי״, ואחרי חודש זה שוב ״לא מספיק מדויק״. GPT יחזיר לכם את עצמכם עם יותר מילים: הוא יודע מה שסיפרתם לו. אני מחלץ את מה שלא סיפרתם, את ההבדל ביניכם לבין אלף שעושים אותו דבר.",
  },
  {
    q: "מה קורה אם שלב 1 לא מניב את מה שציפיתי?",
    a: "אם הנרטיב לא ברור או לא מדויק, אנחנו לא ממשיכים. אני לא מוכר רצף שמתחיל בכשל.",
  },
  {
    q: "שלושים ימים זה מציאותי כשעובדים במקביל?",
    a: "ארבע פגישות בארבעה שבועות. בין הפגישות יש משימות קצרות. אם השבוע הזה עמוס מדי, נדחה את הפגישה לשבוע הבא. לוח הזמנים גמיש, רק הסדר חשוב.",
  },
  {
    q: "מה כולל שלב 4 בפועל?",
    // "שליחה של הפנייה הראשונה בתוך הפגישה" was removed here for the same
    // reason it was removed from the stage-4 exit criterion: the graph marks
    // that criterion 🪦, refuted twice on transcript. The buy-signal journal
    // also stopped being phrased as signals that came back — the journal is a
    // deliverable, the responses are not something the stage can promise.
    // Was "עשרה מקבלי החלטות". Spelled out, so the numeral guard in
    // refutedClaims did not see it, and "ניסוח פנייה נפרד לכל אחד מהם" makes the
    // count of decision makers the count of outreaches. It contradicted
    // outreachCount and the refund in guarantee.ts.
    // The closing "המחיר הוא ₪1,900" went with the per-stage prices on
    // 2026-09-29. The price has its own question below.
    a: "מיפוי של חמישה מקבלי החלטות ספציפיים בשוק שלכם, ניסוח פנייה נפרד לכל אחד מהם, והרצה מונחית של הפנייה הראשונה בחדר. יומן אותות הקנייה נבנה כדי לתעד את מה שחוזר בתגובות.",
  },
  {
    q: "כמה עולה התוכנית?",
    a: `${program.priceLabel} לתוכנית כולה, ${program.installmentsLabel}. ארבעה מפגשים וליווי בין הפגישות. השלבים לא נמכרים בנפרד.`,
  },
];
