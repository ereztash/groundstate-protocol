import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { stages } from "@/data/sprint-stages";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Scroll-linked trace of the four methodology stages, in the protocol/state
 * register: a field spine that draws itself right-to-left while four nodes
 * ignite in order.
 *
 * The stages are read from src/lib/stages.ts — the same canonical four the
 * stepper and the landing page use. Nothing here defines a stage, a label or a
 * claim of its own: the per-stage caption is the transformation string the
 * Methodology page already owns, passed in as a prop.
 *
 * Motion:
 *  - Progress comes from framer-motion's `useScroll` over this section, so it
 *    is normalised to the section's own height rather than raw scroll position.
 *  - The handler writes CSS custom properties and never sets state per frame,
 *    so scrolling costs no React renders and no layout — the same technique
 *    the About page's `--p` motif uses. Only the active-panel index is state,
 *    and it changes at most three times across the whole section.
 *  - The figure is `position: sticky`. The visitor's scroll rate is never
 *    touched: nothing is pinned by intercepting wheel events, and no CTA or
 *    body copy is hidden behind the animation.
 *
 * Reduced motion: the subscription is skipped and every node is written lit,
 * so the reader still sees all four stages and the completed spine — the
 * figure loses its motion, not its content.
 */

/** Node positions, right-to-left: "forward" is leftward in an RTL document. */
const X_FIRST = 356;
const X_LAST = 44;
/**
 * The drawn content spans roughly AXIS_Y−54 (verb cap-height) to AXIS_Y+56
 * (numeral descender), so the viewBox is sized to that band rather than to a
 * round number — otherwise the figure renders small inside a tall empty box,
 * which is most obvious on a phone.
 */
const AXIS_Y = 78;
const VIEWBOX_H = 156;

const NODES = stages.map((s, i) => ({
  stage: s,
  x: X_FIRST + ((X_LAST - X_FIRST) * i) / (stages.length - 1),
  /**
   * Where in the section's scroll this node ignites. Spread across 0.08–0.86 so
   * the first node is already lit shortly after entry (an empty figure on
   * arrival reads as broken) and the last resolves before the section leaves.
   */
  threshold: 0.08 + (0.78 * i) / (stages.length - 1),
}));

/** How much scroll a node takes to go from dark to fully lit. */
const RAMP = 0.1;

type Props = {
  /** Existing per-stage transformation copy, keyed by stage number. */
  transformations: Record<string, string>;
  className?: string;
};

const StageFieldTrace = ({ transformations, className }: Props) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  /**
   * 0 when the section's top crosses the viewport middle, 1 when its bottom
   * does. The usable scroll range is then the section's full height rather
   * than (height − viewport): with ["start start", "end end"] a 180vh section
   * only leaves ~80vh of travel, which resolved all four nodes in barely a
   * flick of the wheel.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  /** Writes the spine draw and per-node ignition as CSS variables. */
  const paint = (p: number) => {
    const el = figureRef.current;
    if (!el) return;
    el.style.setProperty("--trace-p", String(p));
    NODES.forEach((n, i) => {
      const lit = Math.min(1, Math.max(0, (p - n.threshold) / RAMP));
      el.style.setProperty(`--n${i}`, String(lit));
    });
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduced) return;
    paint(p);
    // State changes only on a crossing, not per frame.
    let next = 0;
    for (let i = 0; i < NODES.length; i += 1) {
      if (p >= NODES[i].threshold) next = i;
    }
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const prerendering = (window as unknown as { __PRERENDER__?: boolean })
      .__PRERENDER__;
    // Reduced motion and prerender both get the resolved figure: fully drawn
    // spine, every node lit, last panel active.
    if (reduced || prerendering) {
      paint(1);
      setActive(NODES.length - 1);
      return;
    }
    // Paint the entry state once on mount so the figure is never blank before
    // the first scroll event arrives (e.g. a deep link landing mid-section).
    paint(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div ref={sectionRef} className={className}>
      <div className="grid gap-x-10 md:grid-cols-[1fr_1.05fr]">
        {/* Sticky figure. Decorative: every stage's meaning is in the panels
            beside it and in the stepper below. */}
        <div className="md:order-2">
          <div className="sticky top-24 md:top-28">
            <div
              ref={figureRef}
              className="cor-trace"
              aria-hidden="true"
              // Entry state, also what the prerendered markup carries when the
              // effect above has not run yet.
              style={{ "--trace-p": 0 } as React.CSSProperties}
            >
              <svg viewBox={`0 0 400 ${VIEWBOX_H}`} className="w-full">
                {/* Latent spine: the structure exists before you reach it. */}
                <line
                  className="cor-trace__rail"
                  x1={X_FIRST}
                  y1={AXIS_Y}
                  x2={X_LAST}
                  y2={AXIS_Y}
                />
                {/* Drawn spine, revealed right-to-left by --trace-p. */}
                <line
                  className="cor-trace__spine"
                  x1={X_FIRST}
                  y1={AXIS_Y}
                  x2={X_LAST}
                  y2={AXIS_Y}
                  pathLength={1}
                />

                {NODES.map((n, i) => (
                  <g
                    key={n.stage.number}
                    className="cor-trace__node"
                    style={{ "--n": `var(--n${i})` } as React.CSSProperties}
                  >
                    {/* Field ticks — the node's influence, once energised. */}
                    <line
                      className="cor-trace__tick"
                      x1={n.x}
                      y1={AXIS_Y - 30}
                      x2={n.x}
                      y2={AXIS_Y - 17}
                    />
                    <line
                      className="cor-trace__tick"
                      x1={n.x}
                      y1={AXIS_Y + 17}
                      x2={n.x}
                      y2={AXIS_Y + 30}
                    />
                    <circle
                      className="cor-trace__halo"
                      cx={n.x}
                      cy={AXIS_Y}
                      r={14}
                    />
                    <circle
                      className="cor-trace__ring"
                      cx={n.x}
                      cy={AXIS_Y}
                      r={9.5}
                    />
                    <circle
                      className="cor-trace__core"
                      cx={n.x}
                      cy={AXIS_Y}
                      r={4}
                    />
                    <text
                      className="cor-trace__num"
                      x={n.x}
                      y={AXIS_Y + 52}
                      textAnchor="middle"
                    >
                      {n.stage.number}
                    </text>
                    <text
                      className="cor-trace__verb"
                      x={n.x}
                      y={AXIS_Y - 44}
                      textAnchor="middle"
                    >
                      {n.stage.verb}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Scrolling panels. Real content, not spacing: the verb, the stage
            name and the transformation the Methodology page already states. */}
        <ol className="md:order-1">
          {NODES.map((n, i) => (
            <li
              key={n.stage.number}
              data-dim={i === active ? undefined : ""}
              className="cor-trace-step flex min-h-[46vh] flex-col justify-center py-6"
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] text-primary">
                {n.stage.number} · {n.stage.verb}
              </p>
              <h3 className="cor-heading mt-2 text-foreground">
                {n.stage.name}
              </h3>
              <p className="mt-3 font-mono text-xs leading-relaxed text-foreground/75 sm:text-sm">
                {transformations[n.stage.number]}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default StageFieldTrace;
