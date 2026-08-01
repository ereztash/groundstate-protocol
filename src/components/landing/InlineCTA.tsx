import { trackCtaClick } from "@/lib/analytics";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import type { LeadSource } from "@/lib/web3forms";

/**
 * A conversion point placed in the reading path.
 *
 * Was MidPageCTA, fixed and single-use. Renamed and parameterised when the page
 * grew a second one: measured at 1280px the landing runs 14.6 screens, and the
 * CTAs sat at 4%, 32%, 35%, 63% and 68% of scroll depth, then nothing until the
 * form at 97%. That 29-point gap covered Day31, NotForEveryone,
 * ObjectionsSection and the FAQ, which is the stretch where a reader is
 * actually being convinced. Being convinced and then having to scroll a third
 * of a page to act is where intent goes.
 *
 * Each instance reports its own `ctaName` and `source`, so the placements stay
 * distinguishable in analytics. One shared label would average together two
 * very different reader states and hide which position earns its space.
 *
 * The label is fixed rather than escalating with dwell time: this sits in the
 * reader's line of sight, and copy that rewrites itself under the cursor reads
 * as a trick. The dwell escalation is still worth having in StickyMobileCTA,
 * which is out of the reading path.
 */

type Props = {
  /** The line beside the button. */
  prompt: string;
  /** Analytics label. Unique per placement. */
  ctaName: string;
  /** Lead source recorded on the submitted form. */
  source: LeadSource;
  ctaLabel?: string;
};

const InlineCTA = ({
  prompt,
  ctaName,
  source,
  ctaLabel = "לתיאום שיחת התאמה",
}: Props) => {
  const { requestForm } = useDiagnosticForm();

  const handleClick = () => {
    trackCtaClick(ctaName);
    requestForm(source);
  };

  return (
    <section dir="rtl" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="cor-body-lg text-foreground">{prompt}</p>
          <button
            type="button"
            onClick={handleClick}
            className="cta-line inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default InlineCTA;
