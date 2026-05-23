import { useEffect, useRef } from "react";

type MagneticOptions = {
  /** Pixel radius around the element where the cursor starts to pull it. */
  radius?: number;
  /** 0–1; how strongly the element follows the cursor inside the radius. */
  strength?: number;
};

/**
 * Returns a ref that, when attached to any HTML element, makes that
 * element subtly translate toward the cursor as the cursor approaches.
 * Outside the radius, the element snaps back to its origin.
 *
 * Apply to a wrapper *around* a styled button rather than the button
 * itself — that way the button's existing :hover transforms
 * (translateY, etc.) don't collide with the magnetic transform.
 *
 * Respects prefers-reduced-motion (no-op when the user has it on).
 * Uses requestAnimationFrame so cursor movement doesn't thrash style
 * recalcs on slower devices.
 */
export function useMagnetic<T extends HTMLElement>(
  options: MagneticOptions = {}
) {
  const { radius = 80, strength = 0.3 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > radius) {
          el.style.transform = "";
          return;
        }

        const force = (1 - dist / radius) * strength;
        el.style.transform = `translate(${dx * force}px, ${dy * force}px)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", reset);
      el.style.transform = "";
    };
  }, [radius, strength]);

  return ref;
}
