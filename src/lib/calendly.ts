/**
 * Shared Calendly configuration.
 * One source of truth for the scheduling URL and the dark-theme page settings
 * that match the Protocol Ocean Blue color tokens in src/index.css.
 */

export const CALENDLY_URL =
  "https://calendly.com/erez2812345/new-meeting";

/**
 * Calendly page settings — hex values that mirror our CSS tokens so the
 * embedded widget blends with the dark-teal editorial theme.
 *
 * Mapping:
 *   backgroundColor → hsl(222 47% 8%)  (≈ --card)
 *   textColor       → hsl(215 20% 88%) (≈ light foreground)
 *   primaryColor    → hsl(32 88% 58%)  (≈ --cor-opportunity warm CTA)
 */
export const CALENDLY_PAGE_SETTINGS = {
  backgroundColor: "0b1016",
  textColor: "d8dce2",
  primaryColor: "f39a3d",
  hideEventTypeDetails: false,
  hideLandingPageDetails: false,
  hideGdprBanner: true,
} as const;
