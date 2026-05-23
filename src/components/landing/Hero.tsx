import { trackCtaClick } from "@/lib/analytics";
import { useDwellState } from "@/lib/useDwellState";
import { getCtaCopy } from "@/lib/dwellCopy";
import { useMagnetic } from "@/lib/useMagnetic";
import { Footnote } from "./Footnote";
import portrait from "@/assets/portrait.png";

const Hero = () => {
  const phase = useDwellState();
  const ctaCopy = getCtaCopy(phase);
  const magneticRef = useMagnetic<HTMLDivElement>({ radius: 110, strength: 0.22 });

  const scrollToForm = () => {
    trackCtaClick("hero_diagnostic");
    document
      .getElementById("diagnostic-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24"
      id="hero"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-soft" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
          {/* Order 1 on every breakpoint — text leads on mobile, no founder-face wall */}
          <div className="order-1 space-y-7 animate-slow-fade-in">
            {/* Quantitative anchor — first thing the eye reaches above the
                emotional hook. Mirrors the TL;DR pattern (dotted-divider
                inline list) but in the brand-primary teal as a smaller
                kicker, so it reads as "credentialed metric" not "feature". */}
            <p
              aria-label="תוצאה ראשונה: עסקה של חמש מאות וחמש מאות שקלים בחודש הראשון"
              className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-primary/85"
            >
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70"
              />
              <span>תוצאה ראשונה</span>
              <span aria-hidden="true" className="text-primary/30">·</span>
              <span>עסקה של ₪5,500</span>
              <span aria-hidden="true" className="text-primary/30">·</span>
              <span>חודש אחד</span>
            </p>

            <h1 id="hero-title" className="cor-display text-foreground">
              יש לך מקצוע. יש לך ידע. אבל כשבא הזמן להגיד את זה ללקוח, הראש מתפזר לעשרה כיוונים בו-זמנית.
            </h1>

            <p id="hero-subtitle" className="cor-body-lg max-w-xl text-foreground/85">
              לא חסר לך ידע. חסר לך מבנה לתרגם אותו.
            </p>

            {/* TL;DR — שורה אחת סקאן-בלית למי שאין לו זמן ל-10 סקציות */}
            <dl
              aria-label="בקצרה"
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-border/80 py-3 text-sm text-foreground/85"
            >
              <div className="flex items-baseline gap-1.5">
                <dt className="text-muted-foreground">משך</dt>
                <dd className="font-semibold">30 יום</dd>
              </div>
              <span aria-hidden="true" className="text-border">•</span>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-muted-foreground">פגישות</dt>
                <dd className="font-semibold">4</dd>
              </div>
              <span aria-hidden="true" className="text-border">•</span>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-muted-foreground">החל מ-</dt>
                <dd className="font-semibold">₪1,000</dd>
              </div>
              <span aria-hidden="true" className="text-border">•</span>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-muted-foreground">תוצר</dt>
                <dd className="font-semibold">
                  <Footnote
                    number={1}
                    tip="ל-Decision Makers שתזהה איתי בשיחה הראשונה. לא רשימה גנרית — בחירה מבוססת ניתוח."
                  >
                    10 פניות יוצאות
                  </Footnote>
                </dd>
              </div>
            </dl>

            <div className="pt-2">
              <div ref={magneticRef} className="inline-block w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToForm}
                  aria-describedby="hero-subtitle"
                  aria-label={ctaCopy}
                  className="cta-warm-lg inline-flex h-14 w-full items-center justify-center rounded-md px-8 text-base transition-[background,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                >
                  {ctaCopy}
                </button>
              </div>
            </div>
          </div>

          {/* Portrait: hidden on the smallest phones (under 380px), small on
              normal mobile, full size on desktop. Saves a viewport worth of
              vertical space on tight screens where the CTA is what matters. */}
          <div className="order-2 hidden min-[380px]:block">
            <figure
              className="relative mx-auto aspect-square w-44 sm:w-56 md:w-full md:max-w-[380px]"
              aria-labelledby="hero-portrait-caption"
            >
              <div
                className="pointer-events-none absolute -inset-4 rounded-full bg-accent/10 blur-3xl md:-inset-6"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-[18%] rounded-full bg-primary/10 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative h-full w-full rounded-full overflow-hidden ring-1 ring-border/60 shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.45)]">
                <img
                  src={portrait}
                  alt="תמונת פורטרט: גבר במעיל כהה וחולצה לבנה, מבט ישיר למצלמה, רקע ירוק זית."
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={420}
                  height={420}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <figcaption id="hero-portrait-caption" className="sr-only">
                פורטרט מקצועי של ארז טל-שיר — יועץ עסקי לעצמאים.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
