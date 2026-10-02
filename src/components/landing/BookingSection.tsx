import { useEffect, useMemo, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { CALENDLY_URL, calendlyPageSettings, visitChannel } from "@/lib/calendly";
import { trackEvent } from "@/lib/analytics";
import type { LeadSource } from "@/lib/web3forms";

type BookingSectionProps = {
  visible?: boolean;
  /** Where the calendar is shown: the page's booking block, or after the form. */
  surface?: "book_section" | "book_section_en" | "post_form";
  /** The CTA that brought the visitor here, carried to Calendly as UTM. */
  source?: LeadSource | null;
  /** The English home page's calendar block says its one line in English. */
  lang?: "he" | "en";
};

const BookingSection = ({
  visible = false,
  surface = "post_form",
  source = null,
  lang = "he",
}: BookingSectionProps) => {
  // Fire when the booking widget first becomes visible. Calendly is third
  // party and can fail, so "the visitor actually saw the calendar" is its own
  // signal.
  useEffect(() => {
    if (visible) {
      trackEvent("booking_widget_visible", { surface });
    }
  }, [visible, surface]);

  const channel = useMemo(visitChannel, []);

  // The site's first direct conversion measure: a slot actually booked. Until
  // 2026-09-29 the funnel stopped at form_submit, which is one step short of
  // the thing that turns into money: a call with a date on it.
  // Calendly takes seconds to paint (4.7s measured on a fast line, 2.10), and
  // until it does the box was empty at the page's conversion point. The layer
  // says what is coming and offers the direct link; it lifts when Calendly
  // reports the event page is up. If that never happens, the link stays.
  const [ready, setReady] = useState(false);
  useCalendlyEventListener({
    onEventTypeViewed: () => setReady(true),
    onEventScheduled: () =>
      trackEvent("booking_scheduled", { surface, source: source ?? "direct", channel }),
  });

  if (!visible) return null;

  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="space-y-3">
      <div dir="ltr" className="relative overflow-hidden rounded-sm border border-border bg-card">
        {!ready && (
          <div
            dir={lang === "en" ? "ltr" : "rtl"}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card px-6 text-center"
          >
            <p className="text-foreground">
              {lang === "en" ? "The calendar is loading." : "היומן נטען, זה לוקח כמה שניות."}
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="ld-link text-sm">
              {lang === "en" ? "Or open it in a new window" : "או לפתוח אותו בחלון חדש"}
            </a>
          </div>
        )}
        <InlineWidget
          url={CALENDLY_URL}
          pageSettings={calendlyPageSettings()}
          // Calendly stores UTM on the booking itself, so the operator can see
          // which CTA produced a meeting without any analytics consent.
          utm={{
            utmSource: "site",
            utmMedium: surface,
            utmCampaign: channel,
            utmContent: source ?? "direct",
          }}
          styles={{ height: "700px", minWidth: "300px" }}
        />
      </div>

      {lang === "en" ? (
        <p className="text-center text-xs text-muted-foreground">
          Calendar not loading? Open it directly in
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="text-link mx-1">
            Calendly
          </a>
          .
        </p>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          הלוח לא נטען? אפשר לפתוח אותו ישירות ב
          <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="text-link mx-1">
            Calendly
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default BookingSection;
