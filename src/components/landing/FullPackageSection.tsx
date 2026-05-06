import { Reveal } from "./Reveal";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick } from "@/lib/analytics";

const FullPackageSection = () => {
  const { requestStage } = useDiagnosticForm();

  const handleClick = () => {
    trackCtaClick("full_package");
    requestStage("full-package");
  };

  return (
    <section
      id="full-package"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="full-package-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="cor-card-featured p-8 md:p-12">
          <p className="cor-overline-he text-accent">
            החבילה המלאה
          </p>
          <h2
            id="full-package-title"
            className="cor-title mt-2 text-foreground"
          >
            שלושים ימים. ארבע פגישות. הרצף מהקצה לקצה.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/80">
            כל ארבעת השלבים. ליווי בין הפגישות. תמחור אגרגטיבי שחוסך 1,300 ש״ח לעומת רכישה שלב אחר שלב.
          </p>

          <div className="mt-8 flex items-baseline gap-3">
            <p className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              4,500 ש״ח
            </p>
            <p className="text-base text-muted-foreground">
              <span className="line-through">5,800 ש״ח</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="cta-action mt-8 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:text-base"
          >
            אני רוצה את החבילה המלאה
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default FullPackageSection;
