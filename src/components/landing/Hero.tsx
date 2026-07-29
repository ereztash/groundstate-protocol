import type { CSSProperties } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { Footnote } from "./Footnote";

// Portrait lives under public/ so index.html can preload it before the JS
// bundle even parses. Cuts ~500ms off mobile LCP. The literal path uses
// BASE_URL at runtime so it works at both / (Lovable) and /groundstate-
// protocol/ (GitHub Pages).
const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * The programme's hard numbers, promoted out of the old 11.5px kicker line.
 *
 * `scatter` is each cell's starting offset for the entrance: a small
 * displacement and a degree of tilt that resolves to zero. The values are
 * hand-set rather than random so the sequence is identical on every load and
 * matches the prerendered markup. Only the dt/dd resolve — the grid frame
 * itself never moves, so the read is "data settling into a structure" rather
 * than the structure wobbling.
 */
const SPEC = [
  { value: "30", unit: "יום", label: "משך התוכנית", scatter: { x: "-9px", r: "-1.1deg" } },
  { value: "4", unit: "מפגשים", label: "בני 60 דקות", scatter: { x: "7px", r: "0.9deg" } },
  { value: "10", unit: "פניות", label: "יוצאות, בסיום", scatter: { x: "-6px", r: "1.2deg" } },
  { value: "₪1,000", unit: "", label: "החל מ־", scatter: { x: "8px", r: "-0.8deg" } },
];

/** Entrance offsets, in ms. The last cell resolves at 580 + 560 = 1140ms. */
const SETTLE = {
  eyebrow: 0,
  subtitle: 140,
  portrait: 220,
  specFirst: 340,
  specStep: 80,
  cta: 660,
} as const;

/** Feeds `.cor-settle` (index.css) its per-element delay and starting offset. */
function settleStyle(
  delayMs: number,
  scatter?: { x: string; r: string },
): CSSProperties {
  return {
    "--settle-delay": `${delayMs}ms`,
    ...(scatter && { "--settle-x": scatter.x, "--settle-r": scatter.r }),
  } as CSSProperties;
}

const Hero = () => {
  const scrollToForm = () => {
    trackCtaClick("hero_diagnostic");
    document
      .getElementById("diagnostic-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      dir="rtl"
      className="relative pt-28 pb-20 md:pt-32 md:pb-24"
      id="hero"
      aria-labelledby="hero-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-10 md:grid-cols-[1.25fr_1fr] md:gap-16">
          {/* Order 1 on every breakpoint — text leads on mobile, no founder-face wall */}
          <div className="order-1">
            {/* Programme label. Institutional register: names the offering
                rather than addressing the reader. */}
            <p
              className="cor-settle text-[11.5px] font-semibold uppercase tracking-[0.18em] text-primary/85"
              style={settleStyle(SETTLE.eyebrow)}
            >
              COR-SYS · תוכנית ליווי לעצמאים
            </p>

            <h1
              id="hero-title"
              className="cor-settle-lcp cor-display mt-5 text-foreground"
            >
              תרגום מומחיות מקצועית להצעה שהשוק קונה.
            </h1>

            <p
              id="hero-subtitle"
              className="cor-settle cor-body-lg mt-5 max-w-xl text-foreground/85"
              style={settleStyle(SETTLE.subtitle)}
            >
              תוכנית מובנית בת 30 יום לעצמאים שהידע המקצועי שלהם מבוסס, וההצעה
              העסקית שנגזרת ממנו — פחות.
            </p>

            {/* Specification grid. The hairline separators come from a 1px gap
                over a border-coloured backdrop, which stays correct in RTL
                without any directional border utilities. */}
            <dl className="mt-7 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
              {SPEC.map((item, i) => {
                const style = settleStyle(
                  SETTLE.specFirst + i * SETTLE.specStep,
                  item.scatter,
                );
                return (
                  <div key={item.label} className="bg-background px-3 py-3 sm:px-4 sm:py-4">
                    <dt
                      className="cor-settle text-[11px] font-medium tracking-[0.08em] text-muted-foreground"
                      style={style}
                    >
                      {item.label}
                    </dt>
                    <dd
                      className="cor-settle mt-1 flex items-baseline gap-1.5"
                      style={style}
                    >
                      <span className="text-xl font-bold leading-none tracking-tight text-foreground sm:text-2xl">
                        {item.value}
                      </span>
                      {item.unit && (
                        <span className="text-sm text-foreground/70">
                          {item.unit}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="cor-settle mt-7" style={settleStyle(SETTLE.cta)}>
              <button
                type="button"
                onClick={scrollToForm}
                aria-describedby="hero-subtitle hero-cta-note"
                className="cta-warm-lg inline-flex h-14 w-full items-center justify-center rounded-md px-8 text-base transition-[background,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
              >
                לתיאום שיחת אבחון
              </button>
              <p
                id="hero-cta-note"
                className="mt-4 max-w-md text-sm leading-relaxed text-foreground/70"
              >
                שיחה בת 20 דקות, ללא עלות. בסופה הערכה מסודרת: מוקד החסימה, נקודת
                הפתיחה המומלצת, והאם קיימת התאמה לתוכנית. במקרה שאין — הדבר ייאמר
                במפורש.
              </p>

              {/* Recorded outcome, cited rather than announced. Sits below the
                  CTA: it is corroboration, not a precondition for acting, and
                  above it the button drops off a 667px viewport. */}
              <p className="mt-6 border-s-2 border-primary/40 ps-4 text-sm leading-relaxed text-foreground/80">
                תוצאה מתועדת ראשונה:{" "}
                <span className="font-semibold text-foreground">
                  עסקה של ₪5,500
                </span>{" "}
                נסגרה בתוך החודש הראשון לתוכנית.{" "}
                <Footnote
                  number={1}
                  tip="רשימת הפנייה נבנית מול Decision Makers שמזוהים בשיחת האבחון הראשונה — לא רשימה גנרית, אלא בחירה מבוססת ניתוח."
                >
                  כיצד נבנית רשימת הפנייה
                </Footnote>
              </p>
            </div>
          </div>

          {/* Portrait: hidden on the smallest phones (under 380px), small on
              normal mobile, full size on desktop. Saves a viewport worth of
              vertical space on tight screens where the CTA is what matters. */}
          <div
            className="cor-settle order-2 hidden min-[380px]:block"
            style={settleStyle(SETTLE.portrait)}
          >
            {/* The asset itself carries a baked-in circular crop on charcoal,
                so a square frame exposes the dark corners and reads as a
                mistake. Kept round — but as a plain ring, with the halo,
                breathing aura and pulse glow all removed. */}
            <figure className="mx-auto w-44 sm:w-56 md:w-full md:max-w-[320px]">
              <div className="overflow-hidden rounded-full border border-border">
                <img
                  src={portrait}
                  alt="תמונת פורטרט: גבר במעיל כהה וחולצה לבנה, מבט ישיר למצלמה, רקע ירוק זית."
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width={420}
                  height={420}
                  className="aspect-square h-full w-full object-cover object-center"
                />
              </div>
              <figcaption className="mt-5 border-t border-border pt-3 text-center text-sm text-foreground/75 md:text-start">
                <span className="font-semibold text-foreground">ארז טל-שיר</span>
                <span className="block text-[13px] text-muted-foreground">
                  מייסד COR-SYS
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
