import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import GuaranteeBlock from "@/components/GuaranteeBlock";
import { ACTIVE_VARIANT } from "@/data/guarantee";
import { GUARANTEE_VARIANTS } from "@/data/guaranteeVariants";

/**
 * Renders every guarantee variant as it would actually ship, so the decision is
 * taken against the rendered thing rather than a description of it.
 *
 * Internal, and gated the same way the case-intake tool is: compiled out of a
 * normal production build.
 *
 * The third option, shipping nothing, is what the site currently does, so it is
 * shown as the live state rather than as a mockup.
 */
const GuaranteeReview = () => {
  useDocumentMeta({
    title: "סקירת וריאציות האחריות, כלי פנימי",
    robots: "noindex,nofollow",
  });

  return (
    <div dir="rtl" className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-12">
        <header>
          <p className="cor-overline-he">כלי פנימי</p>
          <h1 className="cor-title mt-2">שלוש אפשרויות לאחריות</h1>
          <p className="cor-body-lg mt-4 text-foreground/80">
            אף אחת מהן אינה באוויר. כדי להעלות אחת, שנה את{" "}
            <code className="rounded bg-foreground/[0.07] px-1.5 py-0.5 text-sm">
              ACTIVE_VARIANT
            </code>{" "}
            בקובץ{" "}
            <code className="rounded bg-foreground/[0.07] px-1.5 py-0.5 text-sm">
              src/data/guarantee.ts
            </code>
            .
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            המצב הנוכחי:{" "}
            <span className="font-semibold text-foreground">{ACTIVE_VARIANT}</span>
          </p>
        </header>

        {GUARANTEE_VARIANTS.map((variant) => (
          <section key={variant.id} className="space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="cor-heading text-foreground">{variant.id}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {variant.reviewNote}
              </p>
            </div>

            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary">
              כפי שייראה ב-/protocol
            </p>
            <GuaranteeBlock variant={variant} />

            <p className="pt-2 text-[11px] font-semibold tracking-[0.16em] text-primary">
              כפי שייראה בעמוד הנחיתה
            </p>
            <GuaranteeBlock variant={variant} compact />
          </section>
        ))}

        <section className="space-y-3 border-t border-border pt-8">
          <h2 className="cor-heading text-foreground">none</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            אפס חשיפה, ואפס הפחתת סיכון. זה המצב באוויר כרגע: שני המשטחים
            מרנדרים כלום, ושאלת האחריות יורדת מה-FAQ.
          </p>
        </section>
      </div>
    </div>
  );
};

export default GuaranteeReview;
