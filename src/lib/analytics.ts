export const MEASUREMENT_ID = "G-PLACEHOLDER";

type GtagFn = (
  command: "event" | "config" | "set",
  targetId: string,
  params?: Record<string, unknown>
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
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
