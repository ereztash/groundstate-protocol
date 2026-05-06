import { motion } from "framer-motion";

const PrismVisual = () => {
  return (
    <div
      className="relative mx-auto w-full max-w-[420px] aspect-square"
      aria-hidden="true"
    >
      <div className="absolute inset-[22%] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute inset-[34%] rounded-full bg-primary/10 blur-2xl" />

      <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
        <defs>
          <linearGradient id="beam-in" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
            <stop offset="80%" stopColor="hsl(var(--foreground))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="track-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="track-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(var(--accent))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="track-data" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="prism-face" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.35)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </radialGradient>
        </defs>

        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="hsl(var(--border))"
          strokeOpacity="0.6"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        <motion.line
          x1="400"
          y1="200"
          x2="270"
          y2="200"
          stroke="url(#beam-in)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0, 0, 0.2, 1] }}
        />

        <motion.polygon
          points="270,200 230,150 230,250"
          fill="url(#prism-face)"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.6"
          strokeWidth="1.25"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "250px 200px" }}
        />

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
          transition={{ duration: 1.2, delay: 0.9, ease: [0, 0, 0.2, 1] }}
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
          transition={{ duration: 1.2, delay: 1.05, ease: [0, 0, 0.2, 1] }}
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
          transition={{ duration: 1.2, delay: 1.2, ease: [0, 0, 0.2, 1] }}
        />

        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.9, ease: [0, 0, 0.2, 1] }}
          style={{ transformOrigin: "60px 200px" }}
        >
          <circle cx="60" cy="200" r="16" fill="hsl(var(--accent) / 0.18)" />
          <circle cx="60" cy="200" r="6" fill="hsl(var(--accent))" />
        </motion.g>
      </svg>
    </div>
  );
};

export default PrismVisual;
