import { InlineWidget } from "react-calendly";
import { CALENDLY_URL, CALENDLY_PAGE_SETTINGS } from "@/lib/calendly";
import { Reveal } from "./Reveal";

const BookingSection = () => {
  return (
    <section
      id="booking"
      dir="rtl"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="booking-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-opportunity" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-opportunity">
            שיחת אבחון · 20 דקות · בלי התחייבות
          </p>
          <h2 id="booking-title" className="cor-title mt-3 text-foreground">
            אם זה נכון — 30 הימים הבאים שלך נראים אחרת
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            בחר זמן שנוח. אני מחזיר שיחה ממוקדת — 20 דקות — שבה אני שואל שלוש שאלות שמכריעות אם הספרינט מתאים. אם לא — אני אומר לך את זה ישר.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div
            dir="ltr"
            className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_30px_80px_-30px_hsl(var(--cor-opportunity)/0.3)]"
          >
            <InlineWidget
              url={CALENDLY_URL}
              pageSettings={CALENDLY_PAGE_SETTINGS}
              styles={{ height: "720px", minWidth: "320px" }}
            />
          </div>
        </Reveal>

        <Reveal
          delay={0.2}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          לא נפתח אצלך? פתח ישירות ב-
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className="mx-1 font-mono text-primary underline-offset-4 hover:underline"
          >
            Calendly
          </a>
          .
        </Reveal>
      </div>
    </section>
  );
};

export default BookingSection;
