import { useEffect, useMemo } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { CALENDLY_URL, calendlyPageSettings, visitChannel } from "@/lib/calendly";
import { trackEvent } from "@/lib/analytics";
import type { LeadSource } from "@/lib/web3forms";

type BookingSectionProps = {
  visible?: boolean;
  /** Where the calendar is shown: the page's booking block, or after the form. */
  surface?: "book_section" | "post_form";
  /** The CTA that brought the visitor here, carried to Calendly as UTM. */
  source?: LeadSource | null;
};

const BookingSection = ({
  visible = false,
  surface = "post_form",
  source = null,
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
  useCalendlyEventListener({
    onEventScheduled: () =>
      trackEvent("booking_scheduled", { surface, source: source ?? "direct", channel }),
  });

  if (!visible) return null;

  return (
    <div dir="rtl" className="space-y-3">
      <div dir="ltr" className="overflow-hidden rounded-sm border border-border bg-card">
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

      <p className="text-center text-xs text-muted-foreground">
        הלוח לא נטען? אפשר לפתוח אותו ישירות ב
        <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="text-link mx-1">
          Calendly
        </a>
        .
      </p>
    </div>
  );
};

export default BookingSection;
