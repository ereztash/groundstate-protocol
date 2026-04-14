import { motion } from "framer-motion";

/**
 * Signature hero visual.
 *
 * Three orbits — Psychology / Engineering / Business — rotate at different
 * speeds around a shared nucleus ("Integration"). Where the orbits cross,
 * faint gradient arcs imply intersection. Strictly decorative: aria-hidden.
 *
 * Built with SVG + CSS animations (via index.css) so it stays lightweight
 * and respects `prefers-reduced-motion` (the global reset zeroes duration).
 */
const ConstellationVisual = () => {
  return (
    <div
      className="relative mx-auto w-full max-w-[460px] aspect-square"
      aria-hidden="true"
    >
      {/* Soft backdrop glow */}
      <div className="absolute inset-[12%] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-[28%] rounded-full bg-cor-insight/10 blur-2xl" />

      <svg
        viewBox="0 0 400 400"
        className="relative h-full w-full"
        fill="none"
      >
        <defs>
          <radialGradient id="nucleus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(174 60% 55%)" stopOpacity="1" />
            <stop offset="60%" stopColor="hsl(174 60% 40%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(174 60% 40%)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbit-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(174 60% 45%)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="hsl(174 60% 55%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(174 60% 45%)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="orbit-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(258 65% 68%)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="hsl(258 65% 72%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(258 65% 68%)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="orbit-c" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(32 88% 58%)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="hsl(32 88% 62%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(32 88% 58%)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Outer containment rings (static, editorial) */}
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="hsl(var(--border))"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          stroke="hsl(var(--border))"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <circle
          cx="200"
          cy="200"
          r="60"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.25"
          strokeWidth="1"
        />

        {/* Orbit A — Psychology (teal/primary) */}
        <g className="animate-orbit-a">
          <circle
            cx="200"
            cy="200"
            r="170"
            stroke="url(#orbit-a)"
            strokeWidth="1.5"
            strokeDasharray="120 800"
          />
          <circle
            cx="200"
            cy="30"
            r="6"
            fill="hsl(174 60% 55%)"
            filter="drop-shadow(0 0 8px hsl(174 60% 55%))"
          />
        </g>

        {/* Orbit B — Engineering (indigo/insight) */}
        <g className="animate-orbit-b">
          <circle
            cx="200"
            cy="200"
            r="140"
            stroke="url(#orbit-b)"
            strokeWidth="1.5"
            strokeDasharray="100 700"
          />
          <circle
            cx="200"
            cy="60"
            r="5"
            fill="hsl(258 65% 72%)"
            filter="drop-shadow(0 0 8px hsl(258 65% 72%))"
          />
        </g>

        {/* Orbit C — Business (warm opportunity) */}
        <g className="animate-orbit-c">
          <circle
            cx="200"
            cy="200"
            r="100"
            stroke="url(#orbit-c)"
            strokeWidth="1.5"
            strokeDasharray="80 500"
          />
          <circle
            cx="200"
            cy="100"
            r="5"
            fill="hsl(32 88% 62%)"
            filter="drop-shadow(0 0 8px hsl(32 88% 62%))"
          />
        </g>

        {/* Central nucleus — integration */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0, 0, 0.2, 1], delay: 0.2 }}
        >
          <circle cx="200" cy="200" r="46" fill="url(#nucleus)" />
          <g className="animate-nucleus-pulse">
            <circle
              cx="200"
              cy="200"
              r="14"
              fill="hsl(174 60% 55%)"
              filter="drop-shadow(0 0 14px hsl(174 60% 55%))"
            />
            <circle
              cx="200"
              cy="200"
              r="5"
              fill="hsl(0 0% 100%)"
              opacity="0.9"
            />
          </g>
        </motion.g>
      </svg>

      {/* Discipline labels — positioned around the outer ring */}
      <span className="cor-overline absolute -top-1 left-1/2 -translate-x-1/2 text-primary">
        פסיכולוגיה
      </span>
      <span className="cor-overline absolute bottom-6 right-2 text-cor-insight">
        הנדסה
      </span>
      <span className="cor-overline absolute bottom-6 left-2 text-cor-opportunity">
        עסקים
      </span>
    </div>
  );
};

export default ConstellationVisual;
