import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, setConsent } from "@/lib/consent";
import { initAnalytics } from "@/lib/analytics";
import { initClarity } from "@/lib/clarity";

/**
 * Privacy-by-default consent gate. Analytics + session recording (GA4,
 * Microsoft Clarity) do NOT load until the visitor accepts here — on
 * accept we init them immediately so no reload is needed. The choice is
 * remembered in localStorage so the banner shows only once.
 */
const ConsentBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(getConsent() === null);
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
      dir="rtl"
      role="region"
      aria-label="הסכמה לשימוש בכלי ניתוח"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-foreground/80">
          אני משתמש בכלי ניתוח (Google Analytics, Microsoft Clarity) כדי לשפר את
          האתר — הם נטענים רק באישורך.{" "}
          <Link to="/privacy" className="text-link">
            מדיניות הפרטיות
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="cta-ghost inline-flex h-10 items-center justify-center rounded-md px-4 text-sm"
          >
            דחה
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="cta-action inline-flex h-10 items-center justify-center rounded-md px-5 text-sm"
          >
            אשר
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
