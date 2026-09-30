import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { activeGuarantee } from "@/data/guarantee";
import { faq as items, surfacedObjections, type QA } from "@/data/faq";

/**
 * The guarantee answer only appears when a variant is live. Until then the
 * question is dropped rather than answered with a promise nobody approved.
 */
function guaranteeItem(): QA | null {
  const g = activeGuarantee();
  if (!g) return null;
  return {
    q: "יש אחריות?",
    a: [
      g.headline,
      `${g.signalsLabel}: ${g.signals.join("; ")}.`,
      g.signalsNote,
      `${g.excludedLabel}: ${g.excluded.join(" ")}`,
      g.documentation,
    ]
      .filter(Boolean)
      .join(" "),
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
      <p className="cor-overline-he">שאלות</p>
      <h2 id="faq-title" className="cor-title mt-4 max-w-2xl text-foreground">
        מה שואלים לפני שקובעים.
      </h2>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="space-y-8">
          {surfaced.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-heading text-xl font-black leading-snug text-foreground">
                {q}
              </h3>
              <p className="mt-3 leading-relaxed text-foreground/80">{a}</p>
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-border">
          {rest.map(({ q, a }, i) => (
            <AccordionItem key={q} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="gap-4 py-5 text-right text-base font-bold text-foreground hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pt-1 leading-relaxed text-foreground/75">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FAQSection;
