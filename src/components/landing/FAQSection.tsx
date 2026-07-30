import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";
import { guarantee } from "@/data/guarantee";

type QA = { q: string; a: string };

const items: QA[] = [
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
    a: "אולי כבר עבדת עם מישהו ש״פחות הבין את התחום שלך, יותר היה כללי״. יועץ נותן עצות. מאמן שואל שאלות. אני מחלץ נרטיב, מנסח הצעת ערך, בונה מוצר, ושולח פניות. בסוף כל שלב יש מסמך שאפשר להשתמש בו מחר בבוקר.",
  },
  {
    q: "אי אפשר פשוט להשתמש ב-GPT?",
    a: "ניסית — ״תעזור לי לדייק את עצמי״ — ואחרי חודש זה שוב ״לא מספיק מדויק״. GPT יחזיר לך את עצמך עם יותר מילים: הוא יודע מה שסיפרת לו. אני מחלץ את מה שלא סיפרת — את ההבדל בינך לאלף שעושים אותו דבר.",
  },
  {
    q: "מה קורה אם שלב 1 לא מניב את מה שציפיתי?",
    a: "אם הנרטיב לא ברור או לא מדויק, אנחנו לא ממשיכים. אני לא מוכר רצף שמתחיל בכשל.",
  },
  {
    // Was a stage-1 guarantee ("נרטיב חד יותר או שאתה לא משלם") phrased "בלי
    // טפסים ובלי ויכוח". Two problems: it is a different guarantee from the one
    // with a stated source, and the "no forms, no argument" phrasing is exactly
    // what the guarantee may not claim. Now quotes the single source in
    // src/data/guarantee.ts, including what does and does not count as a signal.
    q: "יש אחריות?",
    a: `${guarantee.headline} ${guarantee.countsLabel}: ${guarantee.counts.join(", ")}. ${guarantee.countsNote} ${guarantee.excludedLabel}: ${guarantee.excluded.join(" ")}`,
  },
  {
    q: "שלושים ימים זה מציאותי לעצמאי שעובד במקביל?",
    a: "ארבע פגישות בארבעה שבועות. בין הפגישות יש משימות קצרות. אם השבוע הזה עמוס מדי, נדחה את הפגישה לשבוע הבא — לוח הזמנים גמיש, רק הסדר חשוב.",
  },
  {
    // Was a price justification that derived ₪1,900 from the value delivered.
    // Per operator guidance 2026-07-30 the number was set operationally with no
    // derivation, so presenting it as value-derived is a claim the pricing does
    // not carry. The answer is descriptive now: what the stage includes, full
    // stop. The old phrasing also used the "not X, it's Y" construction twice.
    q: "מה כולל שלב 4 בפועל?",
    a: "מיפוי של עשרה מקבלי החלטות ספציפיים בשוק שלך, ניסוח פנייה נפרד לכל אחד מהם, שליחה של הפנייה הראשונה בתוך הפגישה, ותיעוד של אותות הקנייה שחזרו בתגובות. המחיר הוא ₪1,900.",
  },
];

const FAQSection = () => {
  return (
    <section
      id="faq"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        <Reveal className="mb-10">
          <p className="cor-overline-he">
            התנגדויות
          </p>
          <h2 id="faq-title" className="cor-title mt-2 text-foreground">
            שאלות
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {items.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="gap-4 py-5 text-right text-base font-medium text-foreground hover:no-underline">
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
