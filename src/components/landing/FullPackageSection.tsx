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
        <Reveal className="cor-card-featured relative p-8 md:p-12">
          <span className="absolute -top-3 right-8 inline-flex items-center rounded-full bg-accent px-3 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
            הבחירה הנפוצה
          </span>

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

          <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm leading-relaxed text-foreground/90">
            <li className="flex gap-3">
              <span className="mt-0.5 select-none text-accent" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong className="font-semibold">ארבע פגישות אישיות</strong> בזום או פנים אל פנים, כל פגישה כ-90 דקות.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 select-none text-accent" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong className="font-semibold">ארבעה תוצרים מוכנים</strong>: נרטיב כתוב, הצעת ערך, תיאור מוצר עם תמחור, ועשר פניות מתועדות.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 select-none text-accent" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong className="font-semibold">ליווי בין פגישות</strong> ב-WhatsApp לשאלות תפעוליות וחידודי ניסוח.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 select-none text-accent" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong className="font-semibold">סיכום בכתב אחרי כל פגישה</strong>, כולל המשימות לשבוע הבא ומה לחפש במה שיצא.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 select-none text-accent" aria-hidden="true">
                ◇
              </span>
              <span>
                <strong className="font-semibold">אבחון התאמה</strong> ללא תשלום לפני שמתחילים, כדי לוודא שהרצף מתאים לכם.
              </span>
            </li>
          </ul>

          <button
            type="button"
            onClick={handleClick}
            className="cta-action mt-8 inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold md:text-base"
          >
            אני רוצה את החבילה המלאה
          </button>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            כל שלב נסגר לחוד. אין הסכמים ארוכי טווח.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default FullPackageSection;
