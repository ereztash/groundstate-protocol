import type { CSSProperties } from "react";
import { stages } from "@/data/sprint-stages";
import { SAMPLE_SOURCE_LABEL } from "@/lib/evidence";

/**
 * The hero's picture: three versions of "who am I" struck through in pencil,
 * and the one sheet that survives lying on top of them.
 *
 * It is the headline drawn rather than illustrated. The drafts are the pain
 * the reader already has; the sheet is stage 1's actual artefact line, read
 * from sprint-stages so it cannot drift from the offer, and it carries the
 * same source label every artefact sample carries on this site. It is a
 * reconstruction, and it says so.
 *
 * Decorative as a whole (aria-hidden): the headline beside it states the
 * point in text, so a screen reader loses nothing. CSS only, no JS, finished
 * in ~1.9s, and static under reduced motion.
 */

const DRAFTS = [
  { version: "גרסה 12", text: "אני מלווה נשים וגברים, עסקים קטנים וגדולים, בכל תחום.", tilt: "-3deg" },
  { version: "גרסה 13", text: "מאמנת, יועצת, מנחה, ובעצם עושה קצת מהכל.", tilt: "2deg" },
  { version: "גרסה 14", text: "עוזרת לאנשים למצוא את הקול שלהם.", tilt: "-1.25deg" },
] as const;

/** Strike timing: one stroke per draft, then the sheet arrives. */
const STRIKE_START_MS = 350;
const STRIKE_STEP_MS = 280;
const SHEET_MS = STRIKE_START_MS + DRAFTS.length * STRIKE_STEP_MS + 150;

const narrative = stages[0].artifact;

const DraftStack = () => (
  <div aria-hidden="true" className="relative mx-auto w-full max-w-[440px] select-none">
    <div className="relative flex flex-col gap-2.5 pb-24 sm:gap-3 sm:pb-28">
      {DRAFTS.map((d, i) => (
        <div
          key={d.version}
          className="ld-draft px-4 py-2.5 sm:px-5 sm:py-4"
          style={{ "--tilt": d.tilt } as CSSProperties}
        >
          <p className="text-[11px] font-semibold tracking-[0.08em] text-foreground/45">
            {d.version}
          </p>
          <p className="mt-1 font-heading text-[15px] leading-snug text-foreground/55 sm:text-base">
            <span
              className="ld-struck"
              style={{ "--d": `${STRIKE_START_MS + i * STRIKE_STEP_MS}ms` } as CSSProperties}
            >
              {d.text}
            </span>
          </p>
        </div>
      ))}

      {/* The surviving sheet, laid across the lower drafts. */}
      <div
        className="ld-sheet ld-arrive absolute inset-x-3 bottom-0 px-5 py-5 sm:inset-x-6 sm:px-6"
        style={{ "--d": `${SHEET_MS}ms`, "--tilt": "0.6deg" } as CSSProperties}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold tracking-[0.08em] text-primary">
            {narrative.docLabel} · הגרסה שנשארת
          </p>
          {/* A pencil tick in the margin: the editor's approval. */}
          <svg viewBox="0 0 28 20" className="h-4 w-6 shrink-0">
            <path className="ld-mark" d="M2 11 L10 18 L26 2" />
          </svg>
        </div>
        <p className="mt-2 font-heading text-lg font-bold leading-snug text-foreground sm:text-xl">
          {narrative.sample}
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {SAMPLE_SOURCE_LABEL[narrative.sampleSource]}
        </p>
      </div>
    </div>
  </div>
);

export default DraftStack;
