import { trackCtaClick } from "@/lib/analytics";
import portrait from "@/assets/portrait.png";

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
      className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24"
      id="hero"
      aria-labelledby="hero-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-soft" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1 space-y-7 animate-slow-fade-in">
            <h1 id="hero-title" className="cor-display text-foreground">
              מומחה במטא-תהליכים. עובד סוציאלי טכנולוגי-עסקי. מנרטיב לרכישת לקוחות בשלושים ימים.
            </h1>

            <p id="hero-subtitle" className="cor-body-lg max-w-xl text-foreground/85">
              אתם כבר חושבים על המוצר, על המכירה, על הלקוחות. אני חושב על הצורה שבה אתם חושבים על זה.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                aria-describedby="hero-subtitle"
                aria-label="הזמנת אבחון: 20 דקות לזיהוי האירוע שאתה לא מסוגל להחמיא לעצמך עליו היום"
                className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                20 דקות לזיהוי האירוע שאתה לא מסוגל להחמיא לעצמך עליו היום
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <figure
              className="relative mx-auto w-full max-w-[420px] aspect-square"
              aria-labelledby="hero-portrait-caption"
            >
              <div
                className="pointer-events-none absolute -inset-6 rounded-full bg-accent/10 blur-3xl"
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
                פורטרט מקצועי של בעל האתר — מומחה במטא-תהליכים, עובד סוציאלי בעל רקע טכנולוגי-עסקי.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
