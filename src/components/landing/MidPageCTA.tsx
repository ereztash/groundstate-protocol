import { trackCtaClick } from "@/lib/analytics";

/**
 * Mid-page conversion point. The label is fixed rather than escalating with
 * dwell time: this sits in the reader's line of sight, and copy that rewrites
 * itself under the cursor reads as a trick. The dwell escalation is still
 * worth having in StickyMobileCTA, which is out of the reading path.
 */
const MidPageCTA = () => {
  const handleClick = () => {
    trackCtaClick("mid_page");
    document
      .getElementById("diagnostic-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section dir="rtl" className="relative py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="cor-body-lg text-foreground">
            הצעד הבא הוא שיחה.
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="cta-line inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold"
          >
            לתיאום שיחת אבחון
          </button>
        </div>
      </div>
    </section>
  );
};

export default MidPageCTA;
