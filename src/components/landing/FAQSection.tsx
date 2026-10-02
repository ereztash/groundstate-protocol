import { trackCtaClick } from "@/lib/analytics";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import { activeGuarantee } from "@/data/guarantee";
import { faq as items, surfacedObjections, type QA } from "@/data/faq";
import SectionHead from "./SectionHead";

/**
 * The guarantee answer only appears when a variant is live. Until then the
 * question is dropped rather than answered with a promise nobody approved.
 */
function guaranteeItem(): QA | null {
  const g = activeGuarantee();
  if (!g) return null;
  return {
    q: "מה אם זה לא עבד?",
    // The full clause is printed once, under the price; repeating it here was
    // the third copy on the page (1.10 audit).
    a: "אני מחזיר את התשלום במלואו. התנאים המדויקים כתובים בהצעה, מתחת למחיר.",
  };
}

/**
 * The two objections that decide the sale are printed open, above the rest,
 * because a closed accordion only answers the readers who cared enough to
 * look. They used to be a section of their own (ObjectionsSection); folding
 * them in here keeps one place for questions and saves a screen.
 */
const surfaced = surfacedObjections();
const rest: readonly QA[] = (() => {
  const others = items.filter((item) => !surfaced.includes(item));
  const g = guaranteeItem();
  return g ? [...others, g] : others;
})();

const FAQSection = () => (
  <section
    id="faq"
    dir="rtl"
    aria-labelledby="faq-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <SectionHead label="שאלות" />
      <h2 id="faq-title" className="cor-title mt-4 max-w-2xl text-foreground">
        מה שואלים לפני שקובעים.
      </h2>

      {/* One column, every answer open (2.10). The two-column accordion read as
          a stock block in the 1.10 audit, and a closed answer only reaches the
          readers who already cared enough to open it. */}
      <div className="mt-12 max-w-3xl">
        {[...surfaced, ...rest].map(({ q, a }) => (
          <div key={q} className="border-t border-foreground/15 py-6">
            <h3 className="font-heading text-xl font-black leading-snug text-foreground">
              {q}
            </h3>
            <p className="mt-2 leading-relaxed text-foreground">{a}</p>
          </div>
        ))}
        <p className="border-t border-foreground/15 pt-6 text-foreground">
          שאלה שלא מופיעה כאן?{" "}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("whatsapp_faq")}
            className="ld-link"
          >
            כתבו לי בוואטסאפ, <span dir="ltr" className="whitespace-nowrap">{WHATSAPP_DISPLAY}</span>
            <span className="sr-only"> (נפתח בוואטסאפ)</span>
          </a>
        </p>
      </div>
    </div>
  </section>
);

export default FAQSection;
