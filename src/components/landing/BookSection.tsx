import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/calendly";
import { trackEvent } from "@/lib/analytics";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import SpotsLeft from "./SpotsLeft";

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
 */
const STATIONS = [
  { title: "פתיחה.", body: "מה התקיעה ומה ניסית עד עכשיו." },
  {
    title: "חילוץ נקודה אחת.",
    body: "משהו ספציפי שעשיתם פעם ואתם גאים בו. שם יושב הבידול.",
  },
  { title: "שיקוף.", body: "אני אומר בקול מה שאני שומע, ומתקנים ביחד." },
  {
    title: "החלטה.",
    body: "אם זה מתאים, ומאיפה מתחילים. אם לא, גם זו תשובה ברורה.",
  },
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
          : "text-foreground/70 hover:text-foreground"
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
      className="ld-section scroll-mt-14 border-t border-foreground/10"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="cor-overline-he">הצעד הבא</p>
          <h2 id="book-title" className="cor-title mt-4 text-foreground">
            שיחת התאמה. 20 דקות, ללא עלות.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/80">
            אם זה לא הזמן הנכון, או אני לא האדם הנכון, נגיד את זה ביושר בלי
            לבזבז לאף אחד את הזמן.
          </p>
        </div>

        {/* On a phone the calendar comes straight after the heading: a
            visitor who tapped a CTA should land on the thing she tapped for,
            not on four paragraphs about it. */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="font-heading text-lg font-black text-foreground">
              מה קורה בעשרים הדקות
            </p>
            <ol className="mt-5 space-y-5 border-s border-foreground/15 ps-5">
              {STATIONS.map((s, i) => (
                <li key={s.title}>
                  <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">
                    תחנה {i + 1}
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/85">
                    <strong className="font-bold text-foreground">
                      {s.title}
                    </strong>{" "}
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>

            {/* The ICP node's screening question, handed over as preparation. A
              sharp, owned answer means the reader does not need the programme;
              a long or generic one is what the call is for. It also sets the
              call's genre before it starts: a fit check, not free advice. */}
          <div className="mt-8 ld-sheet p-5">
            <p className="text-xs font-bold tracking-[0.08em] text-primary">
              שאלה אחת להביא לשיחה
            </p>
            <p className="mt-2 font-heading text-lg font-bold leading-snug text-foreground">
              אם מישהו אחר נותן בדיוק את אותו שירות, למה שיבחרו בכם?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              אם התשובה לוקחת יותר ממשפט, בשביל זה השיחה.
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
