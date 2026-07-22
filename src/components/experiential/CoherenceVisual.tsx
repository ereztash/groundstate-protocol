import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import CoherenceField from "./CoherenceField";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Composes the coherence motif's two tiers:
 *  - Tier-1 CoherenceField (SVG) is ALWAYS in the DOM — it is the static HTML
 *    for prerender/crawlers, the reduced-motion state, and the WebGL fallback.
 *  - Tier-2 CoherenceGL (WebGL) lazy-loads on top only for capable clients,
 *    after idle (so it never competes with LCP).
 *
 * The WebGL layer is skipped entirely under prefers-reduced-motion, when WebGL
 * is unavailable, or during prerender (window.__PRERENDER__), and any runtime
 * failure in it falls back to the SVG via GLBoundary.
 */

const CoherenceGL = lazy(() => import("./CoherenceGL"));

/** Silently render nothing on any WebGL/runtime error → the SVG stays visible. */
class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const CoherenceVisual = ({ className }: { className?: string }) => {
  const reduced = useReducedMotion();
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return;
    if (!webglAvailable()) return;

    let idleId: number;
    let timeoutId: number;
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback;
    if (ric) idleId = ric(() => setEnable(true));
    else timeoutId = window.setTimeout(() => setEnable(true), 400);

    return () => {
      const cic = (window as unknown as {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;
      if (cic && idleId) cic(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reduced]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: enable ? 0 : 1 }}
      >
        <CoherenceField className="h-full w-full" />
      </div>
      {enable && (
        <GLBoundary>
          <Suspense fallback={null}>
            <CoherenceGL className="absolute inset-0" />
          </Suspense>
        </GLBoundary>
      )}
    </div>
  );
};

export default CoherenceVisual;
