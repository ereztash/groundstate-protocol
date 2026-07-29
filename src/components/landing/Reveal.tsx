import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * Scroll-triggered reveal primitives.
 *
 * `<Reveal>` is a single block that fades + slides 12px upward on viewport
 * entry (once). `<RevealStagger>` is a parent container that staggers its
 * `<RevealItem>` children by 50ms. All motion collapses to an instant fade
 * under `prefers-reduced-motion` (globally enforced in index.css).
 *
 * Implemented with one `IntersectionObserver` per block plus a CSS class,
 * rather than framer-motion's `whileInView`. The public API is unchanged — the
 * props and stagger behaviour match what the twelve calling sections already
 * pass — but the landing bundle no longer carries an animation runtime in
 * order to fade twelve elements in. The observer disconnects on first entry,
 * matching the previous `once: true`.
 */

/** Matches framer-motion's old `viewport={{ margin: "-40px" }}`. */
const ENTRY_MARGIN = "0px 0px -40px 0px";

function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // During prerender an observer would resolve honestly — and capture every
    // below-the-fold section at opacity 0 into the static HTML, which is what
    // the framer-motion version used to ship (14 inline `opacity:0` in the
    // deployed markup). Snap to the resolved state instead so the file a
    // crawler reads carries the content visible. Entry is via createRoot, not
    // hydrateRoot, so the client re-renders from scratch and still animates.
    // Same flag About.tsx and CoherenceVisual.tsx already check.
    const prerendering = (window as unknown as { __PRERENDER__?: boolean })
      .__PRERENDER__;

    // No IntersectionObserver: show immediately rather than leaving the
    // section permanently invisible.
    if (prerendering || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: ENTRY_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return { ref, shown };
}

const delayStyle = (seconds: number): CSSProperties | undefined =>
  seconds
    ? ({ "--reveal-delay": `${seconds}s` } as CSSProperties)
    : undefined;

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

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
  const Tag = as as "div";
  const { ref, shown } = useRevealOnce<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cx("cor-reveal", shown && "is-shown", className)}
      style={delayStyle(delay)}
    >
      {children}
    </Tag>
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
  const Tag = as as "div";
  const { ref, shown } = useRevealOnce<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cx("cor-reveal-group", shown && "is-shown", className)}
    >
      {children}
    </Tag>
  );
};

/**
 * The stagger is expressed in CSS off `nth-child`, not by threading an index
 * prop, so every existing call site keeps passing its children unchanged.
 */
export const RevealItem = ({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) => {
  const Tag = as as "div";
  return <Tag className={cx("cor-reveal-item", className)}>{children}</Tag>;
};
