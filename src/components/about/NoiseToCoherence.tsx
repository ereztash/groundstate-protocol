import { useMemo, type CSSProperties } from "react";

/**
 * The About page's scroll-driven motif: a field of shards that interpolate from
 * a scattered, tilted "noise" arrangement into aligned, parallel rows —
 * "coherence" — as an ancestor's `--p` custom property runs 0 → 1.
 *
 * All motion lives in CSS transforms (`.about-shard` in index.css) driven by a
 * single `--p` the scroll handler writes on the sticky container each frame, so
 * there is no per-frame React re-render. With no `--p` set (prerender / no-JS)
 * shards fall back to the noise state; reduced-motion pins the coherent state.
 * Purely decorative — hidden from assistive tech.
 */

// Deterministic PRNG (mulberry32) so the server-prerendered SVG and the client
// render agree exactly — no hydration flash from Math.random().
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLS = 8;
const ROWS = 6;

type Shard = {
  cx: number;
  cy: number;
  nx: number;
  ny: number;
  na: number;
  color: string;
};

const NoiseToCoherence = ({ className }: { className?: string }) => {
  const shards = useMemo<Shard[]>(() => {
    const rng = makeRng(0x9e3779b9);
    const out: Shard[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        out.push({
          cx: 150 + c * 100, // coherent column, evenly spaced
          cy: 180 + r * 128, // coherent row
          nx: (rng() * 2 - 1) * 150, // scattered x offset at --p:0
          ny: (rng() * 2 - 1) * 150,
          na: (rng() * 2 - 1) * 90, // scattered tilt (deg) at --p:0
          color: i % 2 === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))",
        });
      }
    }
    return out;
  }, []);

  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {shards.map((s, i) => (
        <g
          key={i}
          className="about-shard"
          style={
            {
              "--cx": s.cx,
              "--cy": s.cy,
              "--nx": s.nx.toFixed(1),
              "--ny": s.ny.toFixed(1),
              "--na": s.na.toFixed(1),
            } as CSSProperties
          }
        >
          <rect x={-37} y={-2} width={74} height={4} rx={2} fill={s.color} />
        </g>
      ))}
    </svg>
  );
};

export default NoiseToCoherence;
