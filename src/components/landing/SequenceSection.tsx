import { useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import NecessityChain from "./NecessityChain";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import { trackCtaClick } from "@/lib/analytics";
import { stages, type Stage } from "@/data/sprint-stages";

const SequenceSection = () => {
  const { requestStage } = useDiagnosticForm();
  // Which stage the reader is pointing at, so the matching vector in the
  // diagram lights up. Set on hover and on keyboard focus, so it works without
  // a pointer — the cards already take focus for their CTA.
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const handleClick = (stage: Stage) => {
    trackCtaClick(`sequence_${stage.value}`);
    requestStage(stage.value, "sequence");
  };

  // The pricing_reached event moved to FullPackageSection with the price
  // itself: the stage cards stopped carrying prices on 2026-09-29, when the
  // programme became a single ₪4,000 unit.

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
          <p className="mt-4 text-sm font-semibold tracking-wide text-accent">
            חילוץ. הבלטה. תרגום. הפעלה. ארבעה פעלים שלא ניתן לערבב בסדר שלהם.
          </p>
          {/* Removed: "על כל שעת פגישה איתי, אתה חוסך לפחות שעת עבודה בשבוע —
              לכל שארית חיי התהליך." A fixed ratio over an unbounded horizon,
              stated as fact with no n and no source, directly above the price
              ladder. QuantifiedProof.tsx commits the site to "מעט ומאומת" and
              deliberately withholds figures the evidence doesn't carry; this
              line failed that standard. Deleted rather than hedged. The
              guarantee that used to render here moved next to the price in
              FullPackageSection: it refunds the payment, so it belongs where
              the payment is stated. */}
        </Reveal>

        {/* Was CoherenceVectors: four arrows resolving onto a spine, aria-hidden,
            with the entire figure's meaning carried by a one-shot entry
            transition. See NecessityChain for why that could not be tuned into
            working. The chain states the same argument in words, standing
            still. */}
        <Reveal className="mx-auto mt-10 max-w-xl">
          <NecessityChain activeStage={activeStage} />
        </Reveal>

        {/* This line used to sit UNDER the four cards. The order was the
            problem: the cards ask the reader to pick a stage, and the answer
            that they do not have to pick arrived after they had already tried.
            Read first, it turns four purchase decisions into four descriptions.
            The card CTAs moved from "אני רוצה את שלב N" to "לדבר על שלב N" for
            the same reason, and then to "להתחיל משלב N" once the programme
            became one unit: every one of them opens the intake form with an
            entry point, and none of them buys anything. */}
        <Reveal className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          ארבעת השלבים הם תוכנית אחת. מאיפה נכון להתחיל בודקים יחד בשיחה
          הראשונה, ורוב הלקוחות מתחילים בשלב 1.
        </Reveal>

        {/* One row that swipes on phones and stays a grid from sm up.
            Stacked, these four cards were 2,768px on a 390px viewport, 16% of
            the whole page, and a reader met one card per screen anyway — so
            vertical stacking bought no comparison and cost eleven screens.
            Swiping between four cards is faster than scrolling past them, and
            the 82% card width leaves the next one visibly peeking, which is
            what tells a reader the row moves.

            py-3 is load-bearing: overflow-x on one axis makes the other compute
            to auto rather than visible, and RevealItem enters from 12px below
            its resting position, so without the padding the entrance animation
            would spawn a vertical scrollbar inside the strip. Same trap the
            comment in Methodology.tsx records. */}
        <RevealStagger
          className="-mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-4 lg:gap-6"
          as="ol"
        >
          {stages.map((s) => (
            <RevealItem
              key={s.number}
              as="li"
              className="group flex w-[82%] shrink-0 snap-start flex-col sm:w-auto"
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
                {/* The "so what" line. Each deliverable above is a spec, and a
                    spec read alone leaves the reader to infer why they should
                    want it. Kept visually quieter than the spec: it explains
                    the artefact, it does not promise a result. */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.benefit}
                </p>
              </div>

              {/* CTA pinned to the bottom of the card rather than flowing
                  after the copy. Stage 04's deliverable wraps to one more line
                  than the others, which pushed its button 23px below the rest
                  (46px at 1024px, where two cards wrap long). The cards already
                  stretch to equal height, so mt-auto is enough. Each button
                  names an entry point into the one programme; the price lives
                  in FullPackageSection. */}
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => handleClick(s)}
                  className="cta-line inline-flex h-10 items-center justify-center rounded-md px-4 text-sm"
                >
                  {s.ctaLabel}
                </button>
              </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

      </div>
    </section>
  );
};

export default SequenceSection;
