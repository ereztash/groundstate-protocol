import type { MouseEvent } from "react";
import { program, stages } from "@/data/sprint-stages";
import GuaranteeBand from "@/components/GuaranteeBand";
import { SAMPLE_SOURCE_LABEL } from "@/lib/evidence";
import { trackCtaClick } from "@/lib/analytics";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import SpotsLeft from "./SpotsLeft";
import SectionHead from "./SectionHead";
import { CorSeal } from "@/components/brand/CorMark";

/**
 * What the reader leaves with, and what it costs. One offer.
 *
 * The page used to sell five things: four stages priced one by one, and a
 * package framed as a discount on their sum, with a quiz to pick between
 * them. Every choice the page hands over is a reason to postpone the call,
 * and the cheapest door on the menu is the one a hesitant reader walks
 * through. Here the four stages are what they actually are, four weeks of one
 * programme, each ending in a document, and there is one price.
 *
 * Operator decision 2026-09-29: one price for the programme, in two payments,
 * and the stages are not sold separately. The signed guarantee sits on the
 * price sheet, under the number it backs.
 *
 * Every word about a stage is read from sprint-stages. Nothing is re-typed.
 *
 * Headings are the buyer's words (`buyerTitle`), with the method's own stage
 * names demoted to a label: graph heuristic H21 says the marketing gate speaks
 * the way the buyer describes the problem, and the verbs (חילוץ, הבלטה…) are
 * the expert's map. The intro carries the method's ownership principle in the
 * wording /protocol already uses, because the documents are hers, not handed
 * over (graph heuristic H18, U1).
 */
/** The proposal's line items: what the page already says the programme holds. */
const LINE_ITEMS = [
  "4 פגישות של 60 דקות, במשך 30 יום",
  "ליווי בין הפגישות",
  "4 מסמכים שנשארים אצלכם",
  "הרצה מונחית של הפנייה הראשונה",
];

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
      className="ld-section ld-desk"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionHead n="02" label="מה נשאר אצלכם" />
          <h2 id="offer-title" className="cor-title mt-4 text-foreground">
            ארבעה שבועות. ארבעה מסמכים. כל אחד נבנה על הקודם.
          </h2>
          <p className="cor-body-lg mt-5 text-foreground">
            בסוף כל שבוע יש מסמך שאפשר להשתמש בו מחר בבוקר. מבנה שנבנה תחת
            עומס נשאר, ומבנה שמוגש מבחוץ מתפוגג. לכן אני מחלץ מכם את הניסוח,
            ולא נותן לכם אותו.
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
          ארבעה מסמכים, החליקו ביניהם ←
        </p>
        <ol className="relative -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {stages.map((s, i) => (
            <li
              key={s.number}
              className="ld-sheet ld-stack flex w-[84%] shrink-0 snap-center flex-col p-6 sm:w-[70%] sm:p-7 md:w-auto"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="ld-folio" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="pt-1 text-xs font-bold tracking-[0.08em] text-muted-foreground">
                  שבוע {i + 1} · {s.name}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-2xl font-black leading-tight text-foreground">
                <span className="sr-only">שבוע {i + 1}: </span>
                {s.buyerTitle}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground">
                {s.deliverable}
              </p>
              <p className="mt-3 font-semibold leading-relaxed text-primary">
                {s.benefit}
              </p>

              <figure className="mt-auto pt-6">
                <blockquote className="border-s-2 border-accent/70 ps-4 text-base leading-snug text-foreground">
                  {s.artifact.sample}
                </blockquote>
                <figcaption className="mt-2 ps-4 text-xs text-muted-foreground">
                  {s.artifact.docLabel} · {SAMPLE_SOURCE_LABEL[s.artifact.sampleSource]}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        {/* The price as the document it is: a one-page proposal lying on the
            desk, with line items, a total, the signed guarantee as a clause,
            and a signature line. Every line item is copy the page already
            carries; nothing new is promised here. */}
        <div id="price" className="ld-sheet ld-stack mt-8 p-6 sm:p-10 md:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground/15 pb-4">
            <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
              הצעה: {program.name}
            </h3>
            <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">
              COR-SYS · ארז טל-שיר
            </p>
          </div>

          <div className="mt-6 grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-14">
            <div>
              <ul className="space-y-3 text-foreground">
                {LINE_ITEMS.map((item) => (
                  <li key={item} className="ld-line">
                    <span>{item}</span>
                    <span className="ld-line__leader" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">כלול</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-end justify-between gap-4 border-t-2 border-foreground pt-4">
                <span className="font-bold text-foreground">סה״כ</span>
                <span className="text-end">
                  <span className="ld-price">{program.priceLabel}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {program.installmentsLabel}
                  </span>
                </span>
              </div>
              <SpotsLeft className="mt-5 text-sm text-muted-foreground" />
            </div>

            <div className="flex flex-col gap-4 md:pt-1">
              <a href="#book" onClick={onCta} className="ld-cta w-full">
                לתיאום שיחת התאמה
              </a>
              <p className="text-sm leading-relaxed text-muted-foreground">
                בשיחה בודקים אם יש התאמה ומאיפה מתחילים. אם אין, אומרים את זה.
              </p>
            </div>
          </div>

          {/* The signed guarantee, as a clause of the proposal, under the
              number it backs. */}
          <GuaranteeBand framed={false} className="mt-10 border-t border-foreground/15 pt-8" />

          {/* Signed and sealed: the brand's seal pressed beside the signature,
              overlapping the line the way a stamp lands on paper. */}
          <div className="mt-10 flex items-end justify-end">
            <CorSeal id="cor-seal-offer" className="cor-seal relative z-10 -me-6 h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
            <div className="ld-sign w-56 text-center">
              <span className="font-heading text-lg font-bold text-foreground">ארז טל-שיר</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
