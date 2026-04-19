import { ShieldCheck, Clock3, Users, Target } from "lucide-react";

/**
 * Trust / risk-reversal strip placed immediately below Hero.
 *
 * Research basis:
 *  - Risk reversal lowers perceived transaction cost (Thaler 1985 — mental accounting).
 *  - Fluent, high-density scannable strip reduces cognitive load (Sweller 1988).
 *  - Picture superiority via icons increases recall ~2x vs text (Paivio 1971).
 *  - 4 items hits the "chunking" sweet spot (Cowan 2001 — working memory ≈4).
 *  - Specificity (20 דק׳, 3 שאלות) beats vagueness (Chaiken 1987 heuristic-systematic).
 */
const items = [
  {
    icon: ShieldCheck,
    title: "ללא התחייבות",
    body: "שיחת אבחון 20 דק׳ · מחליטים יחד אם מתאים. אם לא — אני אומר ישר.",
  },
  {
    icon: Clock3,
    title: "לוח נעול · 30 ימים",
    body: "ארבע פגישות, תאריכים קבועים. בלי 'נתקדם איפה שיסתדר'.",
  },
  {
    icon: Users,
    title: "ליווי 1:1 בשטח",
    body: "פגישה 4 — אני יושב איתך ושולח. לא אתה לבד מול המסך.",
  },
  {
    icon: Target,
    title: "תוצרים קשיחים",
    body: "מסמכים, Target List, 10 פניות. לא 'תובנות'. לא PDFים.",
  },
];

const TrustStrip = () => {
  return (
    <section
      dir="rtl"
      aria-label="התחייבויות הפרוטוקול"
      className="relative border-y border-border/50 bg-muted/20 py-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustStrip;
