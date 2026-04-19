import { Brain, Cpu, TrendingUp, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Discipline = {
  icon: LucideIcon;
  label: string;
  detail: string;
  tone: "primary" | "insight" | "opportunity";
};

const disciplines: Discipline[] = [
  {
    icon: Brain,
    label: "פסיכולוגיה ארגונית",
    detail: "להבין מה באמת מניע את הלקוח — לא מה שהוא אומר שמניע אותו.",
    tone: "primary",
  },
  {
    icon: Cpu,
    label: "הנדסה טכנולוגית",
    detail: "לבנות את המערכת, לא רק להמליץ עליה. קוד, דאטא, אינטגרציה.",
    tone: "insight",
  },
  {
    icon: TrendingUp,
    label: "עסקים מדודים",
    detail: "להפוך תובנה להצעת ערך שאפשר לתמחר ולמכור, לא לפילוסוף עליה.",
    tone: "opportunity",
  },
];

const toneClasses: Record<Discipline["tone"], string> = {
  primary: "text-primary",
  insight: "text-cor-insight",
  opportunity: "text-cor-opportunity",
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
            <p className="cor-overline text-primary">הבעיה · הפער</p>
            <h2 id="problem-title" className="cor-title text-foreground">
              הפער שאף אחד לא מדבר עליו
            </h2>

            <div className="space-y-5 text-foreground/85">
              <p className="cor-body-lg">
                בישראל יש יועצי טכנולוגיה, יש יועצי תרבות, ויש יועצי AI.
                <br />
                אין כמעט שחקן שמחזיק את השלוש — עם מוצר, עם תמחור, ועם פרוטוקול מדוד.
              </p>
              <p className="cor-body-lg">
                בין אם אתה עובד סוציאלי שמפתח קוד, או מאמן שמתכנן מערכות, או מהנדס עם אוזן פסיכו-חברתית — <span className="font-mono text-primary">בכל פעם שאתה מציג את עצמך, אתה מוחק חצי מהתמונה.</span>
              </p>
              <p className="cor-body-lg font-mono text-muted-foreground">
                וזה, בדיוק, הכוח הגדול ביותר שלך.
              </p>
            </div>
          </Reveal>

          {/* Three discipline cards */}
          <RevealStagger className="flex flex-col gap-4" as="ul">
            {disciplines.map(({ icon: Icon, label, detail, tone }) => (
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
                  <p className="cor-subheading text-foreground">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </RevealItem>
            ))}
            <RevealItem className="pt-2 text-sm text-muted-foreground">
              <span className="font-mono text-primary">+ </span>
              שילוב של שתי דיסציפלינות או יותר = חפיר תחרותי שלא ניתן להעתקה.
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
