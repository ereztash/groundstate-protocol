import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import PrismVisual from "./PrismVisual";
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
      <div className="pointer-events-none absolute inset-0 bg-radial-primary" />
      <div className="pointer-events-none absolute inset-0 bg-radial-opportunity" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_60%_at_50%_50%,transparent_0%,hsl(var(--background))_90%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-28 md:pt-32">
        <div className="grid w-full items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1 space-y-8 animate-slow-fade-in">
            <div className="space-y-5">
              {/* Fresh-start cue + identity prime (Dai/Milkman/Riis 2014; Bryan 2011) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 animate-subtle-pulse rounded-full bg-primary" />
                  <span className="cor-overline text-primary">
                    Protocol Ocean Blue · ספרינט 30 ימים
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cor-opportunity/40 bg-cor-opportunity/10 px-3 py-1">
                  <span className="cor-overline text-cor-opportunity">
                    Cohort Q2 2026 · פתוחה
                  </span>
                </div>
              </div>

              {/* Concrete, specific outcome headline (Trope & Liberman 2010 CLT) */}
              <h1 className="cor-display text-foreground">
                שלוש חזיתות. במקביל. <br className="hidden md:inline" />
                <span className="text-gradient-primary">
                  לקוח ראשון ב-30 יום.
                </span>
              </h1>

              <p className="cor-body-lg max-w-xl text-muted-foreground">
                המנסרה שוברת שאלה אחת מעורפלת לשלושה מסלולים שרצים במקביל —{" "}
                <span className="text-foreground">A</span> איפה אתה עכשיו,{" "}
                <span className="text-foreground">B</span> לאן אתה רוצה להגיע, ו
                <span className="text-foreground">Data</span> שמצדיק את המעבר. בפגישה הרביעית אני יוצא איתך לפניות קרות — ליווי אישי עד הלקוח הראשון.
              </p>

              {/* Loss-frame microcopy (Kahneman & Tversky 1979 — loss aversion ≈2x gain) */}
              <p className="text-sm leading-relaxed text-foreground/70">
                עוד חודש של "אני עדיין מנסח מחדש" שווה לך את הלקוח הבא שלא תפגוש.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* CTA action-specificity (Gollwitzer 1999 implementation intentions) */}
              <button
                onClick={open}
                className="cta-warm-lg inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold tracking-wide"
                aria-label="קבע שיחת אבחון של 20 דקות"
              >
                <Calendar className="h-4 w-4" />
                קבע 20 דקות · 3 שאלות שמכריעות
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                onClick={onSecondaryClick}
                className="cta-ghost inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm"
              >
                ראה איך המנסרה עובדת
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Price with industry anchor (Tversky & Kahneman 1974 — anchoring) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
              <span className="cor-overline text-muted-foreground">
                <span className="line-through opacity-60">
                  Fractional B2B · $4,000–$20,000/חודש
                </span>
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="cor-overline text-foreground">
                ₪2,000 לתהליך כולו
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="cor-overline text-cor-success">
                שיחת אבחון · ללא עלות
              </span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <PrismVisual />
          </div>
        </div>

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
