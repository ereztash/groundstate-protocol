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
export type QA = { q: string; a: string };

export const faq: readonly QA[] = [
  {
    q: "מאיפה להתחיל אם אני לא יודע באיזה שלב אני?",
    a: "זה בדיוק מה שהשיחה הראשונה עושה. רוב הלקוחות מתחילים בשלב 1 (נרטיב) כי שם יושב הבידול שעוד לא ניסחת. אם יש לך כבר נרטיב חזק, נדלג ונתחיל מהצעת הערך. אתה לא צריך להחליט לבד.",
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
    a: "אולי כבר עבדת עם מישהו ש״פחות הבין את התחום שלך, יותר היה כללי״. יועץ נותן עצות. מאמן שואל שאלות. אני מחלץ נרטיב, מנסח הצעת ערך, בונה מוצר, ומריץ איתך את הפניות. בסוף כל שלב יש מסמך שאפשר להשתמש בו מחר בבוקר.",
  },
  {
    q: "אי אפשר פשוט להשתמש ב-GPT?",
    a: "ניסית ״תעזור לי לדייק את עצמי״, ואחרי חודש זה שוב ״לא מספיק מדויק״. GPT יחזיר לך את עצמך עם יותר מילים: הוא יודע מה שסיפרת לו. אני מחלץ את מה שלא סיפרת, את ההבדל בינך לאלף שעושים אותו דבר.",
  },
  {
    q: "מה קורה אם שלב 1 לא מניב את מה שציפיתי?",
    a: "אם הנרטיב לא ברור או לא מדויק, אנחנו לא ממשיכים. אני לא מוכר רצף שמתחיל בכשל.",
  },
  {
    q: "שלושים ימים זה מציאותי לעצמאי שעובד במקביל?",
    a: "ארבע פגישות בארבעה שבועות. בין הפגישות יש משימות קצרות. אם השבוע הזה עמוס מדי, נדחה את הפגישה לשבוע הבא. לוח הזמנים גמיש, רק הסדר חשוב.",
  },
  {
    q: "מה כולל שלב 4 בפועל?",
    // "שליחה של הפנייה הראשונה בתוך הפגישה" was removed here for the same
    // reason it was removed from the stage-4 exit criterion: the graph marks
    // that criterion 🪦, refuted twice on transcript. The buy-signal journal
    // also stopped being phrased as signals that came back — the journal is a
    // deliverable, the responses are not something the stage can promise.
    a: "מיפוי של עשרה מקבלי החלטות ספציפיים בשוק שלך, ניסוח פנייה נפרד לכל אחד מהם, והרצה מונחית של הפנייה הראשונה בחדר. יומן אותות הקנייה נבנה כדי לתעד את מה שחוזר בתגובות. המחיר הוא ₪1,900.",
  },
];
