import { useEffect, useState } from "react";
import { APPS_SCRIPT_URL } from "./web3forms";

// Mirror of MONTHLY_CAP in apps-script/Code.gs. Live count is clamped to this.
const MONTHLY_CAP = 10;

/**
 * How long a spots count stays trustworthy. Past this, the site shows the
 * static policy line instead of a number: a stale scarcity claim costs more
 * trust than no scarcity claim buys, and nobody is watching the cell.
 */
export const SPOTS_STALE_AFTER_DAYS = 7;

// Module-level cache so multiple <SpotsLeft /> instances share one request.
let cache: Promise<number | null> | null = null;

/**
 * True when a spots-count timestamp is too old to show a number for.
 *
 * `undefined` means the deployed Apps Script predates the freshness stamp — it
 * simply doesn't send the field. That is treated as "not stale" so upgrading
 * the site without redeploying the script doesn't silently kill a counter that
 * was working. `null` means the script does support the stamp but the cell has
 * never been written, which IS stale.
 */
export function isSpotsCountStale(
  updatedAt: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (updatedAt === undefined) return false;
  if (updatedAt === null) return true;
  const t = Date.parse(updatedAt);
  if (Number.isNaN(t)) return true;
  const ageDays = (now - t) / 86_400_000;
  return ageDays > SPOTS_STALE_AFTER_DAYS;
}

/**
 * Reads the remaining monthly spots from the Apps Script `?action=spots`
 * endpoint (which in turn reads cell Config!B1 of the Sheet). Returns null on
 * any failure — and on a stale count — so callers fall back to the static
 * availability copy. The counter is a nicety, never a blocker.
 */
export async function fetchSpotsLeft(): Promise<number | null> {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=spots`, {
      method: "GET",
    });
    const json = (await res.json().catch(() => null)) as
      | { spotsLeft?: unknown; spotsUpdatedAt?: string | null }
      | null;
    if (!json || typeof json.spotsLeft !== "number") return null;
    // Absent field = legacy script; null = supported but never stamped.
    const updatedAt = "spotsUpdatedAt" in json ? json.spotsUpdatedAt : undefined;
    if (isSpotsCountStale(updatedAt)) return null;
    return Math.max(0, Math.min(MONTHLY_CAP, Math.round(json.spotsLeft)));
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
