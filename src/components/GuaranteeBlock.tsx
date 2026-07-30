import { ShieldCheck } from "lucide-react";
import Price from "@/components/Price";
import type { GuaranteeVariant } from "@/data/guarantee";

/**
 * Renders one guarantee variant. Shared by the two live surfaces and by the
 * review page, so what Erez approves is exactly what would ship.
 *
 * `compact` is the inline form used inside SequenceSection; the full form is the
 * band on /protocol. The signal list travels in both, because the promise is
 * only checkable if the trigger is spelled out.
 */
const GuaranteeBlock = ({
  variant,
  compact = false,
  className = "",
}: {
  variant: GuaranteeVariant;
  compact?: boolean;
  className?: string;
}) => {
  const headline = variant.amount ? (
    <>
      {variant.headline.split(variant.amount)[0]}
      <Price>{variant.amount}</Price>
      {variant.headline.split(variant.amount)[1]}
    </>
  ) : (
    variant.headline
  );

  if (compact) {
    return (
      <div className={`text-sm leading-relaxed text-foreground/80 ${className}`}>
        <p className="flex items-start gap-2.5">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-primary"
          />
          <span>
            <span className="font-semibold text-foreground">האחריות</span>{" "}
            {headline}
          </span>
        </p>
        <p className="mt-2 ps-7 text-xs leading-relaxed text-muted-foreground">
          {variant.signalsLabel}: {variant.signals.join("; ")}.{" "}
          {variant.signalsNote} {variant.excludedLabel}:{" "}
          {variant.excluded.join(" ")} {variant.documentation}
        </p>
      </div>
    );
  }

  return (
    <div dir="rtl" className={`cor-card-featured p-6 md:p-8 ${className}`}>
      <div className="flex items-start gap-4">
        <ShieldCheck
          aria-hidden="true"
          className="mt-1 h-7 w-7 shrink-0 text-accent"
        />
        <div>
          <p className="cor-overline-he">האחריות</p>
          <p className="cor-heading mt-2 text-foreground">{headline}</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="border-s-2 border-primary/40 ps-4">
              <p className="text-[11px] font-semibold tracking-wide text-primary">
                {variant.signalsLabel}
              </p>
              <ul className="mt-1.5 space-y-1">
                {variant.signals.map((s) => (
                  <li key={s} className="text-sm leading-relaxed text-foreground/85">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                {variant.signalsNote}
              </p>
            </div>

            <div className="border-s-2 border-border ps-4">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                {variant.excludedLabel}
              </p>
              <ul className="mt-1.5 space-y-1">
                {variant.excluded.map((s) => (
                  <li key={s} className="text-sm leading-relaxed text-foreground/85">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                {variant.documentation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeBlock;
