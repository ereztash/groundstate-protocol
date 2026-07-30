import {
  EVIDENCE_LABEL,
  EVIDENCE_MEANING,
  type EvidenceLevel,
} from "@/lib/evidence";

/**
 * Renders an evidence level as a visible tag.
 *
 * `pending` gets the same visual weight as the other two on purpose. A caveat
 * rendered smaller or greyer than the claim it qualifies is a caveat the reader
 * skips, which defeats the point of tagging at all.
 *
 * The meaning of the level rides in the `title` and in the accessible name, so
 * a reader who does not already know the vocabulary can find out without
 * leaving the page.
 */
const STYLE: Record<EvidenceLevel, string> = {
  anchored: "border-primary/40 bg-primary/[0.07] text-primary",
  operator: "border-accent/40 bg-accent/[0.07] text-accent",
  pending: "border-border bg-foreground/[0.05] text-muted-foreground",
};

const EvidenceTag = ({
  level,
  className = "",
}: {
  level: EvidenceLevel;
  className?: string;
}) => (
  <span
    dir="rtl"
    title={EVIDENCE_MEANING[level]}
    className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${STYLE[level]} ${className}`}
  >
    <span className="sr-only">רמת ראיה: </span>
    {EVIDENCE_LABEL[level]}
    <span className="sr-only">, {EVIDENCE_MEANING[level]}</span>
  </span>
);

export default EvidenceTag;
