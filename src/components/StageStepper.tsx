import { useRef, useState, type KeyboardEvent } from "react";
import { stages } from "@/data/sprint-stages";

/**
 * Interactive stepper for the four stages. Instead of stacking four long cards
 * (a wall of scroll), the visitor clicks between stages and reads one at a time
 * — much less reading fatigue, and it makes the "fixed order" tangible.
 *
 * Accessible tabs pattern: roving tabindex + arrow/Home/End keys. Every panel
 * stays in the DOM (inactive ones `hidden`), so the prerendered HTML carries all
 * four stages' text for crawlers — the shorter page costs nothing in SEO.
 */
const StageStepper = ({
  exitCriteria,
  inputs,
  transformations,
}: {
  exitCriteria: Record<string, string>;
  inputs: Record<string, string>;
  transformations: Record<string, string>;
}) => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (i: number) => {
    const next = (i + stages.length) % stages.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // RTL tablist: ArrowLeft moves to the next (visually-left) tab.
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        focusTab(active + 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        focusTab(active - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(stages.length - 1);
        break;
    }
  };

  return (
    <div dir="rtl">
      <div
        role="tablist"
        aria-label="שלבי הרצף"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2 sm:gap-3"
      >
        {stages.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.number}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`stage-tab-${s.number}`}
              aria-selected={selected}
              aria-controls={`stage-panel-${s.number}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex flex-1 items-center gap-3 rounded-lg border px-4 py-3 text-right transition-colors sm:flex-initial ${
                selected
                  ? "border-accent/50 bg-accent/[0.06]"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span
                className={`text-2xl font-light tabular-nums ${
                  selected ? "text-accent" : "text-primary/70"
                }`}
              >
                {s.number}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {s.verb}
              </span>
            </button>
          );
        })}
      </div>

      {stages.map((s, i) => (
        <div
          key={s.number}
          role="tabpanel"
          id={`stage-panel-${s.number}`}
          aria-labelledby={`stage-tab-${s.number}`}
          hidden={i !== active}
          className="mt-8 rounded-xl border border-border bg-card p-6 md:p-8"
        >
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <h3 className="cor-heading text-foreground">{s.name}</h3>
            <span className="text-base font-semibold text-foreground">
              {s.priceLabel}
            </span>
          </div>

          <p className="mt-5 cor-body-lg text-foreground/85">{s.description}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="border-r-2 border-border pr-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                קלט
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                {inputs[s.number]}
              </p>
            </div>
            <div className="border-r-2 border-border pr-3">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                תוצר ביד
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                {s.deliverable}
              </p>
            </div>
            <div className="border-r-2 border-accent/40 pr-3">
              <p className="text-[11px] font-semibold tracking-wide text-accent">
                הסימן שסיימנו
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                {exitCriteria[s.number]}
              </p>
            </div>
          </div>

          {/* Compact input → mechanism → output chain, so the transformation
              is scannable without reading all three fields above. */}
          <p className="mt-6 border-t border-border pt-4 text-center font-mono text-xs leading-relaxed text-primary/75 sm:text-sm">
            {transformations[s.number]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StageStepper;
