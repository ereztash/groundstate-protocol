import { Reveal, RevealItem, RevealStagger } from "./Reveal";

type Metric = {
  label: string;
  value: string;
  caption: string;
  accent: "primary" | "insight" | "opportunity" | "success";
};

const metrics: Metric[] = [
  {
    label: "זמן לערך פסיכולוגי",
    value: "יום 8",
    caption: "הרגע שהשינוי מרגיש אמיתי בתוכך — לא תיאוריה.",
    accent: "primary",
  },
  {
    label: "זמן לאות שוק",
    value: "יום 30",
    caption: "שלוש פניות ששלחת, תשובות שקיבלת, דאטא שבידך.",
    accent: "insight",
  },
  {
    label: "תמחור Founding",
    value: "₪2,500–4,000",
    caption: "זכויות Case Study · מקומות מוגבלים לקוהורטה הראשונה.",
    accent: "opportunity",
  },
  {
    label: "המשכיות",
    value: "Integration 60",
    caption: "אם אות השוק מגיע — מפה ברורה ל-60 הימים הבאים.",
    accent: "success",
  },
];

const accentMap: Record<Metric["accent"], { text: string; border: string }> = {
  primary: {
    text: "text-primary",
    border: "group-hover:border-primary/50",
  },
  insight: {
    text: "text-cor-insight",
    border: "group-hover:border-cor-insight/50",
  },
  opportunity: {
    text: "text-cor-opportunity",
    border: "group-hover:border-cor-opportunity/50",
  },
  success: {
    text: "text-cor-success",
    border: "group-hover:border-cor-success/50",
  },
};

const OutcomesSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-24 md:py-32"
      aria-labelledby="outcomes-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="cor-overline text-cor-opportunity">מדד · הבטחה</p>
          <h2 id="outcomes-title" className="cor-title mt-3 text-foreground">
            ארבע נקודות מדידה. בלי רכות, בלי "תלוי."
          </h2>
        </Reveal>

        <RevealStagger className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {metrics.map(({ label, value, caption, accent }) => (
            <RevealItem
              key={label}
              className={`cor-metric-card group rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6 ${accentMap[accent].border}`}
            >
              <p
                className={`cor-overline ${accentMap[accent].text}`}
              >
                {label}
              </p>
              <p
                className={`mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl`}
              >
                {value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {caption}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default OutcomesSection;
