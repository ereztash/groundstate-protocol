import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/calendly";
import { trackCtaClick, trackEvent } from "@/lib/analytics";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import SpotsLeft from "./SpotsLeft";
import SectionHead from "./SectionHead";

const BookingSection = lazy(() => import("./BookingSection"));
const DiagnosticFormSection = lazy(() => import("./DiagnosticFormSection"));

/**
 * The page's one destination. Every CTA on the landing page lands here.
 *
 * Until 2026-09-29 the path to a call was a two-step form, and the calendar
 * opened only after it. A form that ends in "I'll get back to you" depends on
 * the operator noticing an email, and a call with no date on it is the leak
 * the first-call records point at. So the calendar comes first: a visitor who
 * is ready picks a slot and leaves with a date. The form stays, one tap away,
 * for the reader who would rather be called.
 *
 * The Calendly embed is a third-party iframe of several hundred kB, so it is
 * mounted only as the section approaches the viewport. Until then, and for
 * anyone without JS, the placeholder carries a plain link to the same calendar.
 *
 * Under the two tabs, WhatsApp with the number written out (2026-10-01): the
 * channel Israeli readers reach for first, and a visible number is itself a
 * sign that someone answers it.
 */
const STATIONS = [
  "מתחילים במה שתקוע, ובמה שכבר ניסיתם.",
  "מחפשים משהו מסוים שעשיתם פעם ואתם גאים בו.",
  "אני אומר בקול מה שאני שומע, ומתקנים ביחד.",
  "בודקים אם זה מתאים, ומאיפה מתחילים.",
];

type Mode = "calendar" | "form";

function CalendarPlaceholder() {
  return (
    <div className="flex h-[700px] flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-border px-6 text-center">
      <p className="text-muted-foreground">היומן נטען.</p>
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noreferrer"
        className="ld-link"
      >
        לפתוח את היומן בחלון חדש
      </a>
    </div>
  );
}

const BookSection = () => {
  const { source } = useDiagnosticForm();
  const [mode, setMode] = useState<Mode>("calendar");
  const [near, setNear] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const choose = (next: Mode) => {
    setMode(next);
    trackEvent("book_mode", { mode: next });
  };

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => choose(value)}
      className={`flex-1 rounded-sm px-4 py-3 text-sm font-bold transition-colors ${
        mode === value
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section
      id="book"
      dir="rtl"
      aria-labelledby="book-title"
      className="ld-section ld-desk scroll-mt-14"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionHead label="הצעד הבא" />
          <h2 id="book-title" className="cor-title mt-4 text-foreground">
            שיחת התאמה. 30 דקות, ללא עלות.
          </h2>
        </div>

        {/* On a phone the calendar comes straight after the heading: a
            visitor who tapped a CTA should land on the thing she tapped for,
            not on four paragraphs about it. */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="font-heading text-lg font-black text-foreground">
              מה קורה בשלושים הדקות
            </p>
            <ol className="mt-5 space-y-5 border-s border-foreground/15 ps-5">
              {STATIONS.map((s, i) => (
                <li key={s}>
                  <p className="text-xs font-bold text-muted-foreground">
                    תחנה {i + 1}
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground">{s}</p>
                </li>
              ))}
            </ol>

            {/* The ICP node's screening question, handed over as preparation. A
              sharp, owned answer means the reader does not need the programme;
              a long or generic one is what the call is for. It also sets the
              call's genre before it starts: a fit check, not free advice. */}
          <div className="mt-8 ld-plain p-5">
            <p className="text-xs font-bold text-primary">
              שאלה אחת להביא לשיחה
            </p>
            <p className="mt-2 text-lg font-bold leading-snug text-foreground">
              אם מישהו אחר נותן בדיוק את אותו שירות, למה שיבחרו בכם?
            </p>
          </div>

          <SpotsLeft className="mt-8 text-sm text-muted-foreground" />
          </div>

          <div ref={anchor} className="order-1 lg:order-2">
            <div
              role="group"
              aria-label="איך לקבוע"
              className="mb-4 flex gap-1 rounded-sm border border-border bg-card p-1"
            >
              {tab("calendar", "לבחור מועד ביומן")}
              {tab("form", "שארז יחזור אליי")}
            </div>
            <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-foreground" />
              מעדיפים לכתוב?
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("whatsapp_book")}
                className="ld-link"
              >
                וואטסאפ <span dir="ltr">{WHATSAPP_DISPLAY}</span>
                <span className="sr-only"> (נפתח בוואטסאפ)</span>
              </a>
            </p>

            {mode === "calendar" ? (
              near ? (
                <Suspense fallback={<CalendarPlaceholder />}>
                  <BookingSection
                    visible
                    surface="book_section"
                    source={source}
                  />
                </Suspense>
              ) : (
                <CalendarPlaceholder />
              )
            ) : (
              <Suspense
                fallback={<div className="h-[640px]" aria-hidden="true" />}
              >
                <DiagnosticFormSection embedded />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookSection;
