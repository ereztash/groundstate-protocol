import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The COR-SYS experiential motif: "קוהרנטיות" (vector alignment).
 *
 * Five vectors start scattered (many forces, different directions — the client's
 * pain) and resolve into a single parallel spine (coherence — "the SYS in
 * COR-SYS"). One vector is copper: the aligned direction / action. This is a
 * demonstration of the product, not decoration.
 *
 * Tier-1: SVG + framer-motion only (no WebGL). Fully responsive (viewBox scales),
 * decorative (`aria-hidden` — meaning also lives in the page heading), and under
 * `prefers-reduced-motion` it renders the final aligned state with no animation.
 */

const TAIL_X = 360; // shared origin column (right side — RTL start)
const HEAD_X = 130; // the aligned spine (left)

type Vec = { y: number; sx: number; sy: number; lead?: boolean };

const VECTORS: Vec[] = [
  { y: 45, sx: 205, sy: 118 },
  { y: 95, sx: 288, sy: 24 },
  { y: 145, sx: 168, sy: 36, lead: true },
  { y: 195, sx: 300, sy: 260 },
  { y: 245, sx: 214, sy: 150 },
];

const EASE_OUT = [0, 0, 0.2, 1] as const;

const CoherenceField = ({ className }: { className?: string }) => {
  const reduced = useReducedMotion();

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 420 290"
        className="h-full w-full"
        role="presentation"
        focusable="false"
      >
        {/* The spine the vectors align to — copper (the single direction). */}
        <motion.line
          x1={HEAD_X}
          y1={24}
          x2={HEAD_X}
          y2={266}
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ opacity: reduced ? 0.4 : 0 }}
          animate={{ opacity: 0.4 }}
          transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 1.05 }}
        />

        {VECTORS.map((v, i) => {
          const color = v.lead ? "hsl(var(--accent))" : "hsl(var(--primary))";
          const aligned = { x2: HEAD_X, y2: v.y };
          const scattered = { x2: v.sx, y2: v.sy };
          const dotAligned = { cx: HEAD_X, cy: v.y };
          const dotScattered = { cx: v.sx, cy: v.sy };
          const transition = reduced
            ? { duration: 0 }
            : { duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE_OUT };

          return (
            <g key={v.y} style={{ opacity: v.lead ? 0.95 : 0.55 }}>
              <motion.line
                x1={TAIL_X}
                y1={v.y}
                stroke={color}
                strokeWidth={v.lead ? 2.5 : 1.75}
                strokeLinecap="round"
                initial={reduced ? aligned : scattered}
                animate={aligned}
                transition={transition}
              />
              <motion.circle
                r={v.lead ? 4 : 3}
                fill={color}
                initial={reduced ? dotAligned : dotScattered}
                animate={dotAligned}
                transition={transition}
              />
              {/* Shared-origin node */}
              <circle cx={TAIL_X} cy={v.y} r={2} fill="hsl(var(--primary))" opacity={0.35} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CoherenceField;
