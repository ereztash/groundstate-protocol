import { trackCtaClick } from "@/lib/analytics";
import { Footnote } from "./Footnote";

// Portrait lives under public/ so index.html can preload it before the JS
// bundle even parses. Cuts ~500ms off mobile LCP. The literal path uses
// BASE_URL at runtime so it works at both / (Lovable) and /groundstate-
// protocol/ (GitHub Pages).
const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/** The programme's hard numbers, promoted out of the old 11.5px kicker line. */
const SPEC = [
  { value: "30", unit: "יום", label: "משך התוכנית" },
  { value: "4", unit: "מפגשים", label: "בני 60 דקות" },
  { value: "10", unit: "פניות", label: "יוצאות, בסיום" },
  { value: "₪1,000", unit: "", label: "החל מ־" },
];

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
          <div className="order-1 animate-slow-fade-in">
            {/* Programme label. Institutional register: names the offering
                rather than addressing the reader. */}
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-primary/85">
              COR-SYS · תוכנית ליווי לעצמאים
            </p>

            <h1 id="hero-title" className="cor-display mt-5 text-foreground">
              תרגום מומחיות מקצועית להצעה שהשוק קונה.
            </h1>

            <p
              id="hero-subtitle"
              className="cor-body-lg mt-5 max-w-xl text-foreground/85"
            >
              תוכנית מובנית בת 30 יום לעצמאים שהידע המקצועי שלהם מבוסס, וההצעה
              העסקית שנגזרת ממנו — פחות.
            </p>

            {/* Specification grid. The hairline separators come from a 1px gap
                over a border-coloured backdrop, which stays correct in RTL
                without any directional border utilities. */}
            <dl className="mt-7 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
              {SPEC.map((item) => (
                <div key={item.label} className="bg-background px-3 py-3 sm:px-4 sm:py-4">
                  <dt className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 flex items-baseline gap-1.5">
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
              ))}
            </dl>

            <div className="mt-7">
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
          <div className="order-2 hidden min-[380px]:block">
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
