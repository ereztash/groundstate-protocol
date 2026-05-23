import { trackCtaClick } from "@/lib/analytics";
import { useDwellState } from "@/lib/useDwellState";
import { getCtaCopy } from "@/lib/dwellCopy";

const MidPageCTA = () => {
  const phase = useDwellState();
  const ctaCopy = getCtaCopy(phase);

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
            מוכן לדבר?
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="cta-line inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold"
          >
            {ctaCopy}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MidPageCTA;
