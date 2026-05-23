import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick } from "@/lib/analytics";
import { stages, type Stage } from "@/lib/stages";

const SequenceSection = () => {
  const { requestStage } = useDiagnosticForm();

  const handleClick = (stage: Stage) => {
    trackCtaClick(`sequence_${stage.value}`);
    requestStage(stage.value);
  };

  return (
    <section
      id="sequence"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="sequence-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he">
            הרצף
          </p>
          <h2
            id="sequence-title"
            className="cor-title mt-2 text-foreground"
          >
            ארבעה שלבים. סדר קבוע.
          </h2>
        </Reveal>

        <RevealStagger
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          as="ol"
        >
          {stages.map((s) => (
            <RevealItem
              key={s.number}
              as="li"
              className="group flex flex-col"
            >
              <div className="border-t border-foreground pb-2 pt-4">
                <span className="stage-numeral block">{s.number}</span>
              </div>

              <h3 className="cor-subheading mt-4 text-foreground">
                {s.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {s.description}
              </p>

              <div className="mt-5 border-r-2 border-border pr-3">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  תוצר ביד
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                  {s.deliverable}
                </p>
              </div>

              <p className="mt-5 text-base font-semibold text-foreground">
                {s.priceLabel}
              </p>

              <button
                type="button"
                onClick={() => handleClick(s)}
                className="cta-line mt-4 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm"
              >
                {s.ctaLabel}
              </button>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal
          delay={0.1}
          className="mx-auto mt-14 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground"
        >
          לא בטוח מאיפה להתחיל? בשיחה הראשונה נחליט ביחד. רוב הלקוחות מתחילים בשלב 1.
        </Reveal>
      </div>
    </section>
  );
};

export default SequenceSection;
