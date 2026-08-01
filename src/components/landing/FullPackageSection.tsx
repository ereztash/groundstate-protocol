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

          {/* The footnote marker used to sit on {priceLabel}, i.e. on ₪4,500,
              while its tip explains what ₪5,800 is. Two defects in one marker.

              Attached to the wrong number: a reader who worked out that the
              small digit was a button got an answer about the figure beside the
              one they clicked.

              And attached to a numeral at all: at text-5xl a 0.65em superscript
              renders around 30px, hard against the price, so "₪4,500" plus "2"
              reads as ₪4,5002. Editorial practice puts a reference marker after
              a word for exactly this reason, which is what Hero's footnote 1
              already does ("כיצד נבנית רשימת הפנייה"). It now hangs off the
              word, on the figure it actually explains. */}
          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {fullPackage.priceLabel}
            </p>
            <p className="text-base text-muted-foreground">
              <span className="line-through">{fullPackage.fullPriceLabel}</span>{" "}
              <Footnote
                number={2}
                tip={`₪${fullPackage.fullPriceNis.toLocaleString("en-US")} הוא הסכום של 4 השלבים בנפרד (1,000 + 1,300 + 1,600 + 1,900). המחיר האגרגטיבי כולל גם ליווי בין הפגישות בלי תוספת תשלום.`}
              >
                בנפרד
              </Footnote>
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
