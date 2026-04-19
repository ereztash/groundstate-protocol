import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

type QA = { q: string; a: string };

// Order follows the serial-position effect (Ebbinghaus 1885; Murdock 1962):
// strongest primacy item = the top-of-funnel objection (price), strongest
// recency item = the final value differentiator. Middle items are lower-
// stakes category clarifications. Objection ordering informed by Morwitz
// & Pluzinski 1996 — ask-then-address beats ignore on purchase intent.
const items: QA[] = [
  {
    q: "₪2,000 לתהליך שלם? זה לא נשמע קצת נמוך?",
    a: "זה בכוונה. המחיר הוא נקודת כניסה נמוכה לפרוטוקול מדוד — לא אצטדיון של קורסים, לא ליווי אינסופי. 4 פגישות, 3 מסלולים מקבילים, וליווי אישי שלי בפניות הקרות עד הלקוח הראשון. אם אתה מחפש את הזול ביותר בשוק, זה לא המקום. אם אתה מחפש את הכניסה הכי חדה לפרוטוקול שמוציא תוצרים ופניות — כן.",
  },
  {
    q: "מה קורה אם אחרי 30 ימים אין לקוח ראשון?",
    a: "לקוח ראשון הוא יעד, אבל הפרוטוקול מוציא אות שוק בכל מקרה. אנחנו שולחים 10 פניות יחד. אם תשובות לא מתחילות לזוז, אנחנו יודעים בדיוק איפה לתקן — ה-ICP, ההצעה, המסר או הערוץ — כי הדאטה ממסלול Data כבר בידיים. אתה לא נשאר עם 'לא עבד', אתה נשאר עם נקודת תיקון מדויקת.",
  },
  {
    q: "אני סולו, לא 'אינטגרטור'. זה בשבילי?",
    a: "כן — אם אתה מוכר שירות מקצועי ועוד מנסה לנסח מה בדיוק אתה מוכר. אם הצעת הערך שלך כבר נעולה ויש לך 20 לקוחות קבועים, זה פחות רלוונטי. אם אתה בין לבין — זה בדיוק המקום. המנסרה עובדת גם כשאתה מחזיק 'רק' דיסציפלינה אחת, היא פשוט חושפת את הרובד העסקי והדאטה שאתה עדיין לא מנצל.",
  },
  {
    q: "זה קואוצ'ינג? ייעוץ עסקי? מה זה בכלל?",
    a: "לא קואוצ'ינג (לא שואלים איך אתה מרגיש), לא ייעוץ גנרי (לא נותנים המלצות שיישארו על נייר). זה פרוטוקול מדוד: 4 פגישות, תוצרים קשיחים לפי מסלול, וליווי אישי שלי בשטח בפגישה הרביעית. אתה יוצא עם מסמכים ופניות שנשלחו — לא עם תובנות.",
  },
  {
    q: "למה 'מנסרה'? מה זה אומר בפועל?",
    a: "רוב היועצים נותנים תשובה אחת — או טכנולוגית, או עסקית, או 'תרבותית'. המציאות שלך היא שלוש חזיתות שרצות במקביל: איפה אתה עכשיו (A), לאן אתה רוצה להגיע (B), ומה הדאטה שמצדיק את המעבר. המנסרה היא הפרוטוקול שמחזיק את שלושתן בבת אחת, בלי לאבד את הקצה של אף אחת.",
  },
  {
    q: "מה זה 'שחמט של הנדסה לאחור'?",
    a: "אנחנו לא מתחילים ב-A ומקווים להגיע ל-B. אנחנו עומדים ב-B — היעד — ומחזירים את רצף הצעדים אחורה עד שאנחנו בנקודה שבה אתה עכשיו. רצף הצעדים הזה הוא פקודת המבצע: בדיוק מה לעשות, בדיוק באיזה סדר, בדיוק עד מתי.",
  },
  {
    q: "מה אני מחזיק ביד בסוף 30 הימים?",
    a: "Statement Mechanism + הצהרת ויתור + מדד נגדי (מסלול A). Signature Process + תמחור Fixed Price (מסלול B). מילון כאב + Target List של 10–20 לידים חמים (מסלול Data). ומעל הכול — 10 פניות קרות שיצאו לשטח בליווי אישי שלי, ומפת התנגדויות פתוחה לשיחות שיגיעו מהן.",
  },
  {
    q: "במה זה שונה מיועץ עסקי / מאמן עסקי?",
    a: "יועץ עסקי נותן המלצות. מאמן עסקי שואל שאלות. המנסרה מוציאה תוצרים ופניות. ההבדל המעשי: אחרי 30 ימים איתי יש לך משפט בידול, הצעה ממוצרת, מילון כאב, Target List ו-10 פניות ששלחנו יחד — לא רק 'הבנה עמוקה יותר'.",
  },
];

const FAQSection = () => {
  return (
    <section
      id="faq"
      dir="rtl"
      className="relative overflow-hidden bg-muted/10 py-24 md:py-32"
      aria-labelledby="faq-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="cor-overline text-primary">שאלות שכדאי לשאול</p>
          <h2 id="faq-title" className="cor-title mt-3 text-foreground">
            התנגדויות — ישרות
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            אם השאלה שלך לא פה, כנראה שכדאי פשוט לקבוע שיחה.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {items.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-b border-border/60 px-2 transition-colors hover:bg-card/40"
              >
                <AccordionTrigger className="gap-4 py-5 text-right text-base font-medium text-foreground hover:no-underline [&[data-state=open]>svg]:text-primary">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-1 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQSection;
