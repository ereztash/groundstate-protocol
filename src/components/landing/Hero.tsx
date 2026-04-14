import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import ConstellationVisual from "./ConstellationVisual";
import { useCalendly } from "./CalendlyProvider";

type HeroProps = {
  onSecondaryClick: () => void;
};

const Hero = ({ onSecondaryClick }: HeroProps) => {
  const { open } = useCalendly();

  return (
    <section
      dir="rtl"
      className="relative min-h-[100svh] overflow-hidden bg-grid-dots bg-noise"
      id="hero"
    >
      {/* Ambient radial wash */}
      <div className="pointer-events-none absolute inset-0 bg-radial-primary" />
      <div className="pointer-events-none absolute inset-0 bg-radial-opportunity" />
      {/* Fade the grid edges */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_50%,transparent_0%,hsl(var(--background))_90%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-28 md:pt-32">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Copy column */}
          <div className="order-2 md:order-1 space-y-8 animate-slow-fade-in">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-subtle-pulse rounded-full bg-primary" />
                <span className="cor-overline text-primary">
                  Protocol Ocean Blue · ספרינט 30 ימים
                </span>
              </div>

              <h1 className="cor-display text-foreground">
                הבידול שלך מתחיל <br className="hidden md:inline" />
                <span className="text-gradient-primary">איפה הדיסציפלינות נפגשות</span>
              </h1>

              <p className="cor-body-lg max-w-xl text-muted-foreground">
                פרוטוקול מובנה של 30 ימים לעצמאים ואינטגרטורים שמחזיקים שתי דיסציפלינות בראש אחד — ולא יודעים איך למכור את זה. ארבע פגישות. שלוש פניות שנשלחו. אות שוק אחד.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={open}
                className="cta-warm-lg inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold tracking-wide"
              >
                <Calendar className="h-4 w-4" />
                קבע שיחת אבחון · 20 דקות
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                onClick={onSecondaryClick}
                className="cta-ghost inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm"
              >
                ראה איך זה עובד
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
              <span className="cor-overline text-muted-foreground">
                ₪2,500–4,000
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="cor-overline text-muted-foreground">
                4 פגישות · פרוטוקול מדוד
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="cor-overline text-cor-success">
                Founding tier פתוח
              </span>
            </div>
          </div>

          {/* Visual column */}
          <div className="order-1 md:order-2">
            <ConstellationVisual />
          </div>
        </div>

        {/* Scroll hint */}
        <button
          onClick={onSecondaryClick}
          className="mt-16 hidden items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          aria-label="גלול למטה"
        >
          <span className="cor-overline">גלול</span>
          <ChevronDown className="h-4 w-4 animate-scroll-hint" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
