import { useEffect, useRef } from "react";
import { trackEvent } from "./analytics";

type MagneticOptions = {
  /** Pixel radius around the element where the cursor starts to pull it. */
  radius?: number;
  /** 0–1; how strongly the element follows the cursor inside the radius. */
  strength?: number;
  /**
   * Optional identifier (e.g. "hero_diagnostic", "full_package"). When set,
   * the first time the cursor enters this CTA's radius in a session a
   * `cta_proximity` event fires so analytics can measure "considered but
   * didn't click" intent.
   */
  name?: string;
};

// Module-level set so the dedup survives component remounts (e.g. dwell phase
// re-renders) — one proximity event per CTA per page-load is enough signal.
const proximityFiredFor = new Set<string>();

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
  const { radius = 80, strength = 0.3, name } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    let insideRadius = false;

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
          if (insideRadius) insideRadius = false;
          el.style.transform = "";
          return;
        }

        // Cursor just entered the magnetic zone for this CTA.
        if (!insideRadius) {
          insideRadius = true;
          if (name && !proximityFiredFor.has(name)) {
            proximityFiredFor.add(name);
            trackEvent("cta_proximity", { cta_name: name });
          }
        }

        const force = (1 - dist / radius) * strength;
        el.style.transform = `translate(${dx * force}px, ${dy * force}px)`;
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      insideRadius = false;
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
  }, [radius, strength, name]);

  return ref;
}
