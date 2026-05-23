import { useEffect, useState } from "react";

export type DwellPhase = "fresh" | "engaged" | "committed" | "returning";

const VISIT_MARKER_KEY = "cor-sys-visit-marker-v1";
const ENGAGED_AFTER_MS = 15_000;
const COMMITTED_AFTER_MS = 60_000;

/**
 * Tracks how engaged the current visitor is, by combining time-on-page
 * with a localStorage marker for repeat visits. Returns one of:
 *
 *   "fresh"     — first visit, < 15 seconds in
 *   "engaged"   — first visit, 15–60 seconds in
 *   "committed" — first visit, 60+ seconds in
 *   "returning" — visitor has been here before (sticky; doesn't escalate)
 *
 * CTAs and microcopy use this to "grow up" with the visitor's
 * commitment — fresh visitors see the canonical pitch, returning
 * visitors see warmer recognition copy.
 */
export function useDwellState(): DwellPhase {
  const [phase, setPhase] = useState<DwellPhase>("fresh");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isReturning = false;
    try {
      isReturning = window.localStorage.getItem(VISIT_MARKER_KEY) === "1";
    } catch {
      // localStorage unavailable (private mode etc.); treat as fresh visit.
    }

    if (isReturning) {
      setPhase("returning");
      return;
    }

    try {
      window.localStorage.setItem(VISIT_MARKER_KEY, "1");
    } catch {
      // ignore quota / blocked storage
    }

    const engagedTimer = window.setTimeout(() => {
      setPhase((cur) => (cur === "fresh" ? "engaged" : cur));
    }, ENGAGED_AFTER_MS);

    const committedTimer = window.setTimeout(() => {
      setPhase((cur) =>
        cur === "fresh" || cur === "engaged" ? "committed" : cur
      );
    }, COMMITTED_AFTER_MS);

    return () => {
      window.clearTimeout(engagedTimer);
      window.clearTimeout(committedTimer);
    };
  }, []);

  return phase;
}
