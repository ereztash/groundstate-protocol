import { Check, Calendar, ArrowLeft } from "lucide-react";
import { Reveal } from "./Reveal";
import { useCalendly } from "./CalendlyProvider";

const inclusions: string[] = [
  "4 פגישות מובנות · 60 דקות כל אחת",
  "שלושה מסלולים מקבילים (A · אבחון / B · עסקי / Data · דאטה)",
  "Statement Mechanism + הצהרת ויתור + מדד נגדי",
  "Signature Process + תמחור Fixed Price",
  "מילון כאב + Target List של 10–20 לידים חמים",
  "ליווי אישי בשטח · 10 פניות קרות חיות בפגישה 4",
  "מפת התנגדויות (מחיר / אמון / דחיינות)",
  "ליווי דרך WhatsApp בין הפגישות",
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
            4 פגישות. 30 יום. ליווי אישי שלי בפניות הקרות עד הלקוח הראשון. בלי שכבות, בלי חבילות, בלי upsell.
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
                  4 פגישות · 3 מסלולים מקבילים · לקוח ראשון בשטח
                </p>
              </div>
              <div className="text-left">
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={open}
                className="cta-warm-lg inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold tracking-wide sm:flex-none"
              >
                <Calendar className="h-4 w-4" />
                קבע שיחת אבחון
                <ArrowLeft className="h-4 w-4" />
              </button>
              <p className="text-xs text-muted-foreground">
                שיחת 20 דקות · בלי התחייבות · מחליטים יחד אם מתאים.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PricingSection;
