import { useEffect, useRef } from "react";

/**
 * Thin progress line at the top of the viewport that fills as the visitor
 * scrolls. Reinforces Goal Gradient — visible advancement increases task
 * persistence.
 *
 * Two paths, and most visitors get neither a scroll listener nor a React
 * render: where the browser supports scroll-driven animations the bar is
 * driven entirely by the compositor from CSS (see `.cor-scroll-progress` in
 * index.css) and this effect returns immediately. Everywhere else it falls
 * back to a rAF-coalesced write straight to the node's transform — still no
 * state, so still no render.
 *
 * The previous version set React state on every scroll event and animated
 * `width`, which meant a render and a forced layout per event (measured: 141
 * of each over a single 6000px scroll).
 */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline", "scroll()")
    ) {
      return;
    }

    const bar = barRef.current;
    if (!bar) return;

    let raf = 0;
    const write = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress =
        max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = `scaleX(${progress})`;
    };
    // Coalesce bursts of scroll events into one write per frame.
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <div ref={barRef} className="cor-scroll-progress h-full w-full bg-primary" />
    </div>
  );
};

export default ScrollProgress;
