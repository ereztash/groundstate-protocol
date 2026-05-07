import PrismVisual from "./PrismVisual";
import FounderMark from "./FounderMark";
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
      className="relative pt-24 pb-12 md:pt-32 md:pb-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div className="space-y-6 animate-slow-fade-in md:space-y-7">
            <div className="flex items-center gap-3">
              <FounderMark size="sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">
                  ארז טל-שיר
                </p>
                <p className="text-xs text-muted-foreground">
                  מומחה במטא-תהליכים. עובד סוציאלי טכנולוגי-עסקי.
                </p>
              </div>
            </div>

            <h1 className="cor-display text-foreground">
              מנרטיב לרכישת לקוחות בשלושים ימים.
            </h1>

            <p className="cor-body-lg max-w-xl text-foreground/80">
              אתם כבר חושבים על המוצר, על המכירה, על הלקוחות. אני חושב על הצורה שבה אתם חושבים על זה.
            </p>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={scrollToForm}
                className="cta-action inline-flex max-w-full items-center justify-center rounded-md px-6 py-4 text-right text-sm leading-snug md:text-base"
              >
                20 דקות לזיהוי האירוע שאתה לא מסוגל להחמיא לעצמך עליו היום
              </button>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-accent">
                    ◇
                  </span>
                  20 דקות בלבד
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-accent">
                    ◇
                  </span>
                  ללא תשלום
                </li>
                <li className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-accent">
                    ◇
                  </span>
                  תשובה תוך 24 שעות
                </li>
              </ul>
            </div>

            <div className="border-r-2 border-accent/40 pr-3 pt-2">
              <p className="text-sm leading-relaxed text-foreground/85">
                "המבניות והחיבור מצד אחד ל-AI ומצד שני לסקרנות זה מה שנתן לי ביטחון."
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                לקוחה ראשונה שהשלימה את הרצף. עסקה במספר ארבע ספרות נסגרה.
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
