import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { fullPackage, stages } from "@/data/sprint-stages";
import { SAMPLE_SOURCE_LABEL } from "@/lib/evidence";
import { trackCtaClick } from "@/lib/analytics";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import SpotsLeft from "./SpotsLeft";

/**
 * What she leaves with, and what it costs. One offer.
 *
 * The page used to sell five things: four stages priced one by one, and a
 * package framed as a discount on their sum, with a quiz to pick between
 * them. Every choice the page hands over is a reason to postpone the call,
 * and the cheapest door on the menu is the one a hesitant reader walks
 * through. Here the four stages are what they actually are, four weeks of one
 * programme, each ending in a document, and there is one price.
 *
 * The stages are still sold separately; that line sits under the price and
 * links to /protocol, where each one is priced. It is a door, not a menu.
 *
 * Every word about a stage is read from sprint-stages. Nothing is re-typed.
 */
const OfferSection = () => {
  const { requestForm } = useDiagnosticForm();

  const onCta = (e: MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick("offer_book");
    e.preventDefault();
    requestForm("full_package");
  };

  return (
    <section
      id="offer"
      dir="rtl"
      aria-labelledby="offer-title"
      className="ld-section"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="cor-overline-he">מה נשאר אצלך</p>
          <h2 id="offer-title" className="cor-title mt-4 text-foreground">
            ארבעה שבועות. ארבעה מסמכים. כל אחד נבנה על הקודם.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground/80">
            לא עצות ולא השראה. בסוף כל שבוע יש מסמך שאפשר להשתמש בו מחר
            בבוקר, והסדר קבוע: אי אפשר לתמחר מוצר לפני שיודעים מה הבידול.
          </p>
        </div>

        {/* Phones: a row of sheets to leaf through, each one most of the
            screen wide so the next one's edge shows. Stacked, the four cost
            more than two screens before the price. Wider screens get a grid.
            `relative` is load-bearing: the sr-only week labels are absolutely
            positioned, and without a positioned ancestor inside the scroller
            they escape its clipping and widen the whole document (measured:
            975px on a 390px phone, which zoomed the page out). */}
        <p className="mt-10 text-sm text-muted-foreground md:hidden" aria-hidden="true">
          ארבעה מסמכים, החליקי ביניהם ←
        </p>
        <ol className="relative -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {stages.map((s, i) => (
            <li
              key={s.number}
              className="ld-sheet flex w-[84%] shrink-0 snap-center flex-col p-6 sm:w-[70%] sm:p-7 md:w-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="ld-folio" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="pt-1 text-xs font-bold tracking-[0.08em] text-muted-foreground">
                  שבוע {i + 1} · {s.verb}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-2xl font-black leading-tight text-foreground">
                <span className="sr-only">שבוע {i + 1}: </span>
                {s.name}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground/80">
                {s.deliverable}
              </p>
              <p className="mt-3 font-semibold leading-relaxed text-primary">
                {s.benefit}
              </p>

              <figure className="mt-auto pt-6">
                <blockquote className="border-s-2 border-accent/70 ps-4 font-heading text-[15px] leading-snug text-foreground/85">
                  {s.artifact.sample}
                </blockquote>
                <figcaption className="mt-2 ps-4 text-[11px] text-muted-foreground">
                  {s.artifact.docLabel} · {SAMPLE_SOURCE_LABEL[s.artifact.sampleSource]}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        {/* The price, alone on its sheet. */}
        <div
          id="price"
          className="ld-sheet mt-6 grid gap-8 p-7 sm:p-10 md:mt-10 md:grid-cols-[1fr_auto] md:items-end md:gap-14"
        >
          <div>
            <p className="cor-overline-he">התוכנית המלאה</p>
            <p className="mt-4 text-foreground">
              <span className="ld-price">{fullPackage.priceLabel}</span>
            </p>
            <ul className="mt-6 grid gap-2 text-foreground/85 sm:grid-cols-2 sm:gap-x-8">
              <li>30 יום, 4 פגישות של 60 דקות</li>
              <li>ליווי בין הפגישות</li>
              <li>4 מסמכים שנשארים אצלך</li>
              <li>הרצה מונחית של הפנייה הראשונה</li>
            </ul>
            <SpotsLeft className="mt-5 text-sm text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-4 md:w-72">
            <a href="#book" onClick={onCta} className="ld-cta w-full">
              לתיאום שיחת התאמה
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              בשיחה בודקים אם יש התאמה ומאיפה מתחילים. אם אין, אומרים את זה.
            </p>
            <p className="text-sm text-muted-foreground">
              כל שלב נמכר גם בנפרד.{" "}
              <Link to="/protocol#prices" className="ld-link font-semibold">
                המחירים לפי שלב
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
