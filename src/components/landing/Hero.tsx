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
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div className="space-y-7 animate-slow-fade-in">
            <p className="cor-overline-he text-muted-foreground">
              מומחה במטא-תהליכים. עובד סוציאלי טכנולוגי-עסקי.
            </p>

            <h1 className="cor-display text-foreground">
              מנרטיב לרכישת לקוחות בשלושים ימים.
            </h1>

            <p className="cor-body-lg max-w-xl text-foreground/80">
              אתם כבר חושבים על המוצר, על המכירה, על הלקוחות. אני חושב על הצורה שבה אתם חושבים על זה.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="cta-action inline-flex max-w-full items-center justify-center rounded-md px-6 py-4 text-right text-sm leading-snug md:text-base"
              >
                20 דקות לזיהוי האירוע שאתה לא מסוגל להחמיא לעצמך עליו היום
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                ללא תשלום. ללא התחייבות. תגיע תשובה תוך 24 שעות.
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <PrismVisual />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
