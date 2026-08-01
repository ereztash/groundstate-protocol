import { useEffect, useRef, useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import NecessityChain from "./NecessityChain";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { captureJourney } from "@/lib/journeyCapture";
import { stages, type Stage } from "@/data/sprint-stages";
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
    requestStage(stage.value, "sequence");
  };

  // First point on the page a visitor sees a concrete price (each card's
  // priceLabel). Fires once, via the same observe-then-disconnect pattern the
  // Reveal primitives use for entry.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent("pricing_reached", { source: "sequence_section" });
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
          {/* Removed: "על כל שעת פגישה איתי, אתה חוסך לפחות שעת עבודה בשבוע —
              לכל שארית חיי התהליך." A fixed ratio over an unbounded horizon,
              stated as fact with no n and no source, directly above the price
              ladder. QuantifiedProof.tsx commits the site to "מעט ומאומת" and
              deliberately withholds figures the evidence doesn't carry; this
              line failed that standard. Deleted rather than hedged. */}
          <Guarantee className="mt-6" />
        </Reveal>

        {/* Was CoherenceVectors: four arrows resolving onto a spine, aria-hidden,
            with the entire figure's meaning carried by a one-shot entry
            transition. See NecessityChain for why that could not be tuned into
            working. The chain states the same argument in words, standing
            still. */}
        <Reveal className="mx-auto mt-10 max-w-xl">
          <NecessityChain activeStage={activeStage} />
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

              {/* Price and CTA pinned to the bottom of the card rather than
                  flowing after the copy. Stage 04's deliverable wraps to one
                  more line than the others, which pushed its price and button
                  23px below the rest (46px at 1024px, where two cards wrap
                  long). This row is a price ladder, and comparing four prices
                  is harder when they sit at four heights. The cards already
                  stretch to equal height, so mt-auto is enough. */}
              <div className="mt-auto pt-5">
                <p className="text-base font-semibold text-foreground">
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
