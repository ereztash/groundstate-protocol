type GtagFn = (
  command: "event" | "config" | "set" | "js",
  targetIdOrDate: string | Date,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

const MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ||
  "G-8E8CR8Q65V";

function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Loads gtag.js and configures GA4 if VITE_GA_MEASUREMENT_ID is set.
 * Safe no-op when the env var is absent (e.g. local dev without GA).
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!MEASUREMENT_ID || MEASUREMENT_ID === "G-PLACEHOLDER") {
    console.info(
      "[analytics] VITE_GA_MEASUREMENT_ID not set — events will be no-op."
    );
    return;
  }
  if (hasGtag()) return; // already initialized (HMR, double mount)

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    MEASUREMENT_ID
  )}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag.js reads queued commands from dataLayer as `arguments` objects. The
  // previous shim pushed a rest-array (`(...args) => push(args)`), which gtag
  // silently ignores — so GA registered ZERO hits. Match the canonical snippet.
  const gtag: GtagFn = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as GtagFn;
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  if (!hasGtag()) return;
  window.gtag!("event", name, params);
}

export function trackFormStart(): void {
  trackEvent("form_start", { form_name: "diagnostic" });
}

export function trackFormSubmit(): void {
  trackEvent("form_submit", { form_name: "diagnostic" });
}

export function trackCtaClick(ctaName: string): void {
  trackEvent("cta_click", { cta_name: ctaName });
}

export function trackScrollDepth(percent: number): void {
  trackEvent("scroll_depth", { percent });
}

export function trackError(kind: string, message: string, stack?: string): void {
  trackEvent("app_error", {
    kind,
    message: message?.slice(0, 300),
    stack: stack?.slice(0, 500),
  });
}
