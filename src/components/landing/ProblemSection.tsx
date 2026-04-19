import { MapPin, Target, Database, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Track = {
  icon: LucideIcon;
  label: string;
  question: string;
  detail: string;
  tone: "primary" | "opportunity" | "insight";
};

const tracks: Track[] = [
  {
    icon: MapPin,
    label: "מסלול A · אבחון",
    question: "איפה אתה עכשיו?",
    detail: "מיפוי המיצוב הנוכחי — לא מה שאתה אומר שאתה, אלא מה שהלקוחות רואים. זיהוי הדיסציפלינה המוסתרת שגונבת לך עסקאות.",
    tone: "primary",
  },
  {
    icon: Target,
    label: "מסלול B · עסקי",
    question: "לאן אתה רוצה להגיע?",
    detail: "נקודת היעד במספרים — הלקוח האידיאלי, הצעה ממוצרת, תמחור שמחזיק ביקורת. לא חזון; יעד שאפשר להנדס אליו אחורה.",
    tone: "opportunity",
  },
  {
    icon: Database,
    label: "מסלול Data · דאטה",
    question: "מה מצדיק את ההחלטה?",
    detail: "המילים המדויקות שלקוחות משתמשים בהן בשטח (Verbatim). Target List של 10–20 לידים חמים. בסיס קשיח להחלטה — לא הערכות.",
    tone: "insight",
  },
];

const toneClasses: Record<Track["tone"], string> = {
  primary: "text-primary",
  opportunity: "text-cor-opportunity",
  insight: "text-cor-insight",
};

const ProblemSection = () => {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="problem-title"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          {/* Editorial copy column */}
          <Reveal className="space-y-6">
            <p className="cor-overline text-primary">הפער · המציאות</p>
            <h2 id="problem-title" className="cor-title text-foreground">
              רוב היועצים נותנים תשובה אחת. <br />
              אצלך רצות שלוש חזיתות במקביל.
            </h2>

            <div className="space-y-5 text-foreground/85">
              <p className="cor-body-lg">
                בישראל יש יועצי טכנולוגיה, יש יועצי תרבות, ויש יועצי AI.
                <br />
                אין שחקן שמחזיק את השילוש — התנהגות ארגונית תחת לחץ, ממשק טכנולוגי מדיד, ומתודולוגיה עסקית מדויקת.
              </p>
              <p className="cor-body-lg">
                <span className="font-mono text-primary">0 שחקנים ישראלים</span> מחזיקים את כל השלושה. חלון הזדמנות מוגדר: 18 חודשים לפני שהפער ייסגר.
              </p>
              {/* Loss-frame (Kahneman & Tversky 1979): losses loom ≈2× gains.
                  State the cost of inaction in concrete time units. */}
              <p className="cor-body-lg text-foreground/85">
                כל חודש שעובר — עוד עצמאי ישראלי שתופס את השטח הזה לפניך.
              </p>
              <p className="cor-body-lg font-mono text-muted-foreground">
                המנסרה היא איך אנחנו מחזיקים את השלושה בלי לאבד את הקצה של אף אחד.
              </p>
            </div>
          </Reveal>

          {/* Three parallel tracks */}
          <RevealStagger className="flex flex-col gap-4" as="ul">
            {tracks.map(({ icon: Icon, label, question, detail, tone }) => (
              <RevealItem
                key={label}
                as="li"
                className="cor-card-hover group flex items-start gap-4 rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/60 transition-colors group-hover:border-primary/40 ${toneClasses[tone]}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className={`cor-overline ${toneClasses[tone]}`}>{label}</p>
                  <p className="cor-subheading mt-1 text-foreground">
                    {question}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </RevealItem>
            ))}
            <RevealItem className="pt-2 text-sm text-muted-foreground">
              <span className="font-mono text-primary">+ </span>
              שלושת המסלולים רצים במקביל לאורך 30 הימים. לא שלב-שלב — מנסרה.
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
