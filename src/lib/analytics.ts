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

export function trackFieldFocus(fieldName: string): void {
  trackEvent("form_field_focus", { field_name: fieldName });
}

export function trackFieldBlur(fieldName: string, hasValue: boolean): void {
  trackEvent("form_field_blur", { field_name: fieldName, has_value: hasValue });
}

export function trackFieldError(fieldName: string, errorType: string): void {
  trackEvent("form_field_error", {
    field_name: fieldName,
    error_type: errorType,
  });
}

export function trackSectionView(sectionName: string): void {
  trackEvent("section_view", { section_name: sectionName });
}

export function trackFormAbandon(lastField: string, step: 1 | 2): void {
  trackEvent("form_abandon", { last_field: lastField, step });
}
