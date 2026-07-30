import { Reveal } from "./Reveal";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick } from "@/lib/analytics";
import { Footnote } from "./Footnote";
import { fullPackage } from "@/data/sprint-stages";

const FullPackageSection = () => {
  const { requestStage } = useDiagnosticForm();
  const handleClick = () => {
    trackCtaClick("full_package");
    requestStage("full-package", "full_package");
  };

  return (
    <section
      id="full-package"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="full-package-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="cor-card-featured relative p-8 md:p-12">
          <span className="absolute -top-3 right-8 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
            הבחירה הנפוצה
          </span>

          <p className="cor-overline-he">
            החבילה המלאה
          </p>
          <h2
            id="full-package-title"
            className="cor-title mt-2 text-foreground"
          >
            שלושים ימים. ארבע פגישות. הרצף מהקצה לקצה.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/80">
            כל ארבעת השלבים. ליווי בין הפגישות. תמחור חבילה שחוסך {fullPackage.savingsLabel} לעומת רכישה שלב אחר שלב.
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              <Footnote
                number={2}
                tip={`₪${fullPackage.fullPriceNis.toLocaleString("en-US")} הוא הסכום של 4 השלבים בנפרד (1,000 + 1,300 + 1,600 + 1,900). המחיר האגרגטיבי כולל גם ליווי בין הפגישות בלי תוספת תשלום.`}
              >
                {fullPackage.priceLabel}
              </Footnote>
            </p>
            <p className="text-base text-muted-foreground">
              <span className="line-through">{fullPackage.fullPriceLabel}</span>
            </p>
          </div>

          {/* The cursor-chasing wrapper came out of the hero when the page
              moved to an institutional register; leaving it on the most
              expensive CTA on the page was the inconsistency, not the fix. */}
          <div className="mt-8 inline-block">
            <button
              type="button"
              onClick={handleClick}
              className="cta-action inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:text-base"
            >
              {fullPackage.ctaLabel}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FullPackageSection;
