import { Compass, Package, Target, Send, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Phase = {
  idx: string;
  icon: LucideIcon;
  title: string;
  body: string;
  output: string;
};

const phases: Phase[] = [
  {
    idx: "01",
    icon: Compass,
    title: "אבחון בידול",
    body: "מאיתרים את הדיסציפלינה המוסתרת ואת הצומת שבה היא נפגשת עם הגלויה. החפיר התחרותי שלך — בשם שלו, לא כסיסמה.",
    output: "Positioning Memo בן עמוד.",
  },
  {
    idx: "02",
    icon: Package,
    title: "הנדסת הצעה",
    body: "ממירים את המומחיות ל-Offer ממוצר: מבנה, הבטחה, תמחור, תוצר, תנאי כישלון. לא חבילה גמישה — מוצר.",
    output: "Offer sheet + מחירון שמחזיק ביקורת.",
  },
  {
    idx: "03",
    icon: Target,
    title: "אדריכלות ICP",
    body: "בונים פרופיל לקוח אידיאלי עם מילון כאב משלו. לא 'עסקים קטנים' — אנשים עם התנגדויות ספציפיות ותקציב ידוע.",
    output: "ICP doc + מילון כאב תפעולי.",
  },
  {
    idx: "04",
    icon: Send,
    title: "אות שוק ראשון",
    body: "שלוש פניות ממוקדות שיוצאות החוצה. לא כדי להרשים — כדי למדוד: מי עונה, מה הוא אומר, איפה הוא נתקע.",
    output: "3 outbound + תשובה מדודה.",
  },
];

const MethodologySection = ({
  anchorRef,
}: {
  anchorRef?: React.RefObject<HTMLElement>;
}) => {
  return (
    <section
      id="methodology"
      ref={anchorRef}
      dir="rtl"
      className="relative overflow-hidden bg-muted/10 py-24 md:py-32"
      aria-labelledby="methodology-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-insight" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-insight">הפרוטוקול · 4 שלבים</p>
          <h2
            id="methodology-title"
            className="cor-title mt-3 text-foreground"
          >
            לא קורס. לא קואוצ'ינג. פרוטוקול.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            כל שלב הוא פגישה. כל פגישה מוציאה תוצר מדוד. בסוף 30 ימים יש לך שפה, מוצר, ICP, ואות שוק — לא עוד מצגת.
          </p>
        </Reveal>

        <RevealStagger
          className="relative mt-16 grid gap-5 md:grid-cols-2 md:gap-6"
          as="ol"
        >
          {phases.map(({ idx, icon: Icon, title, body, output }) => (
            <RevealItem
              key={idx}
              as="li"
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cor-insight/40 hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-insight)/0.35)]"
            >
              {/* Step index watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 -top-4 select-none font-mono text-[7rem] font-bold leading-none text-cor-insight/[0.07]"
              >
                {idx}
              </span>

              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cor-insight/30 bg-cor-insight/10 text-cor-insight">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      שלב {idx}
                    </span>
                    <span className="h-px flex-1 bg-border/60" />
                  </div>
                  <h3 className="cor-heading mt-1 text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {body}
                  </p>
                  <div className="mt-4 flex items-start gap-2 rounded-md border border-cor-success/20 bg-cor-success/[0.06] p-3">
                    <span className="cor-overline text-cor-success">תוצר</span>
                    <span className="text-sm text-foreground/90">{output}</span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default MethodologySection;
