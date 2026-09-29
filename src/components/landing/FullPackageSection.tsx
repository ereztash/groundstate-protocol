import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { captureJourney } from "@/lib/journeyCapture";
import { program } from "@/data/sprint-stages";
import Guarantee from "./Guarantee";

/**
 * The programme and its one price.
 *
 * Was the "full package" card: ₪4,500 struck against ₪5,800, the sum of four
 * separately priced stages, under a "הבחירה הנפוצה" badge. On 2026-09-29 the
 * programme became a single unit at ₪4,000 and the stages stopped carrying
 * prices, so the comparison, the footnote explaining it and the badge all went.
 * The badge had no evidence level either, and with one option there is nothing
 * for it to be the common choice among.
 *
 * The guarantee sits directly under the price because what it refunds is this
 * payment.
 */
const FullPackageSection = () => {
  const { requestStage } = useDiagnosticForm();
  const sectionRef = useRef<HTMLElement>(null);

  const handleClick = () => {
    trackCtaClick("full_package");
    requestStage("full-package", "full_package");
  };

  // First point on the page a visitor sees the price. Moved here from
  // SequenceSection with the price itself. Fires once, via the same
  // observe-then-disconnect pattern the Reveal primitives use for entry.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent("pricing_reached", { source: "full_package_section" });
        captureJourney({
          stage: "interest",
          event: "reached",
          evidence_type: "observed",
          outcome_type: "unknown",
          summary_code: "pricing_seen",
        });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="full-package"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="full-package-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="cor-card-featured relative p-8 md:p-12">
          <p className="cor-overline-he">{program.name}</p>
          <h2
            id="full-package-title"
            className="cor-title mt-2 text-foreground"
          >
            שלושים ימים. ארבע פגישות. הרצף מהקצה לקצה.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/80">
            {program.deliverable}
          </p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {program.priceLabel}
            </p>
            <p className="text-base text-muted-foreground">
              {program.installmentsLabel}
            </p>
          </div>

          <Guarantee className="mt-8" />

          {/* The cursor-chasing wrapper came out of the hero when the page
              moved to an institutional register; leaving it on the most
              expensive CTA on the page was the inconsistency, not the fix. */}
          <div className="mt-8 inline-block">
            <button
              type="button"
              onClick={handleClick}
              className="cta-action inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:text-base"
            >
              {program.ctaLabel}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FullPackageSection;
