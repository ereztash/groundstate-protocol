import { Check, Calendar, ArrowLeft } from "lucide-react";
import { Reveal } from "./Reveal";
import { useCalendly } from "./CalendlyProvider";

const inclusions: string[] = [
  "4 פגישות מובנות · 60 דקות כל אחת",
  "Positioning Memo · עמוד אחד שאפשר להדביק לאתר",
  "Offer sheet + מחירון שמחזיק ביקורת",
  "פרופיל ICP + מילון כאב תפעולי",
  "3 פניות אמיתיות שיצאו החוצה",
  "זכויות Case Study על התהליך",
  "ליווי דרך WhatsApp בין הפגישות",
  "מפת Integration 60 לסוף הספרינט",
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
          <p className="cor-overline text-cor-insight">Founding tier</p>
          <h2 id="pricing-title" className="cor-title mt-3 text-foreground">
            תמחור אחד. בלי שכבות. בלי Upsell.
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            מי שנכנס עכשיו משלם כקוהורטה ראשונה — וזוכה לזכויות Case Study מלאות. המחיר עולה אחרי הקוהורטה הזו.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-2xl">
          <div className="cor-card-featured relative rounded-3xl p-8 md:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="cor-overline text-cor-insight">
                  Protocol Ocean Blue · Founding
                </span>
                <h3 className="cor-heading mt-2 text-foreground">
                  ספרינט 30 ימים
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  4 פגישות · 30 ימים · 6 תוצרים
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-muted-foreground line-through">
                    ₪6,500
                  </span>
                  <span className="cor-overline rounded-full border border-cor-opportunity/40 bg-cor-opportunity/10 px-2.5 py-0.5 text-cor-opportunity">
                    Founding
                  </span>
                </div>
                <p className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  ₪2,500
                  <span className="ms-2 text-base font-normal text-muted-foreground">
                    – ₪4,000
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  תלוי היקף · מוסכם בשיחת האבחון
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
