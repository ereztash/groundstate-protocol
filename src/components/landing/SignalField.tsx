import type { CSSProperties } from "react";
import { makeRng } from "@/lib/rng";

/**
 * The hero's picture: a field of strokes that start scattered and settle,
 * once, all pointing at a single copper point. It draws the headline beside
 * it (versions of "who am I" pulling in different directions) and the
 * business's one sentence: what a person already has, aimed at one purpose,
 * becomes a defined product with a price. It is the cor-brand mark at the
 * size of a picture.
 *
 * Composition follows the brand's DNA: one copper focus, off centre, low and
 * toward the end of the reading line (left, in RTL), with the field thinning
 * out as it moves away from the point so the side nearest the text stays
 * quiet.
 *
 * Geometry is computed once at module load from a seeded PRNG, so the
 * prerendered SVG and the hydrated one are identical. The motion is CSS only
 * (`.cor-field` in index.css): each stroke carries its start angle, its angle
 * toward the point and a delay that grows with distance, so order spreads
 * outward from the point and is finished in under two seconds. Decorative as a
 * whole: the headline states the point in words.
 */

const W = 560;
const H = 520;
const POINT = { x: 168, y: 330 };
const COLS = 10;
const ROWS = 9;
/** No stroke this close to the point: the focus needs air around it. */
const CLEAR = 52;

type Stroke = { x: number; y: number; len: number; a0: number; a1: number; d: number; o: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

const STROKES: Stroke[] = (() => {
  const rng = makeRng(0xc0a5e5);
  const gx = W / COLS;
  const gy = H / ROWS;
  const far = Math.hypot(W - POINT.x, POINT.y);
  const out: Stroke[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = gx * (c + 0.5) + (rng() - 0.5) * gx * 0.55;
      const y = gy * (r + 0.5) + (rng() - 0.5) * gy * 0.55;
      const spin = rng() * 2 - 1;
      const jitter = rng();
      const dist = Math.hypot(POINT.x - x, POINT.y - y);
      if (dist < CLEAR) continue;
      const toward = (Math.atan2(POINT.y - y, POINT.x - x) * 180) / Math.PI;
      // Near the point the strokes are longer and brighter; far from it they
      // shorten and fade into the charcoal, which keeps the brand's 40% of
      // empty ground and leaves the side nearest the text quiet.
      const near = Math.max(0, 1 - dist / far);
      if (near < 0.08) continue;
      out.push({
        x: r1(x),
        y: r1(y),
        len: r1(12 + near * 16),
        a0: r1(toward + spin * 115),
        a1: r1(toward),
        d: Math.round(dist * 1.25 + jitter * 140),
        o: r1(Math.min(1, 0.08 + near * near * 1.25)),
      });
    }
  }
  return out;
})();

const SignalField = ({ className }: { className?: string }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    className={`cor-field ${className ?? ""}`}
    aria-hidden="true"
    focusable="false"
  >
    <g stroke="hsl(var(--primary))" strokeWidth={2} strokeLinecap="round">
      {STROKES.map((s) => (
        <line
          key={`${s.x}-${s.y}`}
          x1={r1(s.x - s.len / 2)}
          y1={s.y}
          x2={r1(s.x + s.len / 2)}
          y2={s.y}
          strokeOpacity={s.o}
          style={{ "--a0": `${s.a0}deg`, "--a1": `${s.a1}deg`, "--d": `${s.d}ms` } as CSSProperties}
        />
      ))}
    </g>
    <circle
      className="cor-field__ring"
      cx={POINT.x}
      cy={POINT.y}
      r={28}
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity={0.5}
      strokeWidth={1.25}
    />
    <circle cx={POINT.x} cy={POINT.y} r={9} fill="hsl(var(--signal))" />
  </svg>
);

export default SignalField;
