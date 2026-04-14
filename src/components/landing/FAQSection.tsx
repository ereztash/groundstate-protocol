import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";

type QA = { q: string; a: string };

const items: QA[] = [
  {
    q: "למה דווקא ₪2,500–4,000? זה לא נשמע קצת נמוך?",
    a: "זה מחיר Founding מכוון. קוהורטה ראשונה → מחיר נמוך → תמורת זכויות Case Study מלאות. אחרי הקוהורטה המחיר עולה. אם אתה מחפש את המחיר הזול ביותר בשוק — זה לא המקום; אם אתה מחפש את נקודת הכניסה הזולה ביותר של פרוטוקול מדוד — כן.",
  },
  {
    q: "זה קואוצ'ינג? ייעוץ עסקי? מה זה בכלל?",
    a: "לא קואוצ'ינג (לא שואלים אותך איך אתה מרגיש), לא ייעוץ כללי (לא נותנים המלצות שיישארו על נייר). זה פרוטוקול מדוד: 4 פגישות, 6 תוצרים מדידים, ואות שוק אמיתי שיוצא החוצה. אתה יוצא עם מסמכים, לא עם תובנות.",
  },
  {
    q: "אני פרילנסר סולו. זה מתאים לי או שזה לעסקים קיימים?",
    a: "זה בנוי בדיוק לפרילנסרים וסולו-אינטגרטורים שמחזיקים שתי דיסציפלינות. אם יש לך עסק ממותג עם מוצר מוכר ו-20 לקוחות קבועים — זה פחות. אם אתה עוד מנסה לנסח 'מה אני בעצם מוכר' — זה בדיוק המקום.",
  },
  {
    q: "מה קורה אם אחרי 30 ימים אין אות שוק?",
    a: "אות שוק הוא מדד, לא הבטחה. אנחנו עושים את שלושת הפניות יחד. אם תשובות לא מגיעות — אנחנו מנתחים את הפערים (ICP, הצעה, ערוץ) ויודעים בדיוק איפה לתקן. אין Integration 60 אוטומטי בלי אות. יש דאטא שמצדיק או פוסל המשך.",
  },
  {
    q: "זה מתאים למי שעוד לא התחיל, או רק למי שכבר בשוק?",
    a: "עדיף שכבר הייתה לך לפחות התנסות אחת במכירת שירות (גם אם כושלת), כי זה מה שיוצר חומר לעיבוד. אבל זה לא תנאי — אפשר להתחיל גם 'מאפס' אם אתה ברור לגבי הדיסציפלינות שאתה מביא.",
  },
  {
    q: "במה זה שונה מיועץ עסקי / מאמן עסקי?",
    a: "יועץ עסקי נותן המלצות. מאמן עסקי שואל שאלות. פרוטוקול מוציא תוצרים. ההבדל הפרקטי: אחרי 30 ימים איתי יש לך מסמכי מכירה ו-3 פניות ששלחת, לא רק 'הבנה עמוקה יותר של העסק'.",
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
