import { ShieldCheck } from "lucide-react";
import { guarantee } from "@/data/guarantee";
import Price from "@/components/Price";

/**
 * Risk-reversal band on /protocol.
 *
 * Two things were removed here. The first was a lead line promising an hour
 * saved per week for every meeting-hour, for the life of the process: a fixed
 * ratio over an unbounded horizon, with no n and no source. The same sentence
 * was deleted from SequenceSection earlier and survived on this page, which is
 * how an unevidenced claim stays live after it has supposedly been removed.
 *
 * The second was the stage-4 refund being described as a safety net under that
 * ratio. The refund is the guarantee, and it stands on its own.
 *
 * Wording and both lists come from src/data/guarantee.ts so this band and the
 * landing page cannot drift apart again.
 */
const GuaranteeBand = ({ className }: { className?: string }) => (
  <div dir="rtl" className={`cor-card-featured p-6 md:p-8 ${className ?? ""}`}>
    <div className="flex items-start gap-4">
      <ShieldCheck
        aria-hidden="true"
        className="mt-1 h-7 w-7 shrink-0 text-accent"
      />
      <div>
        <p className="cor-overline-he">האחריות</p>
        <p className="cor-heading mt-2 text-foreground">
          {guarantee.headline.split(guarantee.amount)[0]}
          <Price>{guarantee.amount}</Price>
          {guarantee.headline.split(guarantee.amount)[1]}
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="border-s-2 border-primary/40 ps-4">
            <p className="text-[11px] font-semibold tracking-wide text-primary">
              {guarantee.countsLabel}
            </p>
            <ul className="mt-1.5 space-y-1">
              {guarantee.counts.map((c) => (
                <li
                  key={c}
                  className="text-sm leading-relaxed text-foreground/85"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {guarantee.countsNote}
            </p>
          </div>

          <div className="border-s-2 border-border ps-4">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
              {guarantee.excludedLabel}
            </p>
            <ul className="mt-1.5 space-y-1">
              {guarantee.excluded.map((c) => (
                <li
                  key={c}
                  className="text-sm leading-relaxed text-foreground/85"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GuaranteeBand;
