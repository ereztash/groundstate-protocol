import { Check, Calendar, ArrowLeft } from "lucide-react";
import { Reveal } from "./Reveal";
import { useCalendly } from "./CalendlyProvider";

const inclusions: string[] = [
  "4 פגישות · 60 דקות כל אחת, בלו\"ז קבוע מראש",
  "שלושה מסלולים שזזים יחד — A · אבחון / B · עסקי / Data · דאטה",
  "משפט בידול אחד · הצהרת ויתור · מדד שבודקים בכל שבוע",
  "תהליך חתימה ממוספר · מחיר סגור שאתה יכול לומר בלי להצטדק",
  "חמישה משפטים של לקוחות אמיתיים · 15 שמות ברשימה מדורגת",
  "ארבע שעות זום משותף · עשר פניות שיוצאות בזמן אמת",
  "תשובה מוכנה לשלוש ההתנגדויות שחוזרות: מחיר, אמון, דחיינות",
  "וואטסאפ ביניים · תשובה ממני באותו יום",
];

const PricingSection = () => {
  const { open } = useCalendly();

  return (
    <section
      id="pricing"
      dir="rtl"
      className="relative py-24 md:py-32"
      aria-labelledby="pricing-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-insight">תמחור · לתהליך כולו</p>
          <h2 id="pricing-title" className="cor-title mt-3 text-foreground">
            ₪2,000 לתהליך כולו. מחיר אחד.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            ארבע פגישות. שלושים יום. בפגישה הרביעית אני יושב איתך, ואנחנו שולחים עשר פניות — עד שלקוח ראשון מחזיר במייל.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-2xl">
          <div className="cor-card-featured relative rounded-3xl p-8 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="cor-overline text-cor-insight">
                  Protocol Ocean Blue · Sprint 30
                </span>
                <h3 className="cor-heading mt-2 text-foreground">
                  המנסרה המלאה
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  ארבע פגישות · שלושה מסלולים · לקוח ראשון על המסך
                </p>
              </div>
              <div className="text-left">
                {/* Anchor: industry benchmark above actual price
                    (Tversky & Kahneman 1974 — anchoring & adjustment) */}
                <p className="font-mono text-xs text-muted-foreground line-through opacity-70">
                  Fractional B2B: $4K–$20K/חודש
                </p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  ₪2,000
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  לתהליך כולו · לא לפגישה
                </p>
              </div>
            </div>

            <div className="my-8 hairline" />

            <ul className="grid gap-3 sm:grid-cols-2">
              {inclusions.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cor-success/15 text-cor-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            {/* Honest scarcity — 1:1 format has real capacity ceiling
                (Cialdini 1984 — scarcity; but only when legitimate,
                per Aggarwal, Jun & Huh 2011 on backfire of false scarcity) */}
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-cor-opportunity/30 bg-cor-opportunity/10 p-3">
              <span className="cor-overline mt-0.5 text-cor-opportunity">
                Cohort Q2 2026
              </span>
              <p className="text-xs leading-relaxed text-foreground/80">
                פורמט 1:1. לא קבוצה, לא "שיחת שאלות ותשובות". כל רבעון אני לוקח ארבעה אנשים — כדי שאוכל לשבת איתך ארבע שעות בלי להציץ בשעון.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={open}
                className="cta-warm-lg inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold tracking-wide sm:flex-none"
              >
                <Calendar className="h-4 w-4" />
                קבע 20 דקות · 3 שאלות שמכריעות
                <ArrowLeft className="h-4 w-4" />
              </button>
              <p className="text-xs text-muted-foreground">
                שיחת אבחון · ללא עלות · ללא התחייבות.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PricingSection;
