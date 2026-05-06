import { InlineWidget } from "react-calendly";
import { CALENDLY_URL, CALENDLY_PAGE_SETTINGS } from "@/lib/calendly";

type BookingSectionProps = {
  visible?: boolean;
};

const BookingSection = ({ visible = false }: BookingSectionProps) => {
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
