/**
 * The one count that runs for every visitor, without asking: GoatCounter
 * (goatcounter.com). It sets no cookie and keeps nothing that identifies a
 * person, so it needs no consent banner. Its terms allow a small business on
 * the free plan: "Running your personal website or small-to-medium business on
 * it is fine".
 *
 * Why it exists (26.11.2026): GA4 and Clarity load only after "אישור", and most
 * visitors never answer the banner, so every number the site had counted only
 * the people who pressed it. This one counts every page view and where it came
 * from (referring site, campaign), which is what a reading of the site needs.
 *
 * Setting VITE_GOATCOUNTER_CODE to an empty string turns it off, and the
 * prerender build is never counted.
 */

// The site code is public by design (it is in every page's script tag), so it
// has a fallback here, as clarity.ts does. The env var can still override it.
const CODE =
  (import.meta.env.VITE_GOATCOUNTER_CODE as string | undefined) ?? "corsys";

type GoatCounter = {
  no_onload?: boolean;
  count?: (vars?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

let loading: Promise<void> | null = null;

function load(): Promise<void> {
  if (loading) return loading;
  loading = new Promise((resolve) => {
    // A single-page app counts each page itself (countPage), so the script
    // must not count on its own when it loads, or the first page counts twice.
    window.goatcounter = { no_onload: true };
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://gc.zgo.at/count.js";
    script.dataset.goatcounter = `https://${CODE}.goatcounter.com/count`;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return loading;
}

/** The page the canonical link names, or null when there is none. */
function canonicalPath(): string | null {
  const href = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  if (!href) return null;
  try {
    return new URL(href).pathname;
  } catch {
    return null;
  }
}

const settled = (path: string) => {
  const c = canonicalPath();
  return c === null || c.replace(/\/$/, "") === path.replace(/\/$/, "");
};

let previous: string | null = null;

/**
 * Counts the page now on screen: the first page, and every in-app navigation.
 *
 * The path is sent explicitly. Left to itself the script reads the canonical
 * link, and on 26.11 the live check showed that on a lazily loaded page (about,
 * privacy, insights) the link still names the previous page when this runs, so
 * /about was counted as the home page. It waits up to two seconds for the new
 * page to set its link, so the title matches too, and then counts regardless.
 * After the first page the referrer is the previous page on this site, not the
 * outside site the visit began from, which would otherwise be credited with
 * every page of the visit.
 */
export function countPage(): void {
  if (typeof window === "undefined" || !CODE) return;
  if ((window as { __PRERENDER__?: boolean }).__PRERENDER__) return;
  const path = window.location.pathname;
  const referrer = previous;
  previous = window.location.href;
  const started = Date.now();
  const send = () => {
    if (window.location.pathname !== path) return; // already left this page
    if (!settled(path) && Date.now() - started < 2000) {
      window.setTimeout(send, 100);
      return;
    }
    window.goatcounter?.count?.(referrer === null ? { path } : { path, referrer });
  };
  void load().then(send);
}
