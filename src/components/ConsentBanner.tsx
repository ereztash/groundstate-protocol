import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics } from "@/lib/analytics";
import { initClarity } from "@/lib/clarity";

/**
 * The banner speaks the page's language. Only the home pages are translated,
 * so /en is the one English route; the privacy policy exists in Hebrew only,
 * and the English link says so.
 */
// [region label, text, policy link, decline, accept]. Positional to keep the
// initial bundle at its ceiling.
const COPY = {
  he: [
    "הסכמה לשימוש בכלי ניתוח",
    "אני משתמש בכלי ניתוח (Google Analytics, Microsoft Clarity) כדי לשפר את האתר, הם נטענים רק לאחר אישור.",
    "מדיניות הפרטיות",
    "דחייה",
    "אישור",
  ],
  en: [
    "Consent to analytics tools",
    "I use analytics tools (Google Analytics, Microsoft Clarity) to improve the site. They load only after you accept.",
    "Privacy policy (in Hebrew)",
    "Decline",
    "Accept",
  ],
} as const;

/**
 * Privacy-by-default consent gate. Analytics + session recording (GA4,
 * Microsoft Clarity) do NOT load until the visitor accepts here — on
 * accept we init them immediately so no reload is needed. The choice is
 * remembered in localStorage so the banner shows only once.
 */
const ConsentBanner = () => {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const [region, text, policy, reject, accept] = COPY[en ? "en" : "he"];

  useEffect(() => {
    if (getConsent() !== null) return;

    const hero = document.getElementById("hero");
    // Routes without a hero (about, insights, privacy) have nothing above the
    // fold for the banner to bury — ask straight away.
    if (!hero) {
      setShow(true);
      return;
    }

    // The hero's primary CTA sits ~570px down the page. A bottom-anchored
    // banner is ~150px tall, so on a 667px viewport (iPhone SE/8, and laptops
    // once browser chrome is subtracted) it covers that button outright on the
    // very first visit. Hold the banner back until the hero has scrolled out of
    // view: nothing tracks before consent either way, so deferring the ask
    // costs no privacy and keeps the one conversion element unobstructed.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const decide = (granted: boolean) => {
    setConsent(granted ? "granted" : "denied");
    if (granted) {
      initAnalytics();
      initClarity();
    }
    setShow(false);
    // Let the sticky mobile CTA (which shares bottom-0) know it can appear now.
    window.dispatchEvent(new Event("cor:consent-decided"));
  };

  if (!show) return null;

  return (
    <div
      dir={en ? "ltr" : "rtl"}
      lang={en ? "en" : "he"}
      role="region"
      aria-label={region}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-foreground">
          {text}{" "}
          <Link to="/privacy" hrefLang={en ? "he" : undefined} className="text-link">
            {policy}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="cta-ghost inline-flex h-10 items-center justify-center rounded-md px-4 text-sm"
          >
            {reject}
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="cta-action inline-flex h-10 items-center justify-center rounded-md px-5 text-sm"
          >
            {accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
