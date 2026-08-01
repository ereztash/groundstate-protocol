import { outreachCount } from "@/data/sprint-stages";
import type { StageValue } from "./DiagnosticFormProvider";

/**
 * The sequence read backwards, as a chain of necessity.
 *
 * Replaces CoherenceVectors, which drew the same four stages as four arrows
 * resolving onto a spine. That figure had one defect that no amount of tuning
 * fixes: its whole meaning lived in a 1.1s transition fired once on scroll
 * entry. Its resting state was four identical parallel arrows and an unlabelled
 * dashed line, it carried no caption, and it was `aria-hidden`. A reader who
 * scrolled past quickly saw a decoration. A reader who asked for reduced motion
 * saw ONLY the resting state, permanently, because the global reduced-motion
 * rule clamps transition-duration to 0.01ms.
 *
 * This figure is legible standing still. Nothing here depends on motion, so
 * there is nothing to miss and nothing for the reduced-motion rule to take
 * away, and it is real content rather than decoration, so it is not hidden from
 * assistive tech.
 *
 * It asserts nothing new. Every link is one of the four stages already in
 * sprint-stages.ts, read in reverse, plus the intake call the site already
 * offers. The claim shape is conditional throughout ("to get X you first need
 * Y"), which is a statement about order — the one claim `src/data/claims.ts`
 * marks `anchored`. It promises no outcome and states no rate, so it needs no
 * ledger row to publish.
 */

type Link = {
  /** What has to exist at this point in the chain. */
  goal: string;
  /** The stage that produces it. Null for the entry point, which is not a paid stage. */
  numeral: string | null;
  /** Wired to the parent's hover/focus state so the mapping is visible. */
  value: StageValue | null;
};

// Ordered from the end result backwards, which is the direction the argument
// runs. The numerals descend for the same reason: 04 first is the visible
// signal that this is the sequence in reverse, before anyone reads a word.
const CHAIN: Link[] = [
  {
    goal: `${outreachCount} פניות שיצאו, כל אחת לנמען שנבחר בשמו ובתפקידו`,
    numeral: "04",
    value: "stage-4",
  },
  {
    goal: `${outreachCount} אנשים שיש להם בדיוק את הבעיה הזאת`,
    numeral: "04",
    value: "stage-4",
  },
  {
    goal: "מוצר עם התחלה, אמצע וסוף, שברור בו מה הלקוח מקבל",
    numeral: "03",
    value: "stage-3",
  },
  {
    goal: "הערך העסקי הייחודי שאתה יכול לתת",
    numeral: "02",
    value: "stage-2",
  },
  {
    goal: "הערך הייחודי שלך",
    numeral: "01",
    value: "stage-1",
  },
  {
    goal: "שיחה אחת, עשרים דקות",
    numeral: null,
    value: null,
  },
];

type Props = {
  /** Stage value currently hovered or focused in the parent, or null. */
  activeStage?: string | null;
  className?: string;
};

const NecessityChain = ({ activeStage = null, className }: Props) => {
  return (
    <div dir="rtl" className={className}>
      <p className="cor-overline-he">המודל הלוגי</p>
      <h3 className="cor-subheading mt-2 text-foreground">
        מהסוף להתחלה
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        למטה זה נקרא הפוך מהכרטיסים: מתחילים מהתוצר האחרון, ויורדים אל מה שצריך
        להתקיים כדי שהוא יהיה אפשרי.
      </p>

      <ol className="mt-7 space-y-0">
        {CHAIN.map((link, i) => {
          const isLast = i === CHAIN.length - 1;
          const isActive = link.value !== null && link.value === activeStage;

          return (
            <li key={`${link.numeral ?? "intake"}-${i}`}>
              <div className="flex items-start gap-3.5">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors ${
                    isActive
                      ? "border-accent bg-accent text-accent-foreground"
                      : link.numeral
                        ? "border-border bg-card text-foreground/70"
                        : "border-dashed border-border bg-transparent text-muted-foreground"
                  }`}
                >
                  {link.numeral ?? "•"}
                </span>
                <p
                  className={`text-sm leading-relaxed transition-colors ${
                    isActive ? "text-foreground" : "text-foreground/85"
                  }`}
                >
                  {link.numeral && (
                    <span className="sr-only">שלב {link.numeral}: </span>
                  )}
                  {link.goal}
                </p>
              </div>

              {!isLast && (
                // The connector carries the argument, so it is text rather than
                // a graphic: the line is what a sighted reader follows and the
                // words are what everyone else gets.
                <div className="flex items-stretch gap-3.5">
                  <div className="flex w-7 justify-center" aria-hidden="true">
                    <span className="my-1 w-px bg-border" />
                  </div>
                  <p className="py-1.5 text-[11px] font-semibold tracking-wide text-accent">
                    בשביל זה צריך
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default NecessityChain;
