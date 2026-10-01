import { ShieldCheck } from "lucide-react";
import Price from "@/components/Price";
import type { GuaranteeVariant } from "@/data/guarantee";

/**
 * Renders one guarantee variant. Shared by the two live surfaces and by the
 * review page, so what Erez approves is exactly what would ship.
 *
 * `compact` is the inline form used under the price in FullPackageSection; the
 * full form is the band on /protocol. The signal list travels in both, because
 * the promise is only checkable if the trigger is spelled out.
 */
const GuaranteeBlock = ({
  variant,
  compact = false,
  framed = true,
  className = "",
}: {
  variant: GuaranteeVariant;
  compact?: boolean;
  /**
   * Its own sheet (true, /protocol), or a clause inside a larger document
   * (false, the landing page's proposal).
   */
  framed?: boolean;
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
      <div className={`text-sm leading-relaxed text-foreground ${className}`}>
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
          {variant.excluded.join(" ")}
          {variant.documentation && ` ${variant.documentation}`}
        </p>
      </div>
    );
  }

  // Set as a clause of a proposal (2026-09-30): the guarantee is a signed
  // commitment, so it reads as one, in the document's type, rather than as a
  // badge with a shield icon.
  return (
    <div
      dir="rtl"
      className={`${framed ? "ld-sheet p-6 md:p-8" : ""} ${className}`}
    >
      <p className="text-xs font-bold text-primary">
        התחייבות להחזר
      </p>
      <p className="mt-2 text-lg font-bold leading-snug text-foreground sm:text-xl">
        {headline}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="border-s-2 border-primary/40 ps-4">
          <p className="text-xs font-bold text-primary">
            {variant.signalsLabel}
          </p>
          <ul className="mt-2 space-y-1.5">
            {variant.signals.map((s) => (
              <li key={s} className="text-sm leading-relaxed text-foreground">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">{variant.signalsNote}</p>
        </div>

        <div className="border-s-2 border-border ps-4">
          <p className="text-xs font-bold text-muted-foreground">
            {variant.excludedLabel}
          </p>
          <ul className="mt-2 space-y-1.5">
            {variant.excluded.map((s) => (
              <li key={s} className="text-sm leading-relaxed text-foreground">
                {s}
              </li>
            ))}
          </ul>
          {variant.documentation && (
            <p className="mt-3 text-xs text-muted-foreground">{variant.documentation}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuaranteeBlock;
