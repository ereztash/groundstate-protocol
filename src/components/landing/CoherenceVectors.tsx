import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The four stages, drawn as the knowledge-graph brief describes them:
 *
 *   «המתודה מיישרת ארבעה וקטורים — זהות, ערך, מוצר, מכירה — לכיוון אחד.
 *    כשהם מיושרים, האנרגיה הנדרשת לתנועה קטנה.»
 *
 * Those four map one-to-one onto stages.ts — narrative/identity, value
 * proposition, product, client acquisition — so this is the site's own central
 * metaphor applied to the section that lists them, not a new picture invented
 * for decoration. The landing page previously carried no diagram at all: 14
 * SVGs, every one a sub-28px icon, across 10,400px arguing that four stages
 * have a fixed order.
 *
 * Motion: the vectors arrive scattered and resolve into one parallel spine,
 * once, on entry — the same noise → coherence figure as `.about-shard` and the
 * hero's `.cor-settle`, and the same discipline (one shot, then still). The
 * spine itself fades in only as they align, so the alignment is the event.
 *
 * Interaction: `activeStage` is owned by SequenceSection, so hovering or
 * keyboard-focusing a stage card lights that vector in copper. Per the brief's
 * palette rule, copper only ever means the chosen direction — the other three
 * stay teal. The diagram is `aria-hidden`; every stage's meaning is already in
 * the card text beside it, and nothing here is the only carrier of anything.
 */

type Vector = {
  /** Matches Stage["value"] so SequenceSection can light one by id. */
  id: string;
  /** The stage numeral, so the mapping to the cards is legible without
      hovering anything. Same numerals the cards already carry — not a new
      label to learn. */
  numeral: string;
  /** Scattered start: vertical offset and tilt, resolving to 0. */
  dy: number;
  rot: number;
};

// Hand-set rather than random so the figure is identical on every load and in
// the prerendered markup.
const VECTORS: Vector[] = [
  { id: "stage-1", numeral: "01", dy: -14, rot: -13 },
  { id: "stage-2", numeral: "02", dy: 9, rot: 8 },
  { id: "stage-3", numeral: "03", dy: -7, rot: 11 },
  { id: "stage-4", numeral: "04", dy: 13, rot: -6 },
];

const ROW_H = 34;
const TOP = 26;
/**
 * The page is RTL, so "forward" is leftward: each vector starts at the right
 * and its arrowhead points left. Getting this backwards drew four arrows
 * travelling against the direction the reader is reading in.
 */
const X_START = 360;
const X_END = 40;

type Props = {
  /** Stage value currently hovered/focused in the parent, or null. */
  activeStage?: string | null;
  className?: string;
};

const CoherenceVectors = ({ activeStage = null, className }: Props) => {
  const ref = useRef<SVGSVGElement>(null);
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || aligned) return;

    // Prerender and no-IO both get the resolved state, so the static HTML a
    // crawler reads shows the aligned figure rather than the scattered one.
    const prerendering = (window as unknown as { __PRERENDER__?: boolean })
      .__PRERENDER__;
    if (prerendering || typeof IntersectionObserver === "undefined") {
      setAligned(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setAligned(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [aligned]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 154"
      className={`cor-vectors${aligned ? " is-aligned" : ""}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      tabIndex={-1}
    >
      {/* The spine the four resolve onto. Fades in with the alignment. */}
      <line
        className="cor-vectors__spine"
        x1={X_START + 14}
        y1={TOP + ROW_H * 1.5}
        x2={X_END - 14}
        y2={TOP + ROW_H * 1.5}
      />

      {VECTORS.map((v, i) => {
        const y = TOP + i * ROW_H;
        return (
          <g
            key={v.id}
            className={`cor-vectors__v${activeStage === v.id ? " is-active" : ""}`}
            style={
              {
                "--v-dy": `${v.dy}`,
                "--v-rot": `${v.rot}`,
                "--v-delay": `${i * 90}ms`,
                "--v-y": `${y}`,
              } as CSSProperties
            }
          >
            <text
              className="cor-vectors__num"
              x={X_START + 26}
              y={y}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {v.numeral}
            </text>
            <line x1={X_START} y1={y} x2={X_END + 12} y2={y} />
            {/* Arrowhead, pointing left: forward, in an RTL document. */}
            <path d={`M${X_END + 14} ${y - 5} L${X_END} ${y} L${X_END + 14} ${y + 5} Z`} />
          </g>
        );
      })}
    </svg>
  );
};

export default CoherenceVectors;
