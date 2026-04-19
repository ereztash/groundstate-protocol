import { MapPin, Target, Database, type LucideIcon } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Track = {
  key: string;
  icon: LucideIcon;
  label: string;
  question: string;
  lede: string;
  actions: string[];
  tone: "primary" | "opportunity" | "insight";
};

const tracks: Track[] = [
  {
    key: "A",
    icon: MapPin,
    label: "מסלול A · אבחון",
    question: "איפה אתה עכשיו?",
    lede: "המפה האמיתית — לא המפה ששיווקת לעצמך.",
    actions: [
      "מיפוי הדיסציפלינות שאתה מחזיק (והמוסתרת ביניהן)",
      "ניסוח Statement Mechanism של החפיר התחרותי",
      "הצהרת ויתור ברורה — על מה אנחנו בכוונה לא עובדים",
      "מדד נגדי: Decision Latency או Explanation Efficiency",
    ],
    tone: "primary",
  },
  {
    key: "B",
    icon: Target,
    label: "מסלול B · עסקי",
    question: "לאן אתה רוצה להגיע?",
    lede: "יעד שאפשר להנדס אליו — לא חזון, לא שאיפה.",
    actions: [
      "Signature Process בן 3–5 שלבים ממוספרים",
      "תוצר קשיח שהלקוח מחזיק ביד בסוף",
      "תמחור מבוסס ערך: Fixed Price = 10–20% מה-ROI",
      "One-Pager שאפשר לשלוח בלי להתנצל",
    ],
    tone: "opportunity",
  },
  {
    key: "Data",
    icon: Database,
    label: "מסלול Data · דאטה",
    question: "מה מצדיק את ההחלטה?",
    lede: "הקרקע הקשיחה שבלעדיה ההחלטה היא ניחוש.",
    actions: [
      "Pipeline AI מותאם (NotebookLM / Claude / Grok / DeepSeek)",
      "מילון כאב — 5 משפטי Verbatim מהשטח",
      "Target List של 10–20 לידים חמים מדורגים",
      "קריטריוני אות קנייה ב-14 הימים האחרונים",
    ],
    tone: "insight",
  },
];

const toneMap: Record<
  Track["tone"],
  {
    border: string;
    badgeBorder: string;
    badgeBg: string;
    text: string;
    hoverBorder: string;
    hoverShadow: string;
    indexTint: string;
  }
> = {
  primary: {
    border: "border-primary/25",
    badgeBorder: "border-primary/30",
    badgeBg: "bg-primary/10",
    text: "text-primary",
    hoverBorder: "hover:border-primary/60",
    hoverShadow: "hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.4)]",
    indexTint: "text-primary/[0.08]",
  },
  opportunity: {
    border: "border-cor-opportunity/25",
    badgeBorder: "border-cor-opportunity/30",
    badgeBg: "bg-cor-opportunity/10",
    text: "text-cor-opportunity",
    hoverBorder: "hover:border-cor-opportunity/60",
    hoverShadow: "hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-opportunity)/0.4)]",
    indexTint: "text-cor-opportunity/[0.08]",
  },
  insight: {
    border: "border-cor-insight/25",
    badgeBorder: "border-cor-insight/30",
    badgeBg: "bg-cor-insight/10",
    text: "text-cor-insight",
    hoverBorder: "hover:border-cor-insight/60",
    hoverShadow: "hover:shadow-[0_20px_60px_-20px_hsl(var(--cor-insight)/0.4)]",
    indexTint: "text-cor-insight/[0.08]",
  },
};

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
          <p className="cor-overline text-cor-insight">המנסרה · שלושה מסלולים</p>
          <h2 id="methodology-title" className="cor-title mt-3 text-foreground">
            לא קורס. לא קואוצ'ינג. מנסרה.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            שלושה מסלולים מקבילים שרצים לאורך כל 30 הימים. כל פגישה מזיזה את שלושתם בבת אחת — לא שלב-שלב, לא חבילה רציפה.
          </p>
        </Reveal>

        <RevealStagger
          className="relative mt-16 grid gap-5 md:grid-cols-3 md:gap-6"
          as="ol"
        >
          {tracks.map(({ key, icon: Icon, label, question, lede, actions, tone }) => {
            const t = toneMap[tone];
            return (
              <RevealItem
                key={key}
                as="li"
                className={`group relative overflow-hidden rounded-2xl border bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 ${t.border} ${t.hoverBorder} ${t.hoverShadow}`}
              >
                {/* Track key watermark */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -left-2 -top-4 select-none font-mono text-[7rem] font-bold leading-none ${t.indexTint}`}
                >
                  {key}
                </span>

                <div className="relative">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border ${t.badgeBorder} ${t.badgeBg} ${t.text}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <p className={`cor-overline mt-4 ${t.text}`}>{label}</p>
                  <h3 className="cor-heading mt-1 text-foreground">
                    {question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {lede}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {actions.map((action) => (
                      <li
                        key={action}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
                      >
                        <span
                          className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${t.text.replace("text-", "bg-")}`}
                          aria-hidden="true"
                        />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mx-auto mt-12 max-w-2xl rounded-xl border border-border/60 bg-card/40 p-5 text-center text-sm leading-relaxed text-muted-foreground backdrop-blur-sm"
        >
          <span className="cor-overline text-foreground">במקביל · לא ברצף</span>
          <p className="mt-2">
            כל פגישה נוגעת בשלושה המסלולים. בפגישה 1 אנחנו פותחים אותם; בפגישה 2 מעמיקים; בפגישה 3 מחברים דרך השחמט; בפגישה 4 יוצאים לשטח.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default MethodologySection;
