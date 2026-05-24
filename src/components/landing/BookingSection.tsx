import { useEffect } from "react";
import { InlineWidget } from "react-calendly";
import { CALENDLY_URL, CALENDLY_PAGE_SETTINGS } from "@/lib/calendly";
import { trackEvent } from "@/lib/analytics";

type BookingSectionProps = {
  visible?: boolean;
};

const BookingSection = ({ visible = false }: BookingSectionProps) => {
  // Fire when the booking widget first becomes visible to the user —
  // typically right after a successful form submit. Gives analytics the
  // "form_submit happened, AND the visitor actually saw the calendar"
  // signal, which matters because Calendly is third-party and can fail.
  useEffect(() => {
    if (visible) {
      trackEvent("booking_widget_visible", { surface: "post_form" });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div dir="rtl" className="space-y-4">
      <div
        dir="ltr"
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        <InlineWidget
          url={CALENDLY_URL}
          pageSettings={CALENDLY_PAGE_SETTINGS}
          styles={{ height: "720px", minWidth: "320px" }}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        הלוח לא נטען? פתחו ישירות ב
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-link mx-1"
        >
          Calendly
        </a>
        .
      </p>
    </div>
  );
};

export default BookingSection;
