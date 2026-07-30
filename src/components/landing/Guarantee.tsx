import { ShieldCheck } from "lucide-react";
import { guarantee } from "@/data/guarantee";

/**
 * Compact guarantee line, used inside SequenceSection.
 *
 * This used to promise something different from the band on /protocol: a
 * sharper narrative or no payment for stage 1. Only the stage-4 guarantee has a
 * stated source, and it was also phrased "בלי טופס, בלי ויכוח", which is the
 * "no questions asked" framing the guarantee is explicitly not allowed to use.
 * Both surfaces now render the one guarantee from src/data/guarantee.ts.
 *
 * The trigger list is what makes the promise checkable, so it travels with the
 * headline rather than being left on the other page.
 */
type GuaranteeProps = { className?: string };

const Guarantee = ({ className = "" }: GuaranteeProps) => (
  <div className={`text-sm leading-relaxed text-foreground/80 ${className}`}>
    <p className="flex items-start gap-2.5">
      <ShieldCheck
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
      />
      <span>
        <span className="font-semibold text-foreground">האחריות</span>{" "}
        {guarantee.headline}
      </span>
    </p>
    <p className="mt-2 ps-7 text-xs leading-relaxed text-muted-foreground">
      {guarantee.countsLabel}: {guarantee.counts.join(", ")}.{" "}
      {guarantee.countsNote} {guarantee.excludedLabel}:{" "}
      {guarantee.excluded.join(" ")}
    </p>
  </div>
);

export default Guarantee;
