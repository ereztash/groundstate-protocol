import { motion } from "framer-motion";

const PrismVisual = () => {
  return (
    <div
      className="relative mx-auto w-full max-w-[320px] aspect-square opacity-90"
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="beam-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="track-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.1" />
            <stop offset="60%" stopColor="hsl(var(--foreground))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="track-accent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(var(--accent))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="hsl(var(--border))"
          strokeOpacity="0.85"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        <motion.line
          x1="400"
          y1="200"
          x2="270"
          y2="200"
          stroke="url(#beam-in)"
          strokeWidth="1.75"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0, 0, 0.2, 1] }}
        />

        <motion.polygon
          points="270,200 230,150 230,250"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "250px 200px" }}
        />

        <motion.line
          x1="230" y1="165" x2="60" y2="130"
          stroke="url(#track-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0, 0, 0.2, 1] }}
        />
        <motion.line
          x1="230" y1="200" x2="60" y2="200"
          stroke="url(#track-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 1.05, ease: [0, 0, 0.2, 1] }}
        />
        <motion.line
          x1="230" y1="235" x2="60" y2="270"
          stroke="url(#track-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0, 0, 0.2, 1] }}
        />

        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.9, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "60px 200px" }}
        >
          <circle cx="60" cy="200" r="14" fill="hsl(var(--accent) / 0.12)" />
          <circle cx="60" cy="200" r="5" fill="hsl(var(--accent))" />
        </motion.g>
      </svg>
    </div>
  );
};

export default PrismVisual;
