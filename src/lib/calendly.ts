export const CALENDLY_URL =
  "https://calendly.com/erez2812345/new-meeting";

export const CALENDLY_PAGE_SETTINGS = {
  backgroundColor: "FFFCF6",
  textColor: "1B1813",
  primaryColor: "B23A12",
  hideEventTypeDetails: false,
  hideLandingPageDetails: false,
  hideGdprBanner: false,
} as const;

const CHANNEL_KEY = "cor-channel";

/**
 * Where this visit came from, for the booking's UTM campaign: the `?c=` tag on
 * a link Erez sent (e.g. ?c=li-dm, ?c=after-call), else the referring site's
 * host, else "direct". Calendly stores it on the booking itself, so a meeting
 * can be traced to its channel with no analytics consent involved.
 *
 * Read once per visit and kept in sessionStorage, because the tag is only in
 * the URL of the first page and a reader often reaches the calendar after
 * visiting /protocol or an article. Storage can be unavailable (private mode,
 * blocked site data); the value is then simply recomputed.
 */
export function visitChannel(): string {
  if (typeof window === "undefined") return "direct";
  try {
    const kept = window.sessionStorage.getItem(CHANNEL_KEY);
    if (kept) return kept;
  } catch {
    /* storage unavailable */
  }
  const tag = new URLSearchParams(window.location.search).get("c") ?? "";
  let channel = /^[a-z0-9_-]{1,24}$/i.test(tag) ? tag.toLowerCase() : "";
  if (!channel && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname) channel = host;
    } catch {
      /* malformed referrer */
    }
  }
  channel ||= "direct";
  try {
    window.sessionStorage.setItem(CHANNEL_KEY, channel);
  } catch {
    /* storage unavailable */
  }
  return channel;
}
