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
    q: "מה ההבדל בין השלבים? למה אי אפשר לדלג ישר לשלב 4?",
    a: "כל שלב נשען על תוצר השלב הקודם. בלי נרטיב מחולץ, הצעת הערך תהיה גנרית. בלי הצעת ערך, המוצר ירחף. בלי מוצר ברור, הפניות לא יידעו על מה לדבר.",
  },
  {
    q: "אני כבר עם נרטיב, אפשר להתחיל משלב 2?",
    a: "כן. בשיחת אבחון ההתאמה נבדוק שהנרטיב הקיים עומד בתנאים, ואם כן, מתחילים משלב 2.",
  },
  {
    q: "מה ההבדל בינך לבין יועץ עסקי או מאמן עסקי?",
    a: "יועץ נותן עצות. מאמן שואל שאלות. אני מחלץ נרטיב, מנסח הצעת ערך, בונה מוצר, ושולח פניות. התוצר הוא לא תובנה. התוצר הוא נכס שאפשר להשתמש בו מחר בבוקר.",
  },
  {
    q: "מה קורה אם שלב 1 לא מניב את מה שציפיתי?",
    a: "אם הנרטיב לא ברור או לא מדויק, אנחנו לא ממשיכים. אני לא מוכר רצף שמתחיל בכשל.",
  },
  {
    q: "שלושים ימים זה מציאותי לעצמאי שעובד במקביל?",
    a: "ארבע פגישות בארבעה שבועות. בין הפגישות יש משימות קצרות. אם השבוע הזה שלך עמוס מדי, נגרור את הפגישה לשבוע הבא. הרצף סובל הזחה, הוא לא סובל קפיצה על שלב.",
  },
  {
    q: "איך אתה מתמחר 1,900 לפנייה ל-10 מקבלי החלטות, כשעצמאי אחר גובה 5,000 על אותה כמות?",
    a: "אני לא מוכר 10 פניות. אני מוכר את הניתוח של מי הם 10 הנכונים, את הניסוח שמדבר לכל אחד מהם בנפרד, ואת התיעוד של אותות הקנייה שחזרו. השווי הוא לא בכמות הפניות. הוא במה שלמדנו עליהן.",
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
          <p className="cor-overline-he text-muted-foreground">
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
