import { useEffect, useRef, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import CoherenceVectors from "./CoherenceVectors";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { stages, type Stage } from "@/lib/stages";
import Guarantee from "./Guarantee";

const SequenceSection = () => {
  const { requestStage } = useDiagnosticForm();
  // Which stage the reader is pointing at, so the matching vector in the
  // diagram lights up. Set on hover and on keyboard focus, so it works without
  // a pointer — the cards already take focus for their CTA.
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleClick = (stage: Stage) => {
    trackCtaClick(`sequence_${stage.value}`);
    requestStage(stage.value);
  };

  // First point on the page a visitor sees a concrete price (each card's
  // priceLabel) — fires once, matching the pattern CoherenceVectors already
  // uses for its own entry animation.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent("pricing_reached", { source: "sequence_section" });
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
          <p className="mt-4 text-sm font-semibold tracking-wide text-accent">
            חילוץ. הבלטה. תרגום. הפעלה. ארבעה פעלים שלא ניתן לערבב בסדר שלהם.
          </p>
          <p className="mt-4 cor-body-lg text-foreground/80">
            על כל שעת פגישה איתי, אתה חוסך לפחות שעת עבודה בשבוע — לכל שארית חיי התהליך.
          </p>
          <Guarantee className="mt-6" />
        </Reveal>

        {/* The four vectors the brief names — identity, value, product, sale —
            resolving into one direction. Decorative: every stage's meaning is
            in the cards below. */}
        <Reveal className="mx-auto mt-10 max-w-lg">
          <CoherenceVectors activeStage={activeStage} className="w-full" />
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
              <div
                className="flex flex-1 flex-col"
                onMouseEnter={() => setActiveStage(s.value)}
                onMouseLeave={() => setActiveStage(null)}
                onFocusCapture={() => setActiveStage(s.value)}
                onBlurCapture={() => setActiveStage(null)}
                onClick={() => setActiveStage(s.value)}
              >
              <div className="border-t border-foreground pb-2 pt-4">
                <span className="stage-numeral block">{s.number}</span>
              </div>

              <h3 className="cor-subheading mt-4 text-foreground">
                {s.name}
              </h3>

              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-accent">
                <span>הפעולה</span>
                <span aria-hidden="true" className="text-accent/40">:</span>
                <span>{s.verb}</span>
              </p>

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
              </div>
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
