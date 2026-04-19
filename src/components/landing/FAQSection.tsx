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
    a: "זה בכוונה נמוך. לא 'קורס מאסטרמיינד' עם פיתיון ב-₪79 ואפסייל ב-₪20K. לא ליווי אינסופי שנמרח על שנה. ארבע פגישות סגורות, מחיר סגור, ליווי אישי שלי בעשר הפניות הראשונות — עד שלקוח מחזיר במייל. מחפש את הזול בשוק? לא פה. מחפש את הכניסה הכי חדה לפרוטוקול מדוד — כן.",
  },
  {
    q: "מה קורה אם אחרי 30 ימים אין לקוח ראשון?",
    a: "לקוח ראשון הוא היעד, אבל בכל מקרה יצאו איתי עשר פניות חיות. אם תשובות לא זזות — יודעים בדיוק איפה התקלה: ב-ICP, בהצעה, במסר, או בערוץ. לא נשארת עם 'לא עבד' אמורפי — נשארת עם נקודת תיקון שמית.",
  },
  {
    q: "אני סולו, לא 'אינטגרטור'. זה בשבילי?",
    a: "כן. אם אתה מוכר שירות מקצועי וכל פעם שמישהו שואל 'מה אתה עושה?' אתה פותח בשני משפטים ולא יודע איפה לעצור — זה בשבילך. אם ההצעה שלך כבר נעולה ויש לך עשרים לקוחות קבועים — פחות רלוונטי. אם אתה בין לבין — פה.",
  },
  {
    q: "זה קואוצ'ינג? ייעוץ עסקי? מה זה בכלל?",
    a: "לא קואוצ'ינג — אני לא שואל איך אתה מרגיש. לא ייעוץ גנרי — ההמלצות שלי לא נשארות על נייר. זה פרוטוקול: ארבע פגישות, מסמכים שהלקוח שלך יראה, ופניות שיוצאות בזום משותף. יוצא עם תוצרים, לא עם 'תובנות עמוקות'.",
  },
  {
    q: "למה 'מנסרה'? מה זה אומר בפועל?",
    a: "רוב היועצים נותנים תשובה אחת — טכנולוגית, עסקית, או 'תרבותית'. המציאות שלך — שלוש שאלות פתוחות בכל יום שני בבוקר: איפה אני מול הלקוח (A), לאן אני רוצה להגיע (B), ומה הלקוח עצמו אומר בשטח (Data). המנסרה מחזיקה את שלושתן יחד — בלי שאחת תבלע את הקצה של השנייה.",
  },
  {
    q: "מה זה 'שחמט של הנדסה לאחור'?",
    a: "לא מתחילים ב-A ומקווים להגיע ל-B. עומדים ב-B — הלקוח שכבר מחזיר במייל — ומחזירים את הצעדים אחורה עד היום הזה. הרצף הזה הוא פקודת המבצע שלך: מה לעשות, באיזה סדר, עד מתי.",
  },
  {
    q: "מה אני מחזיק ביד בסוף 30 הימים?",
    a: "משפט בידול, הצהרת ויתור, מדד שבודקים כל שבוע — מסלול A. תהליך חתימה, מחיר סגור, דף אחד שאפשר לשלוח — מסלול B. חמישה משפטים של לקוחות אמיתיים, חמישה עשר שמות ברשימה — מסלול Data. ומעל הכול: עשר פניות ששלחנו יחד, ותשובה מוכנה להתנגדויות שיחזרו.",
  },
  {
    q: "במה זה שונה מיועץ עסקי / מאמן עסקי?",
    a: "יועץ מייעץ. מאמן שואל. המנסרה שולחת. ההבדל המעשי: אחרי שלושים יום איתי יש לך משפט שאתה אומר, דף שאתה שולח, רשימת שמות שמחכה לך, ועשר פניות שחיכית לתשובות אליהן — לא 'הבנה עמוקה יותר של עצמך'.",
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
            אם השאלה שלך לא פה — זה כבר רמז שכדאי לקבוע שיחה.
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
