import { useEffect, useState } from "react";

/**
 * Thin progress line at the top of the viewport that fills with the
 * primary (teal) color as the user scrolls down the page. Reinforces
 * Goal Gradient — visible advancement increases task persistence.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const docHeight = doc.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(
        100,
        Math.max(0, (window.scrollY / docHeight) * 100)
      );
      setProgress(pct);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-primary"
        style={{
          width: `${progress}%`,
          transition: "width 100ms cubic-bezier(0, 0, 0.2, 1)",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
