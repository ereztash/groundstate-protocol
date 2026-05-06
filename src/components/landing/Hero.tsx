import PrismVisual from "./PrismVisual";
import { trackCtaClick } from "@/lib/analytics";

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
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-soft" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1 space-y-7 animate-slow-fade-in">
            <h1 className="cor-display text-foreground">
              מומחה במטא-תהליכים. עובד סוציאלי טכנולוגי-עסקי. מנרטיב לרכישת לקוחות בשלושים ימים.
            </h1>

            <p className="cor-body-lg max-w-xl text-foreground/85">
              אתם כבר חושבים על המוצר, על המכירה, על הלקוחות. אני חושב על הצורה שבה אתם חושבים על זה.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="cta-warm-lg inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
              >
                20 דקות לזיהוי האירוע שאתה לא מסוגל להחמיא לעצמך עליו היום
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <PrismVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
