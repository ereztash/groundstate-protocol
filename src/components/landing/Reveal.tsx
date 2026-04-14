import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered reveal primitives.
 *
 * `<Reveal>` is a single block that fades + slides 16px upward on viewport
 * entry (once). `<RevealStagger>` is a parent container that staggers its
 * `<RevealItem>` children by 60ms. All motion collapses to an instant fade
 * under `prefers-reduced-motion` (globally enforced in index.css).
 */

const EASE_OUT = [0, 0, 0.2, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const parentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

export const Reveal = ({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) => {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: EASE_OUT, delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
};

export const RevealStagger = ({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
}) => {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={parentVariants}
    >
      {children}
    </MotionTag>
  );
};

export const RevealItem = ({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) => {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
};
