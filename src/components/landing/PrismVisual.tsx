import { motion } from "framer-motion";

/**
 * Prism visual.
 *
 * One input beam (the client's blurred question) enters the prism and
 * refracts into three parallel tracks — A (Diagnosis), B (Business),
 * Data — that run the length of the sprint, then converge into the
 * outbound beam (first client contact). Strictly decorative.
 */
const PrismVisual = () => {
  return (
    <div
      className="relative mx-auto w-full max-w-[460px] aspect-square"
      aria-hidden="true"
    >
      {/* Soft backdrop glows */}
      <div className="absolute inset-[18%] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-[32%] rounded-full bg-cor-insight/10 blur-2xl" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="beam-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
            <stop offset="80%" stopColor="hsl(0 0% 100%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="track-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(174 60% 55%)" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(174 60% 55%)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(174 60% 55%)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="track-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(32 88% 62%)" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(32 88% 62%)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(32 88% 62%)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="track-data" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(258 65% 72%)" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(258 65% 72%)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(258 65% 72%)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="beam-out" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--cor-success))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--cor-success))" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="prism-face" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.35)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </radialGradient>
        </defs>

        {/* Framing ring */}
        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="hsl(var(--border))"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Input beam — single white line entering prism from the right (RTL) */}
        <motion.line
          x1="400"
          y1="200"
          x2="270"
          y2="200"
          stroke="url(#beam-in)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0, 0, 0.2, 1] }}
        />

        {/* The prism — isoceles triangle with pointed side facing the input */}
        <motion.polygon
          points="270,200 230,150 230,250"
          fill="url(#prism-face)"
          stroke="hsl(var(--primary))"
          strokeOpacity="0.6"
          strokeWidth="1.25"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "250px 200px" }}
        />

        {/* Three refracted tracks running horizontally across the prism body */}
        <motion.line
          x1="230"
          y1="165"
          x2="60"
          y2="130"
          stroke="url(#track-a)"
          strokeWidth="2.25"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: [0, 0, 0.2, 1] }}
        />
        <motion.line
          x1="230"
          y1="200"
          x2="60"
          y2="200"
          stroke="url(#track-b)"
          strokeWidth="2.25"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.05, ease: [0, 0, 0.2, 1] }}
        />
        <motion.line
          x1="230"
          y1="235"
          x2="60"
          y2="270"
          stroke="url(#track-data)"
          strokeWidth="2.25"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.2, ease: [0, 0, 0.2, 1] }}
        />

        {/* Convergence node — where the three tracks recombine for outreach */}
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.1, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "60px 200px" }}
        >
          <circle
            cx="60"
            cy="200"
            r="18"
            fill="hsl(var(--cor-success) / 0.18)"
          />
          <circle
            cx="60"
            cy="200"
            r="7"
            fill="hsl(var(--cor-success))"
            filter="drop-shadow(0 0 12px hsl(var(--cor-success) / 0.7))"
          />
        </motion.g>

        {/* Subtle pulsing dots on each track (chess-move markers) */}
        <g className="animate-subtle-pulse">
          <circle cx="145" cy="147" r="3" fill="hsl(174 60% 55%)" />
          <circle cx="145" cy="200" r="3" fill="hsl(32 88% 62%)" />
          <circle cx="145" cy="253" r="3" fill="hsl(258 65% 72%)" />
        </g>
      </svg>

      {/* Track labels */}
      <span className="cor-overline absolute left-2 top-[23%] text-primary">
        A · אבחון
      </span>
      <span className="cor-overline absolute left-2 top-[48%] text-cor-opportunity">
        B · עסקי
      </span>
      <span className="cor-overline absolute left-2 top-[72%] text-cor-insight">
        Data · דאטה
      </span>

      {/* Convergence label */}
      <span className="cor-overline absolute bottom-[22%] left-[2%] whitespace-nowrap text-cor-success">
        ← לקוח ראשון
      </span>
    </div>
  );
};

export default PrismVisual;
