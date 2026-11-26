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

/** Counts the page now on screen: the first page, and every in-app navigation. */
export function countPage(): void {
  if (typeof window === "undefined" || !CODE) return;
  if ((window as { __PRERENDER__?: boolean }).__PRERENDER__) return;
  void load().then(() => window.goatcounter?.count?.());
}
