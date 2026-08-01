import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { stages } from "@/data/sprint-stages";
import { SAMPLE_SOURCE_LABEL } from "@/lib/evidence";

/**
 * Artefact proof: the four things the sprint produces, as visible objects.
 *
 * This section and SequenceSection used to render the same four stages twice —
 * once as documents, once as a priced ladder — off two separate data sources.
 * They now do two different jobs from one source (src/data/sprint-stages.ts):
 * this one answers "what do I end up holding", SequenceSection answers "what is
 * the order, and what does each step cost".
 *
 * Every sample line is labelled by its provenance, derived from the artefact's
 * `sampleSource` rather than written per card. A method reconstruction and a
 * redacted real excerpt are both legitimate; presenting one as the other is not.
 *
 * No outcome claim lives here. What a deliverable *is* is a specification;
 * whether it produced revenue is a separate question, answered by the evidence
 * chain with its own tags.
 */
const DeliverablesPreview = () => {
  return (
    <section
      id="deliverables"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="deliverables-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he">ארבעה תוצרים</p>
          <h2 id="deliverables-title" className="cor-title mt-2 text-foreground">
            ככה נראה התוצר שנשאר אצלך.
          </h2>
          <p className="cor-body-lg mt-4 text-foreground/80">
            כל שלב מסתיים במסמך שאת לוקחת הביתה. אפשר לפתוח אותו שוב מחר, בעוד
            חודש, או להעביר ליועץ אחר כדי לבחון.
          </p>
        </Reveal>

        {/* Swipes on phones, grid from sm up — same treatment as the price
            ladder, and for the same measurement: stacked, these four were
            1,823px on a 390px viewport. Roughly a quarter of that is the
            decorative body lines, which are aria-hidden filler standing in for
            document text, so it was the cheapest height on the page to reclaim.
            See SequenceSection for why py-3 is required rather than cosmetic. */}
        <RevealStagger
          className="-mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 py-3 sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 sm:grid-cols-2 lg:grid-cols-4"
          as="ul"
        >
          {stages.map((stage) => {
            const a = stage.artifact;
            return (
              <RevealItem
                as="li"
                key={stage.value}
                className="block w-[82%] shrink-0 snap-start sm:w-auto"
              >
                <article
                  aria-label={`תוצר עבור ${stage.name}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5 shadow-[0_2px_6px_-2px_hsl(var(--foreground)/0.06)] transition-shadow hover:shadow-[0_8px_20px_-8px_hsl(var(--foreground)/0.12)]"
                  style={{ minHeight: "260px" }}
                >
                  <header className="flex items-baseline justify-between border-b border-border/70 pb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {a.docLabel}
                    </span>
                    <span className="stage-numeral text-xl" aria-hidden="true">
                      {stage.number}
                    </span>
                  </header>

                  {/* Provenance sits directly above the sample, not in a
                      footnote at the foot of the section. A caveat the reader
                      meets after the claim has landed is decoration. */}
                  <p className="mt-3 inline-flex self-start rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">
                    {SAMPLE_SOURCE_LABEL[a.sampleSource]}
                  </p>

                  <p
                    dir="rtl"
                    className="mt-2 text-xs font-semibold leading-snug text-primary/90"
                  >
                    ״{a.sample}״
                  </p>

                  {a.secondaryDoc && (
                    <p className="mt-3 inline-flex items-center gap-1 self-start rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-[11px] font-semibold text-accent">
                      + {a.secondaryDoc}
                    </p>
                  )}

                  {/* Stylised body lines: a visual stand-in for the rest of the
                      document, never real content. */}
                  <div className="mt-4 flex-1 space-y-2" aria-hidden="true">
                    {Array.from({ length: a.lineCount }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[5px] rounded-full bg-foreground/10"
                        style={{ width: `${72 + ((i * 17) % 26)}%` }}
                      />
                    ))}
                  </div>

                  <footer className="mt-4 border-t border-border/70 pt-3">
                    <span className="text-[11px] font-medium text-foreground/70">
                      {stage.name}
                    </span>
                  </footer>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
};

export default DeliverablesPreview;
