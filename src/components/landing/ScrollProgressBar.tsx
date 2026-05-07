import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const handle = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setPct(0);
        return;
      }
      const next = Math.min(
        100,
        Math.max(0, (window.scrollY / docHeight) * 100)
      );
      setPct(next);
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
