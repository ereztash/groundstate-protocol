import { useEffect, useState } from "react";
import { APPS_SCRIPT_URL } from "./web3forms";

// Mirror of MONTHLY_CAP in apps-script/Code.gs. Live count is clamped to this.
const MONTHLY_CAP = 10;

// Module-level cache so multiple <SpotsLeft /> instances share one request.
let cache: Promise<number | null> | null = null;

/**
 * Reads the remaining monthly spots from the Apps Script `?action=spots`
 * endpoint (which in turn reads cell Config!B1 of the Sheet). Returns null on
 * any failure so callers can fall back to the static availability copy —
 * the counter is a nicety, never a blocker.
 */
export async function fetchSpotsLeft(): Promise<number | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=spots`, {
      method: "GET",
    });
    const json = (await res.json().catch(() => null)) as
      | { spotsLeft?: unknown }
      | null;
    if (json && typeof json.spotsLeft === "number") {
      return Math.max(0, Math.min(MONTHLY_CAP, Math.round(json.spotsLeft)));
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the live spots-left count, or null while loading / on failure.
 * Fetches once per page load and shares the result across all consumers.
 */
export function useSpotsLeft(): number | null {
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => {
    if (!cache) cache = fetchSpotsLeft();
    let active = true;
    cache.then((n) => {
      if (active) setSpots(n);
    });
    return () => {
      active = false;
    };
  }, []);

  return spots;
}
