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
        <Reveal className="cor-card-featured p-8 md:p-10 text-center">
          <h2
            id="full-package-title"
            className="cor-title text-foreground"
          >
            החבילה המלאה
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/85">
            שלושים ימים, ארבע פגישות, ליווי בין הפגישות. כל הרצף מהקצה לקצה.
          </p>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              4,500 ש״ח
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="line-through">5,800 ש״ח</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="cta-warm-lg mt-8 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm"
          >
            אני רוצה את החבילה המלאה
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default FullPackageSection;
